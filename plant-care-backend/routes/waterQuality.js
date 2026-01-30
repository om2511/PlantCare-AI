const express = require('express');
const router = express.Router();
const { getWaterQualityAdvice, getGeneralWaterQualityAdvice } = require('../controllers/waterQualityController');
const { protect } = require('../middleware/auth');

// Protected routes
router.get('/general/:waterSource', protect, getGeneralWaterQualityAdvice);
router.get('/:plantId/:waterSource', protect, getWaterQualityAdvice);

module.exports = router;