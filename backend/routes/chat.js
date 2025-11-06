const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Middleware to verify user
async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}

// Get chat history for a project
router.get('/history/:projectId', authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({ messages: data || [] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Save a chat message
router.post('/message', authenticateUser, async (req, res) => {
  try {
    const { projectId, type, content, options } = req.body;

    if (!projectId || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          user_id: req.user.id,
          project_id: projectId,
          type: type, // 'user', 'ai', or 'plan'
          content: content,
          options: options || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: data });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Delete chat history for a project
router.delete('/history/:projectId', authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', req.user.id)
      .eq('project_id', projectId);

    if (error) throw error;

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

// Get all conversations (grouped by project)
router.get('/conversations', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('project_id, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group by project_id and get latest message
    const conversations = {};
    (data || []).forEach(msg => {
      if (!conversations[msg.project_id]) {
        conversations[msg.project_id] = {
          projectId: msg.project_id,
          lastMessage: msg.created_at,
        };
      }
    });

    res.json({ conversations: Object.values(conversations) });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

module.exports = router;
