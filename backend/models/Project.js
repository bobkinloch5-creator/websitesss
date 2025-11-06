const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  placeId: {
    type: String,
    sparse: true
  },
  thumbnail: {
    type: String
  },
  data: {
    type: String,
    default: ''
  },
  context: {
    type: Object,
    default: {}
  },
  version: {
    type: Number,
    default: 1
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ProjectSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

ProjectSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Project', ProjectSchema);
