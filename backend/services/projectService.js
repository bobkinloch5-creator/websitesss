const sql = require('../config/neon');

class ProjectService {
  // Create a new project
  static async create(projectData) {
    try {
      const result = await sql`
        INSERT INTO projects (user_id, name, description, place_id, thumbnail, data, context, version, is_public)
        VALUES (
          ${projectData.userId},
          ${projectData.name.trim()},
          ${projectData.description || null},
          ${projectData.placeId || null},
          ${projectData.thumbnail || null},
          ${projectData.data || ''},
          ${JSON.stringify(projectData.context || {})},
          ${projectData.version || 1},
          ${projectData.isPublic || false}
        )
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('ProjectService.create error:', error);
      throw error;
    }
  }
  
  // Find project by ID
  static async findById(id) {
    try {
      const result = await sql`
        SELECT * FROM projects 
        WHERE id = ${id}
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('ProjectService.findById error:', error);
      throw error;
    }
  }
  
  // Find all projects by user ID
  static async findByUserId(userId) {
    try {
      const result = await sql`
        SELECT * FROM projects 
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
      
      return result || [];
    } catch (error) {
      console.error('ProjectService.findByUserId error:', error);
      throw error;
    }
  }
  
  // Find public projects
  static async findPublic(limit = 50) {
    try {
      const result = await sql`
        SELECT * FROM projects 
        WHERE is_public = true
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      
      return result || [];
    } catch (error) {
      console.error('ProjectService.findPublic error:', error);
      throw error;
    }
  }
  
  // Update project
  static async update(projectId, userId, updateData) {
    try {
      // Remove fields that shouldn't be updated
      delete updateData.id;
      delete updateData.user_id;
      delete updateData.created_at;
      
      // Convert camelCase to snake_case and prepare data
      const updates = {};
      if (updateData.name !== undefined) updates.name = updateData.name.trim();
      if (updateData.description !== undefined) updates.description = updateData.description;
      if (updateData.placeId !== undefined) updates.place_id = updateData.placeId;
      if (updateData.thumbnail !== undefined) updates.thumbnail = updateData.thumbnail;
      if (updateData.data !== undefined) updates.data = updateData.data;
      if (updateData.context !== undefined) updates.context = JSON.stringify(updateData.context);
      if (updateData.version !== undefined) updates.version = updateData.version;
      if (updateData.isPublic !== undefined) updates.is_public = updateData.isPublic;
      
      // Build update query dynamically
      const updateKeys = Object.keys(updates);
      if (updateKeys.length === 0) {
        return await this.findById(projectId);
      }
      
      const setClause = updateKeys.map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = updateKeys.map(key => updates[key]);
      values.push(userId);
      values.push(projectId);
      
      const query = `
        UPDATE projects 
        SET ${setClause}, updated_at = NOW(), last_modified = NOW()
        WHERE user_id = $${values.length - 1} AND id = $${values.length}
        RETURNING *
      `;
      
      const result = await sql.unsafe(query, values);
      return result[0] || null;
    } catch (error) {
      console.error('ProjectService.update error:', error);
      throw error;
    }
  }
  
  // Delete project
  static async delete(projectId, userId) {
    try {
      await sql`
        DELETE FROM projects 
        WHERE id = ${projectId} AND user_id = ${userId}
      `;
      
      return true;
    } catch (error) {
      console.error('ProjectService.delete error:', error);
      throw error;
    }
  }
  
  // Get project count for user
  static async countByUserId(userId) {
    try {
      const result = await sql`
        SELECT COUNT(*) as count 
        FROM projects 
        WHERE user_id = ${userId}
      `;
      
      return parseInt(result[0]?.count || 0);
    } catch (error) {
      console.error('ProjectService.countByUserId error:', error);
      throw error;
    }
  }
  
  // Search projects
  static async search(userId, searchQuery) {
    try {
      const searchPattern = `%${searchQuery}%`;
      const result = await sql`
        SELECT * FROM projects 
        WHERE user_id = ${userId}
        AND (name ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
        ORDER BY created_at DESC
      `;
      
      return result || [];
    } catch (error) {
      console.error('ProjectService.search error:', error);
      throw error;
    }
  }
  
  // Clone project
  static async clone(projectId, userId, newName) {
    try {
      // Get original project
      const original = await this.findById(projectId);
      if (!original) throw new Error('Project not found');
      
      // Check if user owns it or it's public
      if (original.user_id !== userId && !original.is_public) {
        throw new Error('Unauthorized to clone this project');
      }
      
      // Parse context if it's a string
      const context = typeof original.context === 'string' 
        ? JSON.parse(original.context) 
        : original.context;
      
      // Create clone
      const result = await sql`
        INSERT INTO projects (user_id, name, description, place_id, thumbnail, data, context, version, is_public)
        VALUES (
          ${userId},
          ${newName || `${original.name} (Copy)`},
          ${original.description},
          ${original.place_id},
          ${original.thumbnail},
          ${original.data},
          ${JSON.stringify(context)},
          ${original.version},
          false
        )
        RETURNING *
      `;
      
      return result[0];
    } catch (error) {
      console.error('ProjectService.clone error:', error);
      throw error;
    }
  }
}

module.exports = ProjectService;
