const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ProjectService = require('../services/projectService');

router.get('/:userId', auth, async (req, res) => {
  try {
    const projects = await ProjectService.findByUserId(req.params.userId);
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/save', auth, async (req, res) => {
  try {
    const { name, description, placeId, data, context, version, isPublic, thumbnail } = req.body;
    const project = await ProjectService.create({
      userId: req.user.id,
      name,
      description,
      placeId,
      data,
      context,
      version,
      isPublic,
      thumbnail
    });
    res.json({ success: true, project });
  } catch (error) {
    console.error('Save project error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/export', auth, async (req, res) => {
  try {
    const project = await ProjectService.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({
      name: project.name,
      data: project.data,
      base64: Buffer.from(project.data).toString('base64')
    });
  } catch (error) {
    console.error('Export project error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add update endpoint
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await ProjectService.update(req.params.id, req.user.id, req.body);
    if (!project) return res.status(404).json({ error: 'Project not found or unauthorized' });
    res.json({ success: true, project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add delete endpoint
router.delete('/:id', auth, async (req, res) => {
  try {
    await ProjectService.delete(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
