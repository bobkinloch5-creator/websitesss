const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'user'],
    default: 'user'
  },
  apiKey: {
    type: String,
    unique: true,
    required: true
  },
  promptsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  promptLimit: {
    type: Number,
    default: 15,
    min: 0
  },
  lastReset: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.pre('save', function(next) {
  if (!this.apiKey) {
    this.apiKey = crypto.randomBytes(32).toString('hex');
  }
  next();
});

UserSchema.methods.isOwner = function() {
  return this.email === process.env.OWNER_EMAIL || this.role === 'owner';
};

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.resetIfNewDay = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastReset = new Date(this.lastReset);
  lastReset.setHours(0, 0, 0, 0);
  if (lastReset < today) {
    this.promptsUsed = 0;
    this.lastReset = new Date();
    await this.save();
    return true;
  }
  return false;
};

UserSchema.methods.getPromptsRemaining = function() {
  if (this.isOwner()) return 'unlimited';
  return Math.max(0, this.promptLimit - this.promptsUsed);
};

UserSchema.methods.canUsePrompt = function() {
  if (this.isOwner()) return true;
  return this.promptsUsed < this.promptLimit;
};

UserSchema.methods.usePrompt = async function() {
  if (!this.isOwner()) {
    this.promptsUsed += 1;
    await this.save();
  }
};

UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
