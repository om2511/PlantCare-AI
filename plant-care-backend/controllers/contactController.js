const ContactMessage = require('../models/ContactMessage');

const emailRegex = /^\S+@\S+\.\S+$/;

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required'
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const normalizedPayload = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      message: String(message).trim()
    };

    await ContactMessage.create({
      ...normalizedPayload,
      meta: {
        userAgent: req.get('user-agent') || '',
        ip: req.ip || req.connection?.remoteAddress || ''
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message submitted successfully'
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit message'
    });
  }
};

module.exports = { submitContactMessage };
