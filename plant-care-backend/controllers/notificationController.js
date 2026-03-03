const PushSubscription = require('../models/PushSubscription');
const { sendToUser } = require('../services/notificationService');

// @desc    Return VAPID public key (no auth required)
// @route   GET /api/notifications/vapid-key
// @access  Public
const getVapidPublicKey = (req, res) => {
  res.json({ success: true, publicKey: process.env.VAPID_PUBLIC_KEY });
};

// @desc    Save push subscription and send welcome notification
// @route   POST /api/notifications/subscribe
// @access  Private
const subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ success: false, message: 'Invalid subscription object' });
    }

    // Upsert by endpoint so re-subscribing is idempotent
    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { userId: req.user._id, endpoint, keys },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send welcome notification
    await sendToUser(req.user._id, {
      title: '🌱 Notifications Active!',
      body: 'You\'ll now receive plant care reminders and disease alerts.',
      data: { url: '/dashboard' }
    });

    res.json({ success: true, message: 'Subscribed to notifications' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
};

// @desc    Remove push subscription
// @route   DELETE /api/notifications/unsubscribe
// @access  Private
const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint required' });
    }

    await PushSubscription.deleteOne({ endpoint, userId: req.user._id });

    res.json({ success: true, message: 'Unsubscribed from notifications' });
  } catch (err) {
    console.error('Unsubscribe error:', err);
    res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
};

module.exports = { getVapidPublicKey, subscribe, unsubscribe };
