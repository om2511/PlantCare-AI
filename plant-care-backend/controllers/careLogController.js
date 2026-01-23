const CareLog = require('../models/CareLog');
const Plant = require('../models/Plant');

// @desc    Log care activity
// @route   POST /api/care
// @access  Private
const logCareActivity = async (req, res) => {
  try {
    const { plantId, activityType, activityDate, notes, measurements } = req.body;

    // Validation
    if (!plantId || !activityType) {
      return res.status(400).json({
        success: false,
        message: 'Plant ID and activity type are required'
      });
    }

    // Check if plant exists and belongs to user
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Create care log
    const careLog = await CareLog.create({
      userId: req.user._id,
      plantId,
      activityType,
      activityDate: activityDate || Date.now(),
      notes: notes || '',
      measurements: measurements || {}
    });

    // Update plant's care schedule based on activity
    if (activityType === 'watering') {
      plant.careSchedule.lastWatered = careLog.activityDate;
      plant.calculateNextWatering();
    } else if (activityType === 'fertilizing') {
      plant.careSchedule.lastFertilized = careLog.activityDate;
      plant.calculateNextFertilizing();
    } else if (activityType === 'pruning') {
      plant.careSchedule.lastPruned = careLog.activityDate;
    }

    // Update health score if provided
    if (measurements && measurements.healthScore) {
      plant.healthScore = measurements.healthScore;
      
      // Update status based on health score
      if (measurements.healthScore >= 80) {
        plant.status = 'healthy';
      } else if (measurements.healthScore >= 50) {
        plant.status = 'needs-attention';
      } else {
        plant.status = 'diseased';
      }
    }

    await plant.save();

    res.status(201).json({
      success: true,
      message: 'Care activity logged successfully',
      data: careLog
    });
  } catch (error) {
    console.error('Log care activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging care activity',
      error: error.message
    });
  }
};

// @desc    Get care logs for a plant
// @route   GET /api/care/plant/:plantId
// @access  Private
const getPlantCareLogs = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { activityType, limit = 50 } = req.query;

    // Check if plant belongs to user
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    if (plant.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Build query
    const query = { plantId };
    if (activityType) query.activityType = activityType;

    const careLogs = await CareLog.find(query)
      .sort({ activityDate: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: careLogs.length,
      data: careLogs
    });
  } catch (error) {
    console.error('Get care logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching care logs',
      error: error.message
    });
  }
};

// @desc    Get all care logs for user
// @route   GET /api/care
// @access  Private
const getUserCareLogs = async (req, res) => {
  try {
    const { activityType, startDate, endDate, limit = 100 } = req.query;

    // Build query
    const query = { userId: req.user._id };
    
    if (activityType) query.activityType = activityType;
    
    if (startDate || endDate) {
      query.activityDate = {};
      if (startDate) query.activityDate.$gte = new Date(startDate);
      if (endDate) query.activityDate.$lte = new Date(endDate);
    }

    const careLogs = await CareLog.find(query)
      .populate('plantId', 'nickname species')
      .sort({ activityDate: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: careLogs.length,
      data: careLogs
    });
  } catch (error) {
    console.error('Get user care logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching care logs',
      error: error.message
    });
  }
};

// @desc    Delete care log
// @route   DELETE /api/care/:id
// @access  Private
const deleteCareLog = async (req, res) => {
  try {
    const careLog = await CareLog.findById(req.params.id);

    if (!careLog) {
      return res.status(404).json({
        success: false,
        message: 'Care log not found'
      });
    }

    // Check ownership
    if (careLog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await careLog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Care log deleted successfully'
    });
  } catch (error) {
    console.error('Delete care log error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting care log',
      error: error.message
    });
  }
};

module.exports = {
  logCareActivity,
  getPlantCareLogs,
  getUserCareLogs,
  deleteCareLog
};