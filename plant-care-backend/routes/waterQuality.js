const express = require('express');
const router = express.Router();
const { getWaterQualityAdvice } = require('../controllers/waterQualityController');
const { protect } = require('../middleware/auth');

// Protected route
router.get('/:plantId/:waterSource', protect, getWaterQualityAdvice);

module.exports = router;