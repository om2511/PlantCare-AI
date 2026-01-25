const express = require('express');
const router = express.Router();
const { analyzeDisease, getPlantImages } = require('../controllers/diseaseController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Protected routes
router.post('/analyze', protect, upload.single('image'), analyzeDisease);
router.get('/plant/:plantId/images', protect, getPlantImages);

module.exports = router;