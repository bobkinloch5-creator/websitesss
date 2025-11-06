const supabase = require('../config/supabase');

class ProjectService {
  // Create a new project
  static async create(projectData) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: projectData.userId,
          name: projectData.name.trim(),
          description: projectData.description || null,
          place_id: projectData.placeId || null,
          thumbnail: projectData.thumbnail || null,
          data: projectData.data || '',
          context: projectData.context || {},
          version: projectData.version || 1,
          is_public: projectData.isPublic || false
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find project by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find all projects by user ID
  static async findByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw error;
    }
  }
  
  // Find public projects
  static async findPublic(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
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
      
      // Convert camelCase to snake_case for database
      const dbData = {};
      if (updateData.name !== undefined) dbData.name = updateData.name.trim();
      if (updateData.description !== undefined) dbData.description = updateData.description;
      if (updateData.placeId !== undefined) dbData.place_id = updateData.placeId;
      if (updateData.thumbnail !== undefined) dbData.thumbnail = updateData.thumbnail;
      if (updateData.data !== undefined) dbData.data = updateData.data;
      if (updateData.context !== undefined) dbData.context = updateData.context;
      if (updateData.version !== undefined) dbData.version = updateData.version;
      if (updateData.isPublic !== undefined) dbData.is_public = updateData.isPublic;
      
      const { data, error } = await supabase
        .from('projects')
        .update(dbData)
        .eq('id', projectId)
        .eq('user_id', userId) // Ensure user owns the project
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete project
  static async delete(projectId, userId) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId); // Ensure user owns the project
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Get project count for user
  static async countByUserId(userId) {
    try {
      const { count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Search projects
  static async search(userId, searchQuery) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
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
      
      // Create clone
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          user_id: userId,
          name: newName || `${original.name} (Copy)`,
          description: original.description,
          place_id: original.place_id,
          thumbnail: original.thumbnail,
          data: original.data,
          context: original.context,
          version: original.version,
          is_public: false // Clones start as private
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProjectService;
