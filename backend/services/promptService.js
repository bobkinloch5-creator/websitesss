const sql = require('../config/neon');

class PromptService {
  // Create a new prompt
  static async create(promptData) {
    try {
      const result = await sql`
        INSERT INTO prompts (user_id, project_id, prompt, ai_response, status, error, execution_time, completed_at)
        VALUES (
          ${promptData.userId},
          ${promptData.projectId || null},
          ${promptData.prompt},
          ${JSON.stringify(promptData.aiResponse || {})},
          ${promptData.status || 'pending'},
          ${promptData.error || null},
          ${promptData.executionTime || null},
          ${promptData.completedAt || null}
        )
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('PromptService.create error:', error);
      throw error;
    }
  }
  
  // Find prompt by ID
  static async findById(id) {
    try {
      const result = await sql`
        SELECT * FROM prompts 
        WHERE id = ${id}
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('PromptService.findById error:', error);
      throw error;
    }
  }
  
  // Find all prompts by user ID
  static async findByUserId(userId, limit = 50) {
    try {
      const result = await sql`
        SELECT * FROM prompts 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      
      return result || [];
    } catch (error) {
      console.error('PromptService.findByUserId error:', error);
      throw error;
    }
  }
  
  // Find prompts by project ID
  static async findByProjectId(projectId, userId = null) {
    try {
      let result;
      if (userId) {
        result = await sql`
          SELECT * FROM prompts 
          WHERE project_id = ${projectId} AND user_id = ${userId}
          ORDER BY created_at DESC
        `;
      } else {
        result = await sql`
          SELECT * FROM prompts 
          WHERE project_id = ${projectId}
          ORDER BY created_at DESC
        `;
      }
      
      return result || [];
    } catch (error) {
      console.error('PromptService.findByProjectId error:', error);
      throw error;
    }
  }
  
  // Update prompt
  static async update(promptId, updateData) {
    try {
      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.user_id;
      delete updateData.created_at;
      
      // Convert camelCase to snake_case and prepare data
      const updates = {};
      if (updateData.projectId !== undefined) updates.project_id = updateData.projectId;
      if (updateData.prompt !== undefined) updates.prompt = updateData.prompt;
      if (updateData.aiResponse !== undefined) updates.ai_response = JSON.stringify(updateData.aiResponse);
      if (updateData.status !== undefined) updates.status = updateData.status;
      if (updateData.error !== undefined) updates.error = updateData.error;
      if (updateData.executionTime !== undefined) updates.execution_time = updateData.executionTime;
      if (updateData.completedAt !== undefined) updates.completed_at = updateData.completedAt;
      
      // Build update query dynamically
      const updateKeys = Object.keys(updates);
      if (updateKeys.length === 0) {
        return await this.findById(promptId);
      }
      
      const setClause = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = updateKeys.map(key => updates[key]);
      values.push(promptId);
      
      const query = `
        UPDATE prompts 
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *
      `;
      
      const result = await sql.unsafe(query, values);
      return result[0] || null;
    } catch (error) {
      console.error('PromptService.update error:', error);
      throw error;
    }
  }
  
  // Update prompt status based on actions
  static async updateStatus(promptId) {
    try {
      // Get prompt with its actions
      const prompt = await this.findById(promptId);
      if (!prompt) throw new Error('Prompt not found');
      
      const aiResponse = typeof prompt.ai_response === 'string' 
        ? JSON.parse(prompt.ai_response) 
        : prompt.ai_response;
      
      const actions = aiResponse?.actions || [];
      if (actions.length === 0) {
        return await this.update(promptId, { status: 'failed' });
      }
      
      const completed = actions.filter(a => a.status === 'completed').length;
      const failed = actions.filter(a => a.status === 'failed').length;
      const total = actions.length;
      
      let newStatus = 'processing';
      let completedAt = null;
      
      if (completed === total) {
        newStatus = 'completed';
        completedAt = new Date().toISOString();
      } else if (failed === total) {
        newStatus = 'failed';
      } else if (completed > 0 || failed > 0) {
        newStatus = 'partial';
      }
      
      return await this.update(promptId, { 
        status: newStatus,
        completedAt: completedAt
      });
    } catch (error) {
      console.error('PromptService.updateStatus error:', error);
      throw error;
    }
  }
  
  // Delete prompt
  static async delete(promptId, userId) {
    try {
      await sql`
        DELETE FROM prompts 
        WHERE id = ${promptId} AND user_id = ${userId}
      `;
      
      return true;
    } catch (error) {
      console.error('PromptService.delete error:', error);
      throw error;
    }
  }
  
  // Get prompt count for user
  static async countByUserId(userId) {
    try {
      const result = await sql`
        SELECT COUNT(*) as count 
        FROM prompts 
        WHERE user_id = ${userId}
      `;
      
      return parseInt(result[0]?.count || 0);
    } catch (error) {
      console.error('PromptService.countByUserId error:', error);
      throw error;
    }
  }
  
  // Get recent prompts across all users (admin only)
  static async getRecent(limit = 50) {
    try {
      const result = await sql`
        SELECT p.*, u.email, u.role 
        FROM prompts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `;
      
      return result || [];
    } catch (error) {
      console.error('PromptService.getRecent error:', error);
      throw error;
    }
  }
  
  // Get prompt statistics
  static async getStats(userId = null) {
    try {
      let result;
      if (userId) {
        result = await sql`
          SELECT status, COUNT(*) as count 
          FROM prompts 
          WHERE user_id = ${userId}
          GROUP BY status
        `;
      } else {
        result = await sql`
          SELECT status, COUNT(*) as count 
          FROM prompts 
          GROUP BY status
        `;
      }
      
      // Initialize stats object
      const stats = {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        partial: 0
      };
      
      // Populate stats from results
      result.forEach(row => {
        const count = parseInt(row.count);
        stats[row.status] = count;
        stats.total += count;
      });
      
      return stats;
    } catch (error) {
      console.error('PromptService.getStats error:', error);
      throw error;
    }
  }
}

module.exports = PromptService;
