const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: 180
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000
  },
  meta: {
    userAgent: {
      type: String,
      default: '',
      maxlength: 500
    },
    ip: {
      type: String,
      default: '',
      maxlength: 120
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
