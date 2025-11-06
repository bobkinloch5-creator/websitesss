const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: ['insert_model', 'create_script', 'modify_terrain', 'set_lighting', 'create_ui', 'other']
  },
  description: String,
  data: mongoose.Schema.Types.Mixed,
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  error: String,
  completedAt: Date
});

const PromptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 2000
  },
  aiResponse: {
    plan: String,
    actions: [ActionSchema],
    rawResponse: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'partial'],
    default: 'pending'
  },
  error: String,
  executionTime: Number,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  completedAt: Date
}, {
  timestamps: true
});

PromptSchema.methods.updateStatus = function() {
  const actions = this.aiResponse?.actions || [];
  if (actions.length === 0) {
    this.status = 'failed';
    return;
  }
  const completed = actions.filter(a => a.status === 'completed').length;
  const failed = actions.filter(a => a.status === 'failed').length;
  const total = actions.length;
  if (completed === total) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else if (failed === total) {
    this.status = 'failed';
  } else if (completed > 0 || failed > 0) {
    this.status = 'partial';
  } else {
    this.status = 'processing';
  }
};

PromptSchema.index({ userId: 1, createdAt: -1 });
PromptSchema.index({ status: 1 });

module.exports = mongoose.model('Prompt', PromptSchema);
