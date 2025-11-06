const supabase = require('../config/supabase');

class PromptService {
  // Create a new prompt
  static async create(promptData) {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert([{
          user_id: promptData.userId,
          project_id: promptData.projectId || null,
          prompt: promptData.prompt,
          ai_response: promptData.aiResponse || {},
          status: promptData.status || 'pending',
          error: promptData.error || null,
          execution_time: promptData.executionTime || null,
          completed_at: promptData.completedAt || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find prompt by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find all prompts by user ID
  static async findByUserId(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }
  
  // Find prompts by project ID
  static async findByProjectId(projectId, userId = null) {
    try {
      let query = supabase
        .from('prompts')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      // Filter by user if provided (for security)
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
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
      
      // Convert camelCase to snake_case for database
      const dbData = {};
      if (updateData.projectId !== undefined) dbData.project_id = updateData.projectId;
      if (updateData.prompt !== undefined) dbData.prompt = updateData.prompt;
      if (updateData.aiResponse !== undefined) dbData.ai_response = updateData.aiResponse;
      if (updateData.status !== undefined) dbData.status = updateData.status;
      if (updateData.error !== undefined) dbData.error = updateData.error;
      if (updateData.executionTime !== undefined) dbData.execution_time = updateData.executionTime;
      if (updateData.completedAt !== undefined) dbData.completed_at = updateData.completedAt;
      
      const { data, error } = await supabase
        .from('prompts')
        .update(dbData)
        .eq('id', promptId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Update prompt status based on actions
  static async updateStatus(promptId) {
    try {
      // Get prompt with its actions
      const prompt = await this.findById(promptId);
      if (!prompt) throw new Error('Prompt not found');
      
      const actions = prompt.ai_response?.actions || [];
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
      throw error;
    }
  }
  
  // Delete prompt
  static async delete(promptId, userId) {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', promptId)
        .eq('user_id', userId); // Ensure user owns the prompt
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Get prompt count for user
  static async countByUserId(userId) {
    try {
      const { count, error } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Get recent prompts across all users (admin only)
  static async getRecent(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          users:user_id (email, role)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }
  
  // Get prompt statistics
  static async getStats(userId = null) {
    try {
      let query = supabase
        .from('prompts')
        .select('status', { count: 'exact' });
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Group by status
      const stats = {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        partial: 0
      };
      
      if (data) {
        data.forEach(item => {
          stats[item.status] = (stats[item.status] || 0) + 1;
          stats.total++;
        });
      }
      
      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PromptService;
