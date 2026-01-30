const Plant = require('../models/Plant');
const { generateWaterQualityAdvice, generateGeneralWaterQualityAdvice } = require('../services/aiServiceGroq');

// @desc    Get water quality advice for a plant
// @route   GET /api/water-quality/:plantId/:waterSource
// @access  Private
const getWaterQualityAdvice = async (req, res) => {
  try {
    const { plantId, waterSource } = req.params;

    // Validate water source
    const validSources = ['tap', 'ro', 'rainwater', 'borewell', 'filtered'];
    if (!validSources.includes(waterSource.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid water source. Must be one of: tap, ro, rainwater, borewell, filtered'
      });
    }

    const plant = await Plant.findById(plantId);

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

    // Get AI-generated water quality advice
    const advice = await generateWaterQualityAdvice(plant.species, waterSource);

    res.status(200).json({
      success: true,
      data: {
        plant: plant.species,
        waterSource,
        advice
      }
    });
  } catch (error) {
    console.error('Water quality advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating water quality advice',
      error: error.message
    });
  }
};

// @desc    Get general water quality advice (without specific plant)
// @route   GET /api/water-quality/general/:waterSource
// @access  Private
const getGeneralWaterQualityAdvice = async (req, res) => {
  try {
    const { waterSource } = req.params;

    // Validate water source
    const validSources = ['tap', 'ro', 'rainwater', 'borewell', 'filtered'];
    if (!validSources.includes(waterSource.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid water source. Must be one of: tap, ro, rainwater, borewell, filtered'
      });
    }

    // Get AI-generated general water quality advice
    const advice = await generateGeneralWaterQualityAdvice(waterSource);

    res.status(200).json({
      success: true,
      data: {
        plant: 'General Plants',
        waterSource,
        advice
      }
    });
  } catch (error) {
    console.error('General water quality advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating water quality advice',
      error: error.message
    });
  }
};

module.exports = {
  getWaterQualityAdvice,
  getGeneralWaterQualityAdvice
};