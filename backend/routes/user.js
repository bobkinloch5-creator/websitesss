const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sql = require('../config/neon');
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

// Get AWS credentials
router.get('/aws-credentials', auth, async (req, res) => {
  try {
    const result = await sql`
      SELECT aws_access_key, aws_secret_key, aws_region, aws_configured 
      FROM users 
      WHERE id = ${req.user.id}
      LIMIT 1
    `;

    const user = result[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.aws_configured) {
      return res.json({ configured: false });
    }

    res.json({
      configured: true,
      accessKeyId: user.aws_access_key ? decrypt(user.aws_access_key) : null,
      secretAccessKey: user.aws_secret_key ? decrypt(user.aws_secret_key) : null,
      region: user.aws_region || 'us-east-1',
    });
  } catch (error) {
    console.error('Error fetching AWS credentials:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

// Save AWS credentials
router.post('/aws-credentials', auth, async (req, res) => {
  try {
    const { accessKeyId, secretAccessKey, region } = req.body;

    if (!accessKeyId || !secretAccessKey) {
      return res.status(400).json({ error: 'Missing required credentials' });
    }

    // Encrypt credentials
    const encryptedAccessKey = encrypt(accessKeyId);
    const encryptedSecretKey = encrypt(secretAccessKey);

    await sql`
      UPDATE users 
      SET 
        aws_access_key = ${encryptedAccessKey},
        aws_secret_key = ${encryptedSecretKey},
        aws_region = ${region || 'us-east-1'},
        aws_configured = true
      WHERE id = ${req.user.id}
    `;

    res.json({ success: true, message: 'AWS credentials saved successfully' });
  } catch (error) {
    console.error('Error saving AWS credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
});

// Delete AWS credentials
router.delete('/aws-credentials', auth, async (req, res) => {
  try {
    await sql`
      UPDATE users 
      SET 
        aws_access_key = NULL,
        aws_secret_key = NULL,
        aws_region = NULL,
        aws_configured = false
      WHERE id = ${req.user.id}
    `;

    res.json({ success: true, message: 'AWS credentials deleted successfully' });
  } catch (error) {
    console.error('Error deleting AWS credentials:', error);
    res.status(500).json({ error: 'Failed to delete credentials' });
  }
});

module.exports = router;
