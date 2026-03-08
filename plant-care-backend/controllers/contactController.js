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

// @desc    Get submitted contact messages (admin only)
// @route   GET /api/contact/messages
// @access  Private (admin)
const getContactMessages = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
};

module.exports = { submitContactMessage, getContactMessages };
