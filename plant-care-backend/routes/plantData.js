const express = require('express');
const router = express.Router();
const { searchPlants, getPlantDetails } = require('../services/plantDataService');
const { generatePlantSuggestions, getCurrentSeason } = require('../services/aiServiceGroq');
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

    // Search for diverse Indian plant categories to give AI variety
    const searchTerms = [
      'tulsi',        // Holy Basil - very common in India
      'curry leaf',   // Essential Indian herb
      'neem',         // Traditional Indian medicinal plant
      'jasmine',      // Popular Indian flower
      'marigold',     // Common in Indian gardens
      'hibiscus',     // Tropical flower common in India
      'coriander',    // Common Indian herb
      'mint',         // Widely used in India
      'chilli',       // Common Indian vegetable
      'tomato',       // Popular vegetable
      'brinjal',      // Eggplant - very common in India
      'aloe vera',    // Popular succulent
      'money plant',  // Very popular indoor plant in India
      'snake plant',  // Popular indoor plant
      'rose',         // Popular flower
      'mango'         // National fruit of India
    ];

    console.log('🔍 Searching for diverse plants...');

    // Search multiple categories in parallel
    const searchPromises = searchTerms.map(term => searchPlants(term, 1));
    const searchResults = await Promise.all(searchPromises);

    // Combine and deduplicate plants
    const allPlants = [];
    const seenNames = new Set();

    for (const result of searchResults) {
      if (result.success && result.data) {
        for (const plant of result.data) {
          // Normalize name for comparison
          const normalizedName = plant.name.toLowerCase().trim();
          if (!seenNames.has(normalizedName)) {
            seenNames.add(normalizedName);
            allPlants.push(plant);
          }
        }
      }
    }

    console.log(`✅ Found ${allPlants.length} unique plants from ${searchTerms.length} searches`);

    if (allPlants.length === 0) {
      console.error('❌ No plants found');
      return res.status(500).json({
        success: false,
        message: 'No plants found in external API'
      });
    }

    // Shuffle the plants array for variety
    const shuffledPlants = allPlants.sort(() => Math.random() - 0.5);

    // Get AI suggestions with diverse plant options
    const suggestions = await generatePlantSuggestions(userConditions, shuffledPlants);

    // Ensure we have exactly 5 unique suggestions
    let uniqueSuggestions = [...new Set(suggestions.suggestions)];

    // If AI returned duplicates, fill with random plants from our list
    if (uniqueSuggestions.length < 5) {
      const availableNames = allPlants.map(p => p.name);
      for (const name of availableNames) {
        if (!uniqueSuggestions.includes(name) && uniqueSuggestions.length < 5) {
          uniqueSuggestions.push(name);
        }
      }
    }

    // Limit to 5 suggestions
    uniqueSuggestions = uniqueSuggestions.slice(0, 5);

    res.status(200).json({
      success: true,
      userConditions,
      currentSeason: getCurrentSeason(),
      suggestions: uniqueSuggestions,
      reasoning: suggestions.reasoning,
      availablePlants: allPlants.slice(0, 20).map(p => ({
        name: p.name,
        scientificName: p.scientificName,
        sunlight: p.sunlight,
        watering: p.watering
      }))
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
