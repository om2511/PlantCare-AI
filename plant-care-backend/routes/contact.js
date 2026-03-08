const express = require('express');
const { submitContactMessage, getContactMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/messages', protect, getContactMessages);

module.exports = router;
