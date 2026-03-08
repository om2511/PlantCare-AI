const express = require('express');
const { submitContactMessage, getContactMessages } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/messages', protect, adminOnly, getContactMessages);

module.exports = router;
