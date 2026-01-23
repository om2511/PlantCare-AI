const Plant = require('../models/Plant');
const CareLog = require('../models/CareLog');
const { getPlantDetails } = require('../services/plantDataService');
const { generateCareSchedule, generateSeasonalTips } = require('../services/aiServiceGroq');

// @desc    Add new plant with AI-generated care schedule
// @route   POST /api/plants
// @access  Private
const addPlant = async (req, res) => {
  try {
    const { 
      nickname, 
      species, 
      perenualId, // ID from Perenual API
      category, 
      plantedDate, 
      location, 
      sunlightReceived, 
      notes 
    } = req.body;

    // Validation
    if (!nickname || !species) {
      return res.status(400).json({
        success: false,
        message: 'Nickname and species are required'
      });
    }

    // Get user conditions
    const userConditions = {
      city: req.user.location?.city || 'Mumbai',
      state: req.user.location?.state || 'Maharashtra',
      climateZone: req.user.location?.climateZone || 'tropical',
      balconyType: req.user.balconyType || 'balcony',
      sunlightHours: req.user.sunlightHours || 6
    };

    let plantInfo = {};
    let scientificName = '';
    let imageUrl = '';

    // If perenualId provided, get real plant data
    if (perenualId) {
      const plantData = await getPlantDetails(perenualId);
      if (plantData.success) {
        scientificName = plantData.data.scientificName;
        imageUrl = plantData.data.imageUrl;
        
        // Generate AI-powered care schedule
        const aiCareSchedule = await generateCareSchedule(
          {
            name: species,
            scientificName: plantData.data.scientificName,
            type: plantData.data.type,
            category: category || plantData.data.type
          },
          userConditions
        );

        plantInfo = {
          wateringNeeds: aiCareSchedule.wateringNeeds,
          sunlightNeeds: aiCareSchedule.sunlightRequirement,
          soilType: aiCareSchedule.soilType,
          idealTemperature: aiCareSchedule.idealTemperature,
          growthTime: aiCareSchedule.growthTimeDays
        };
      }
    } else {
      // No perenualId - still generate AI care schedule with basic info
      const aiCareSchedule = await generateCareSchedule(
        {
          name: species,
          scientificName: '',
          type: category || 'other'
        },
        userConditions
      );

      plantInfo = {
        wateringNeeds: aiCareSchedule.wateringNeeds,
        sunlightNeeds: aiCareSchedule.sunlightRequirement,
        soilType: aiCareSchedule.soilType,
        idealTemperature: aiCareSchedule.idealTemperature,
        growthTime: aiCareSchedule.growthTimeDays
      };
    }

    // Create plant
    const plant = await Plant.create({
      userId: req.user._id,
      nickname,
      species,
      scientificName,
      category: category || 'other',
      plantedDate: plantedDate || Date.now(),
      location: location || userConditions.balconyType,
      sunlightReceived: sunlightReceived || userConditions.sunlightHours,
      notes: notes || '',
      plantInfo,
      images: imageUrl ? [{ url: imageUrl, note: 'Reference image' }] : [],
      careSchedule: {
        wateringFrequency: plantInfo.wateringNeeds === 'high' ? 1 : 
                          plantInfo.wateringNeeds === 'low' ? 7 : 2,
        lastWatered: Date.now(),
        fertilizingFrequency: 30
      }
    });

    // Calculate next care dates
    plant.calculateNextWatering();
    plant.calculateNextFertilizing();
    plant.calculateHarvestDate();
    await plant.save();

    res.status(201).json({
      success: true,
      message: 'Plant added successfully with AI-generated care schedule',
      data: plant
    });
  } catch (error) {
    console.error('Add plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding plant',
      error: error.message
    });
  }
};

// @desc    Get all user plants
// @route   GET /api/plants
// @access  Private
const getPlants = async (req, res) => {
  try {
    const { category, status, isActive = true } = req.query;

    // Build query
    const query = { userId: req.user._id };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const plants = await Plant.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plants',
      error: error.message
    });
  }
};

// @desc    Get single plant
// @route   GET /api/plants/:id
// @access  Private
const getPlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check if plant belongs to user
    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this plant'
      });
    }

    // Get care logs for this plant
    const careLogs = await CareLog.find({ plantId: plant._id })
      .sort({ activityDate: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        plant,
        recentCareLogs: careLogs
      }
    });
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plant',
      error: error.message
    });
  }
};

// @desc    Update plant
// @route   PUT /api/plants/:id
// @access  Private
const updatePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

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
        message: 'Not authorized to update this plant'
      });
    }

    // Update fields
    const allowedUpdates = [
      'nickname', 'species', 'category', 'location', 
      'sunlightReceived', 'status', 'healthScore', 'notes'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        plant[field] = req.body[field];
      }
    });

    // Update care schedule if provided
    if (req.body.careSchedule) {
      Object.assign(plant.careSchedule, req.body.careSchedule);
    }

    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Plant updated successfully',
      data: plant
    });
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating plant',
      error: error.message
    });
  }
};

// @desc    Delete plant (soft delete)
// @route   DELETE /api/plants/:id
// @access  Private
const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

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
        message: 'Not authorized to delete this plant'
      });
    }

    // Soft delete
    plant.isActive = false;
    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting plant',
      error: error.message
    });
  }
};

// @desc    Get plants needing care today
// @route   GET /api/plants/care/today
// @access  Private
const getPlantsNeedingCare = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const plants = await Plant.find({
      userId: req.user._id,
      isActive: true,
      $or: [
        { 'careSchedule.nextWateringDue': { $lte: today } },
        { 'careSchedule.nextFertilizingDue': { $lte: today } },
        { 'careSchedule.nextPruningDue': { $lte: today } }
      ]
    });

    res.status(200).json({
      success: true,
      count: plants.length,
      data: plants
    });
  } catch (error) {
    console.error('Get care needed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plants needing care',
      error: error.message
    });
  }
};

// @desc    Get AI seasonal tips for a plant
// @route   GET /api/plants/:id/seasonal-tips
// @access  Private
const getSeasonalTips = async (req, res) => {
  try {
    const plant = await Plant.findById(req.params.id);

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

    const location = `${req.user.location?.city || 'India'}, ${req.user.location?.state || ''}`;
    const { getCurrentSeason } = require('../services/aiService');
    const currentSeason = getCurrentSeason();

    // Generate AI seasonal tips
    const tips = await generateSeasonalTips(plant.species, location, currentSeason);

    res.status(200).json({
      success: true,
      data: {
        plant: plant.species,
        season: currentSeason,
        location,
        tips
      }
    });
  } catch (error) {
    console.error('Get seasonal tips error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating seasonal tips',
      error: error.message
    });
  }
};

module.exports = {
  addPlant,
  getPlants,
  getPlant,
  updatePlant,
  deletePlant,
  getPlantsNeedingCare,
  getSeasonalTips
};