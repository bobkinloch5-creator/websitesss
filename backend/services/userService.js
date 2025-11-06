const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

class UserService {
  // Create a new user
  static async create(userData) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      
      // Insert user
      const { data, error } = await supabase
        .from('users')
        .insert([{
          email: userData.email.toLowerCase().trim(),
          password: hashedPassword,
          role: userData.role || 'user',
          api_key: apiKey,
          prompts_used: 0,
          prompt_limit: 15,
          last_reset: new Date().toISOString(),
          is_active: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Remove password from response
      delete data.password;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by API key
  static async findByApiKey(apiKey) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('api_key', apiKey)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Compare password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
  
  // Check if user is owner
  static isOwner(user) {
    return user.email === process.env.OWNER_EMAIL || user.role === 'owner';
  }
  
  // Reset user's daily prompt count if new day
  static async resetIfNewDay(userId) {
    try {
      const user = await this.findById(userId);
      if (!user) return false;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = new Date(user.last_reset);
      lastReset.setHours(0, 0, 0, 0);
      
      if (lastReset < today) {
        const { error } = await supabase
          .from('users')
          .update({
            prompts_used: 0,
            last_reset: new Date().toISOString()
          })
          .eq('id', userId);
        
        if (error) throw error;
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
  
  // Get remaining prompts for user
  static getPromptsRemaining(user) {
    if (this.isOwner(user)) return 'unlimited';
    return Math.max(0, user.prompt_limit - user.prompts_used);
  }
  
  // Check if user can use a prompt
  static canUsePrompt(user) {
    if (this.isOwner(user)) return true;
    return user.prompts_used < user.prompt_limit;
  }
  
  // Increment prompt usage
  static async usePrompt(userId) {
    try {
      const user = await this.findById(userId);
      if (!user) throw new Error('User not found');
      
      if (!this.isOwner(user)) {
        const { error } = await supabase
          .from('users')
          .update({
            prompts_used: user.prompts_used + 1
          })
          .eq('id', userId);
        
        if (error) throw error;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Update last login
  static async updateLastLogin(userId) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  // Get all users (admin only)
  static async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, prompts_used, prompt_limit, last_login, is_active, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  // Update user
  static async update(userId, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.api_key;
      delete updateData.created_at;
      
      // Hash password if being updated
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Remove password from response
      delete data.password;
      return data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
