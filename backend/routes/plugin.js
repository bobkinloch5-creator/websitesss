const express = require('express');
const router = express.Router();
const PromptService = require('../services/promptService');
const UserService = require('../services/userService');

// Get changes for a specific project (called by plugin)
router.get('/changes/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Get API key from header or query
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }
    
    const user = await UserService.findByApiKey(apiKey);
    if (!user) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    // Get pending prompts for this project
    const prompts = await PromptService.findByProjectId(projectId, user.id);
    const pendingActions = [];
    
    for (const prompt of prompts) {
      if (prompt.ai_response && prompt.ai_response.actions) {
        const pending = prompt.ai_response.actions.filter(
          action => action.status === 'pending' || !action.status
        );
        pendingActions.push(...pending);
      }
    }
    
    res.json({ actions: pendingActions });
  } catch (error) {
    console.error('Get plugin changes error:', error);
    res.status(500).json({ error: error.message, actions: [] });
  }
});

// Get actions for plugin (legacy endpoint)
router.get('/actions/:apiKey', async (req, res) => {
  try {
    const user = await UserService.findByApiKey(req.params.apiKey);
    if (!user) return res.status(401).json({ error: 'Invalid API key' });
    
    // Get most recent pending prompt for this user
    const prompts = await PromptService.findByUserId(user.id, 1);
    const prompt = prompts.find(p => p.status === 'pending');
    
    if (!prompt || !prompt.ai_response || !prompt.ai_response.actions) {
      return res.json({ actions: [] });
    }
    
    res.json({ actions: prompt.ai_response.actions });
  } catch (error) {
    console.error('Get plugin actions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark action as complete
router.post('/complete/:actionId', async (req, res) => {
  try {
    const { status, error, projectId } = req.body;
    
    // Find all recent prompts that might contain this action
    const prompts = await PromptService.getRecent(100);
    let targetPrompt = null;
    let targetAction = null;
    
    for (const prompt of prompts) {
      if (prompt.ai_response && prompt.ai_response.actions) {
        const action = prompt.ai_response.actions.find(a => a.id === req.params.actionId);
        if (action) {
          targetPrompt = prompt;
          targetAction = action;
          break;
        }
      }
    }
    
    if (!targetPrompt || !targetAction) {
      return res.status(404).json({ error: 'Action not found' });
    }
    
    // Update action status
    targetAction.status = status;
    if (status === 'completed') {
      targetAction.completedAt = new Date().toISOString();
    }
    if (error) {
      targetAction.error = error;
    }
    
    // Update prompt with modified actions
    await PromptService.update(targetPrompt.id, {
      aiResponse: targetPrompt.ai_response
    });
    
    // Update overall prompt status
    await PromptService.updateStatus(targetPrompt.id);
    
    // Notify website via WebSocket
    const io = req.app.get('io');
    if (io && targetPrompt.user_id) {
      const user = await UserService.findById(targetPrompt.user_id);
      if (user && user.api_key) {
        if (status === 'completed') {
          io.to(`user_${user.api_key}`).emit('action_completed', {
            actionId: req.params.actionId,
            description: targetAction.description,
            projectId: projectId || targetPrompt.project_id
          });
        } else if (status === 'failed') {
          io.to(`user_${user.api_key}`).emit('action_failed', {
            actionId: req.params.actionId,
            description: targetAction.description,
            error: error,
            projectId: projectId || targetPrompt.project_id
          });
        }
      }
    }
    
    console.log(`✅ Action ${req.params.actionId} ${status}`);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Complete action error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
