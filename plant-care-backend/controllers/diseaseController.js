const Plant = require('../models/Plant');
const { analyzePlantImage } = require('../services/diseaseDetectionService');

// @desc    Upload and analyze plant image for disease
// @route   POST /api/disease/analyze
// @access  Private
const analyzeDisease = async (req, res) => {
  try {
    const { plantId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Get image URL from Cloudinary
    const imageUrl = req.file.path;

    console.log('📸 Image uploaded:', imageUrl);

    // Analyze image with AI
    const analysis = await analyzePlantImage(imageUrl);

    if (!analysis.success) {
      // Handle specific error types with appropriate status codes
      let statusCode = 500;
      if (analysis.error === 'MODEL_LOADING') {
        statusCode = 503; // Service Unavailable - retry later
      } else if (analysis.error === 'RATE_LIMITED') {
        statusCode = 429;
      } else if (analysis.error === 'AUTH_ERROR') {
        statusCode = 502; // Bad Gateway - upstream auth issue
      }

      return res.status(statusCode).json({
        success: false,
        message: analysis.message || 'Failed to analyze image',
        error: analysis.error,
        retryAfter: analysis.retryAfter
      });
    }

    // If plantId provided, update plant status
    if (plantId) {
      const plant = await Plant.findById(plantId);
      
      if (plant && plant.userId.toString() === req.user._id.toString()) {
        // Update plant status based on analysis
        if (!analysis.data.isHealthy) {
          plant.status = analysis.data.severity === 'severe' ? 'diseased' : 'needs-attention';
          plant.healthScore = Math.max(20, 100 - (analysis.data.confidence || 50));
        } else {
          plant.status = 'healthy';
          plant.healthScore = Math.min(100, analysis.data.confidence || 90);
        }

        // Add image to plant
        plant.images.push({
          url: imageUrl,
          publicId: req.file.filename,
          uploadedAt: Date.now(),
          note: `Disease check: ${analysis.data.disease}`
        });

        await plant.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        analysis: analysis.data,
        plantUpdated: !!plantId
      }
    });
  } catch (error) {
    console.error('Analyze disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing image',
      error: error.message
    });
  }
};

// @desc    Get plant images
// @route   GET /api/disease/plant/:plantId/images
// @access  Private
const getPlantImages = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.plantId);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check ownership
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: plant.images
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching images',
      error: error.message
    });
  }
};

module.exports = {
  analyzeDisease,
  getPlantImages
};