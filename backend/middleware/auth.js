const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserService.findById(decoded.userId);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
