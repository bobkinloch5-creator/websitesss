const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sql = require('../config/neon');

// Get chat history for a project
router.get('/history/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await sql`
      SELECT * FROM chat_messages
      WHERE user_id = ${req.user.id} AND project_id = ${projectId}
      ORDER BY created_at ASC
      LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
    `;

    res.json({ messages: result || [] });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Save a chat message
router.post('/message', auth, async (req, res) => {
  try {
    const { projectId, type, content, options } = req.body;

    if (!projectId || !type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await sql`
      INSERT INTO chat_messages (user_id, project_id, type, content, options)
      VALUES (
        ${req.user.id},
        ${projectId},
        ${type},
        ${content},
        ${options ? JSON.stringify(options) : null}
      )
      RETURNING *
    `;

    res.json({ success: true, message: result[0] });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Delete chat history for a project
router.delete('/history/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    await sql`
      DELETE FROM chat_messages
      WHERE user_id = ${req.user.id} AND project_id = ${projectId}
    `;

    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Failed to delete chat history' });
  }
});

// Get all conversations (grouped by project)
router.get('/conversations', auth, async (req, res) => {
  try {
    const result = await sql`
      SELECT DISTINCT ON (project_id) 
        project_id, 
        created_at as last_message
      FROM chat_messages
      WHERE user_id = ${req.user.id}
      ORDER BY project_id, created_at DESC
    `;

    const conversations = result.map(row => ({
      projectId: row.project_id,
      lastMessage: row.last_message
    }));

    res.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

module.exports = router;
