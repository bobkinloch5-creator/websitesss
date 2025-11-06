const sql = require('../config/neon');
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
      
      // Insert user into Neon database
      const result = await sql`
        INSERT INTO users (email, password, role, api_key, prompts_used, prompt_limit, last_reset, is_active)
        VALUES (
          ${userData.email.toLowerCase().trim()},
          ${hashedPassword},
          ${userData.role || 'user'},
          ${apiKey},
          0,
          15,
          NOW(),
          true
        )
        RETURNING id, email, role, api_key, prompts_used, prompt_limit, last_reset, last_login, is_active, created_at
      `;
      
      return result[0];
    } catch (error) {
      console.error('UserService.create error:', error);
      throw error;
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE email = ${email.toLowerCase().trim()}
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('UserService.findByEmail error:', error);
      throw error;
    }
  }
  
  // Find user by ID
  static async findById(id) {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE id = ${id}
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('UserService.findById error:', error);
      throw error;
    }
  }
  
  // Find user by API key
  static async findByApiKey(apiKey) {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE api_key = ${apiKey} AND is_active = true
        LIMIT 1
      `;
      
      return result[0] || null;
    } catch (error) {
      console.error('UserService.findByApiKey error:', error);
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
        await sql`
          UPDATE users 
          SET prompts_used = 0, last_reset = NOW()
          WHERE id = ${userId}
        `;
        return true;
      }
      return false;
    } catch (error) {
      console.error('UserService.resetIfNewDay error:', error);
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
        await sql`
          UPDATE users 
          SET prompts_used = prompts_used + 1
          WHERE id = ${userId}
        `;
      }
      return true;
    } catch (error) {
      console.error('UserService.usePrompt error:', error);
      throw error;
    }
  }
  
  // Update last login
  static async updateLastLogin(userId) {
    try {
      await sql`
        UPDATE users 
        SET last_login = NOW()
        WHERE id = ${userId}
      `;
      return true;
    } catch (error) {
      console.error('UserService.updateLastLogin error:', error);
      throw error;
    }
  }
  
  // Get all users (admin only)
  static async getAllUsers() {
    try {
      const result = await sql`
        SELECT id, email, role, prompts_used, prompt_limit, last_login, is_active, created_at
        FROM users
        ORDER BY created_at DESC
      `;
      
      return result;
    } catch (error) {
      console.error('UserService.getAllUsers error:', error);
      throw error;
    }
  }
  
  // Update user
  static async update(userId, updateData) {
    try {
      // Remove fields that shouldn't be updated directly
      delete updateData.id;
      delete updateData.created_at;
      
      // Hash password if being updated
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }
      
      // Build update query dynamically
      const updates = [];
      const values = [];
      let paramIndex = 1;
      
      for (const [key, value] of Object.entries(updateData)) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
      
      if (updates.length === 0) {
        return await this.findById(userId);
      }
      
      values.push(userId);
      const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${paramIndex}
        RETURNING id, email, role, api_key, prompts_used, prompt_limit, last_reset, last_login, is_active, created_at
      `;
      
      const result = await sql.unsafe(query, values);
      return result[0] || null;
    } catch (error) {
      console.error('UserService.update error:', error);
      throw error;
    }
  }
}

module.exports = UserService;
