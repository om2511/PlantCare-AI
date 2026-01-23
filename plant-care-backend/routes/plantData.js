const express = require('express');
const router = express.Router();
const { searchPlants, getPlantDetails } = require('../services/plantDataService');
const { generatePlantSuggestions } = require('../services/aiServiceGroq');
const { protect } = require('../middleware/auth');

// @desc    Search plants from external API
// @route   GET /api/plant-data/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const result = await searchPlants(q, page);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching plants',
      error: error.message
    });
  }
});

// @desc    Get plant details from external API
// @route   GET /api/plant-data/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await getPlantDetails(req.params.id);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching plant details',
      error: error.message
    });
  }
});

// @desc    Get AI-powered plant suggestions
// @route   GET /api/plant-data/suggestions/ai
// @access  Private
router.get('/suggestions/ai', protect, async (req, res) => {
  try {
    // Get user conditions
    const userConditions = {
      city: req.user.location?.city || 'Mumbai',
      state: req.user.location?.state || 'Maharashtra',
      climateZone: req.user.location?.climateZone || 'tropical',
      balconyType: req.user.balconyType || 'balcony',
      sunlightHours: req.user.sunlightHours || 6
    };

    // First, search for common Indian plants
    console.log('🔍 Searching for plants...');
    const commonPlants = await searchPlants('tomato', 1);
    
    // DEBUG: Log the response
    console.log('📦 Search result:', JSON.stringify(commonPlants, null, 2));
    
    if (!commonPlants.success) {
      console.error('❌ Search failed:', commonPlants);
      return res.status(500).json({
        success: false,
        message: 'Unable to fetch plant data for suggestions',
        debug: commonPlants // Show actual error
      });
    }

    if (commonPlants.data.length === 0) {
      console.error('❌ No plants found');
      return res.status(500).json({
        success: false,
        message: 'No plants found in external API'
      });
    }

    console.log(`✅ Found ${commonPlants.data.length} plants`);

    // Get AI suggestions
    const suggestions = await generatePlantSuggestions(userConditions, commonPlants.data);

    res.status(200).json({
      success: true,
      userConditions,
      suggestions: suggestions.suggestions,
      reasoning: suggestions.reasoning,
      availablePlants: commonPlants.data.map(p => p.name) // Show what was available
    });
  } catch (error) {
    console.error('❌ AI suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating plant suggestions',
      error: error.message
    });
  }
});

module.exports = router;