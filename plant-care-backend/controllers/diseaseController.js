const Plant = require('../models/Plant');
const { analyzePlantImage, analyzeTextSymptoms } = require('../services/diseaseDetectionService');
const { getCurrentSeason } = require('../services/aiServiceGroq');

/**
 * Compute context-richness accuracy score (0–100)
 * Blends how much plant-specific data was available + AI confidence
 */
const computeAccuracyScore = (plantContext, aiConfidence, plantMismatch) => {
  let contextScore = 20; // base: season always known
  if (plantContext) {
    if (plantContext.species)     contextScore += 20;
    if (plantContext.category)    contextScore += 10;
    if (plantContext.soilType)    contextScore += 15;
    if (plantContext.location)    contextScore += 10;
    if (plantContext.sunlight)    contextScore += 10;
    if (plantContext.city)        contextScore += 10;
    if (plantContext.climateZone) contextScore += 5;
  }
  contextScore = Math.min(100, contextScore);
  const blended = Math.round(contextScore * 0.45 + (aiConfidence || 50) * 0.55);
  const score = plantMismatch ? Math.min(blended, 55) : blended;
  return Math.max(15, Math.min(100, score));
};

/**
 * Build plantContext object from plant and user data
 */
const buildPlantContext = (plant, user) => {
  const context = {};
  if (plant) {
    context.species = plant.species;
    context.scientificName = plant.scientificName;
    context.category = plant.category;
    context.location = plant.location;
    context.soilType = plant.plantInfo?.soilType;
    context.sunlight = plant.sunlightReceived ? `${plant.sunlightReceived} hours/day` : undefined;
    context.wateringNeeds = plant.plantInfo?.wateringNeeds;
  }
  if (user) {
    context.city = user.location?.city;
    context.climateZone = user.location?.climateZone;
  }
  context.season = getCurrentSeason();
  return context;
};

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

    // Fetch plant BEFORE AI call to provide context
    let plant = null;
    let plantContext = null;

    if (plantId) {
      plant = await Plant.findById(plantId);
      if (plant && plant.userId.toString() === req.user._id.toString()) {
        plantContext = buildPlantContext(plant, req.user);
      }
    }

    // Analyze image with AI (now with plant context)
    const analysis = await analyzePlantImage(imageUrl, plantContext);

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

    // If plant found, update plant status
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

    const accuracyScore = computeAccuracyScore(
      plantContext,
      analysis.data.confidence,
      analysis.data.plantMismatch
    );

    res.status(200).json({
      success: true,
      data: {
        imageUrl,
        analysis: analysis.data,
        accuracyScore,
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

// @desc    Analyze disease from text description
// @route   POST /api/disease/analyze-text
// @access  Private
const analyzeDiseaseByText = async (req, res) => {
  try {
    const { plantName, symptoms, plantId } = req.body;

    if (!symptoms || symptoms.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symptoms description'
      });
    }

    console.log('📝 Analyzing symptoms by text...');

    // Fetch plant BEFORE AI call to provide context
    let plant = null;
    let plantContext = null;
    let effectivePlantName = plantName;

    if (plantId) {
      plant = await Plant.findById(plantId);
      if (plant && plant.userId.toString() === req.user._id.toString()) {
        plantContext = buildPlantContext(plant, req.user);
        // Use plant species as name if not provided
        if (!effectivePlantName || effectivePlantName === 'Unknown plant') {
          effectivePlantName = plant.species;
        }
      }
    }

    // Analyze symptoms with AI (now with plant context)
    const analysis = await analyzeTextSymptoms(effectivePlantName, symptoms, plantContext);

    if (!analysis.success) {
      return res.status(500).json({
        success: false,
        message: analysis.message || 'Failed to analyze symptoms',
        error: analysis.error
      });
    }

    // If plant found, update plant status
    if (plant && plant.userId.toString() === req.user._id.toString()) {
      // Update plant status based on analysis
      if (!analysis.data.isHealthy) {
        plant.status = analysis.data.severity === 'severe' ? 'diseased' : 'needs-attention';
        plant.healthScore = Math.max(20, 100 - (analysis.data.confidence || 50));
      } else {
        plant.status = 'healthy';
        plant.healthScore = Math.min(100, analysis.data.confidence || 90);
      }

      await plant.save();
    }

    const accuracyScore = computeAccuracyScore(
      plantContext,
      analysis.data.confidence,
      false
    );

    res.status(200).json({
      success: true,
      data: {
        analysis: analysis.data,
        accuracyScore,
        plantUpdated: !!plantId
      }
    });
  } catch (error) {
    console.error('Analyze disease by text error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing symptoms',
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
  analyzeDiseaseByText,
  getPlantImages
};
