const mongoose = require('mongoose');

const careLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  activityType: {
    type: String,
    enum: ['watering', 'fertilizing', 'pruning', 'repotting', 'inspection', 'harvesting', 'other'],
    required: true
  },
  activityDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  },
  image: {
    url: {
      type: String
    },
    publicId: {
      type: String
    }
  },
  // For tracking measurements
  measurements: {
    height: {
      type: Number, // in cm
      default: 0
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100
    },
    observedIssues: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
careLogSchema.index({ plantId: 1, activityDate: -1 });
careLogSchema.index({ userId: 1, activityDate: -1 });

module.exports = mongoose.model('CareLog', careLogSchema);