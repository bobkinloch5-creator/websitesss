const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const auth = require('../middleware/auth');
const crypto = require('crypto');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const role = email.toLowerCase() === process.env.OWNER_EMAIL ? 'owner' : 'user';
    const user = await UserService.create({
      email: email.toLowerCase(),
      password,
      role
    });
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        apiKey: user.api_key,
        promptsRemaining: UserService.getPromptsRemaining(user)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await UserService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await UserService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is disabled' });
    }
    await UserService.resetIfNewDay(user.id);
    await UserService.updateLastLogin(user.id);
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        apiKey: user.api_key,
        promptsRemaining: UserService.getPromptsRemaining(user)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    await UserService.resetIfNewDay(req.user.id);
    const user = await UserService.findById(req.user.id);
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        apiKey: user.api_key,
        promptsRemaining: UserService.getPromptsRemaining(user),
        promptsUsed: user.prompts_used,
        promptLimit: user.prompt_limit
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Verify plugin API key
router.get('/verify-plugin', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ valid: false, error: 'API key required' });
    }
    const user = await UserService.findByApiKey(key);
    if (!user || !user.is_active) {
      return res.status(401).json({ valid: false, error: 'Invalid API key' });
    }
    res.json({
      valid: true,
      userId: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Plugin verification error:', error);
    res.status(500).json({ valid: false, error: 'Verification failed' });
  }
});

// Regenerate API key
router.post('/regenerate-key', auth, async (req, res) => {
  try {
    const newApiKey = crypto.randomBytes(32).toString('hex');
    const updatedUser = await UserService.update(req.user.id, { api_key: newApiKey });
    res.json({
      success: true,
      apiKey: updatedUser.api_key
    });
  } catch (error) {
    console.error('Regenerate key error:', error);
    res.status(500).json({ error: 'Failed to regenerate API key' });
  }
});


module.exports = router;
