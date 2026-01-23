const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nickname: {
    type: String,
    required: [true, 'Plant nickname is required'],
    trim: true
  },
  species: {
    type: String,
    required: [true, 'Plant species is required'],
    trim: true
  },
  scientificName: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['vegetable', 'fruit', 'flower', 'herb', 'indoor', 'succulent', 'tree', 'other'],
    default: 'other'
  },
  images: [{
    url: {
      type: String
    },
    publicId: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      default: ''
    }
  }],
  plantedDate: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    enum: ['indoor', 'balcony', 'terrace', 'garden'],
    default: 'balcony'
  },
  sunlightReceived: {
    type: Number, // hours per day
    min: 0,
    max: 24,
    default: 6
  },
  // Care schedule
  careSchedule: {
    wateringFrequency: {
      type: Number, // days
      default: 2
    },
    lastWatered: {
      type: Date,
      default: Date.now
    },
    nextWateringDue: {
      type: Date
    },
    fertilizingFrequency: {
      type: Number, // days
      default: 30
    },
    lastFertilized: {
      type: Date
    },
    nextFertilizingDue: {
      type: Date
    },
    pruningFrequency: {
      type: Number, // days
      default: 60
    },
    lastPruned: {
      type: Date
    },
    nextPruningDue: {
      type: Date
    }
  },
  // Plant info from database
  plantInfo: {
    wateringNeeds: {
      type: String,
      default: 'moderate'
    },
    sunlightNeeds: {
      type: String,
      default: '4-6 hours'
    },
    soilType: {
      type: String,
      default: 'well-drained'
    },
    idealTemperature: {
      type: String,
      default: '20-30°C'
    },
    growthTime: {
      type: Number, // days to maturity
      default: 90
    },
    estimatedHarvestDate: {
      type: Date
    }
  },
  // Status tracking
  status: {
    type: String,
    enum: ['healthy', 'needs-attention', 'diseased', 'dormant'],
    default: 'healthy'
  },
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  notes: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update 'updatedAt' before saving
plantSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Calculate next watering date
plantSchema.methods.calculateNextWatering = function() {
  const nextDate = new Date(this.careSchedule.lastWatered);
  nextDate.setDate(nextDate.getDate() + this.careSchedule.wateringFrequency);
  this.careSchedule.nextWateringDue = nextDate;
  return this;
};

// Calculate next fertilizing date
plantSchema.methods.calculateNextFertilizing = function() {
  if (this.careSchedule.lastFertilized) {
    const nextDate = new Date(this.careSchedule.lastFertilized);
    nextDate.setDate(nextDate.getDate() + this.careSchedule.fertilizingFrequency);
    this.careSchedule.nextFertilizingDue = nextDate;
  }
  return this;
};

// Calculate harvest date
plantSchema.methods.calculateHarvestDate = function() {
  if (this.plantInfo.growthTime > 0) {
    const harvestDate = new Date(this.plantedDate);
    harvestDate.setDate(harvestDate.getDate() + this.plantInfo.growthTime);
    this.plantInfo.estimatedHarvestDate = harvestDate;
  }
  return this;
};

module.exports = mongoose.model('Plant', plantSchema);