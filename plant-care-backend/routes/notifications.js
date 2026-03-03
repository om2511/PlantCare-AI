const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getVapidPublicKey,
  subscribe,
  unsubscribe
} = require('../controllers/notificationController');

router.get('/vapid-key', getVapidPublicKey);
router.post('/subscribe', protect, subscribe);
router.delete('/unsubscribe', protect, unsubscribe);

module.exports = router;
