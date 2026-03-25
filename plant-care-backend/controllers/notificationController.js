const PushSubscription = require('../models/PushSubscription');
const { sendToUser, isPushConfigured } = require('../services/notificationService');

// @desc    Return VAPID public key (no auth required)
// @route   GET /api/notifications/vapid-key
// @access  Public
const getVapidPublicKey = (req, res) => {
  if (!isPushConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Push notifications are not configured on the server'
    });
  }

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

// @desc    Send test notification to current user
// @route   POST /api/notifications/test
// @access  Private
const sendTestNotification = async (req, res) => {
  try {
    if (!isPushConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Push notifications are not configured on the server'
      });
    }

    await sendToUser(req.user._id, {
      title: 'PlantCare AI Test Notification',
      body: 'If you can see this on your device, push delivery is working.',
      data: { url: '/settings' }
    });

    res.json({
      success: true,
      message: 'Test notification sent'
    });
  } catch (err) {
    console.error('Send test notification error:', err);
    res.status(500).json({ success: false, message: 'Failed to send test notification' });
  }
};

// @desc    Get notification diagnostics for current user
// @route   GET /api/notifications/status
// @access  Private
const getNotificationStatus = async (req, res) => {
  try {
    const subscriptionCount = await PushSubscription.countDocuments({ userId: req.user._id });
    res.json({
      success: true,
      data: {
        pushConfigured: isPushConfigured(),
        subscriptionCount
      }
    });
  } catch (err) {
    console.error('Get notification status error:', err);
    res.status(500).json({ success: false, message: 'Failed to get notification status' });
  }
};

module.exports = {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  sendTestNotification,
  getNotificationStatus
};
