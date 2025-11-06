const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const crypto = require('crypto');

// Encryption setup for AWS credentials
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-cbc';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  try {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

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

// Get AWS credentials
router.get('/aws-credentials', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('aws_access_key, aws_secret_key, aws_region, aws_configured')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    if (!data.aws_configured) {
      return res.json({ configured: false });
    }

    res.json({
      configured: true,
      accessKeyId: data.aws_access_key ? decrypt(data.aws_access_key) : null,
      secretAccessKey: data.aws_secret_key ? decrypt(data.aws_secret_key) : null,
      region: data.aws_region || 'us-east-1',
    });
  } catch (error) {
    console.error('Error fetching AWS credentials:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

// Save AWS credentials
router.post('/aws-credentials', authenticateUser, async (req, res) => {
  try {
    const { accessKeyId, secretAccessKey, region } = req.body;

    if (!accessKeyId || !secretAccessKey) {
      return res.status(400).json({ error: 'Missing required credentials' });
    }

    // Encrypt credentials
    const encryptedAccessKey = encrypt(accessKeyId);
    const encryptedSecretKey = encrypt(secretAccessKey);

    const { error } = await supabase
      .from('profiles')
      .update({
        aws_access_key: encryptedAccessKey,
        aws_secret_key: encryptedSecretKey,
        aws_region: region || 'us-east-1',
        aws_configured: true,
      })
      .eq('id', req.user.id);

    if (error) throw error;

    res.json({ success: true, message: 'AWS credentials saved successfully' });
  } catch (error) {
    console.error('Error saving AWS credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
});

// Delete AWS credentials
router.delete('/aws-credentials', authenticateUser, async (req, res) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        aws_access_key: null,
        aws_secret_key: null,
        aws_region: null,
        aws_configured: false,
      })
      .eq('id', req.user.id);

    if (error) throw error;

    res.json({ success: true, message: 'AWS credentials deleted successfully' });
  } catch (error) {
    console.error('Error deleting AWS credentials:', error);
    res.status(500).json({ error: 'Failed to delete credentials' });
  }
});

module.exports = router;
