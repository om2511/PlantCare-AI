const axios = require('axios');

const PERENUAL_API_KEY = process.env.PERENUAL_API_KEY;
const PERENUAL_BASE_URL = 'https://perenual.com/api';

/**
 * Search plants from Perenual API
 */
const searchPlants = async (query, page = 1) => {
  try {
    const response = await axios.get(`${PERENUAL_BASE_URL}/species-list`, {
      params: {
        key: PERENUAL_API_KEY,
        q: query,
        page: page
      }
    });

    return {
      success: true,
      data: response.data.data.map(plant => ({
        id: plant.id,
        name: plant.common_name,
        scientificName: Array.isArray(plant.scientific_name) 
          ? plant.scientific_name[0] || '' 
          : plant.scientific_name || '',  // FIX: Handle array
        otherNames: Array.isArray(plant.other_name) 
          ? plant.other_name 
          : (plant.other_name ? [plant.other_name] : []),
        cycle: plant.cycle || 'perennial',
        watering: plant.watering || 'moderate',
        sunlight: Array.isArray(plant.sunlight) 
          ? plant.sunlight 
          : (plant.sunlight ? [plant.sunlight] : ['full sun']),
        imageUrl: plant.default_image?.regular_url || plant.default_image?.thumbnail || null
      })),
      total: response.data.total,
      currentPage: response.data.current_page,
      lastPage: response.data.last_page
    };
  } catch (error) {
    console.error('Perenual API search error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to search plants',
      error: error.message
    };
  }
};

/**
 * Get detailed plant information
 */
const getPlantDetails = async (plantId) => {
  try {
    const response = await axios.get(`${PERENUAL_BASE_URL}/species/details/${plantId}`, {
      params: {
        key: PERENUAL_API_KEY
      }
    });

    const plant = response.data;

    return {
      success: true,
      data: {
        id: plant.id,
        name: plant.common_name,
        scientificName: Array.isArray(plant.scientific_name) 
          ? plant.scientific_name[0] || '' 
          : plant.scientific_name || '',  // FIX: Handle array
        otherNames: Array.isArray(plant.other_name) 
          ? plant.other_name 
          : (plant.other_name ? [plant.other_name] : []),  // FIX: Ensure array
        family: plant.family || '',
        origin: Array.isArray(plant.origin) 
          ? plant.origin 
          : [],
        type: plant.type || 'other',
        cycle: plant.cycle || 'perennial',
        watering: plant.watering || 'moderate',
        wateringPeriod: plant.watering_period || 'weekly',
        sunlight: Array.isArray(plant.sunlight) 
          ? plant.sunlight 
          : (plant.sunlight ? [plant.sunlight] : ['full sun']),
        pruningMonth: Array.isArray(plant.pruning_month) 
          ? plant.pruning_month 
          : [],
        growthRate: plant.growth_rate || 'moderate',
        maintenance: plant.maintenance || 'moderate',
        careLevel: plant.care_level || 'moderate',
        flowerColor: plant.flower_color || '',
        soilType: Array.isArray(plant.soil) 
          ? plant.soil 
          : [],
        propagation: Array.isArray(plant.propagation) 
          ? plant.propagation 
          : [],
        harvestSeason: plant.harvest_season || '',
        description: plant.description || '',
        imageUrl: plant.default_image?.regular_url || plant.default_image?.original_url || null,
        indoor: plant.indoor || false,
        medicinal: plant.medicinal || false,
        edible: plant.edible_fruit || false
      }
    };
  } catch (error) {
    console.error('Perenual API details error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to get plant details',
      error: error.message
    };
  }
};

/**
 * Get plant care guide
 */
const getPlantCareGuide = async (plantId) => {
  try {
    const response = await axios.get(`${PERENUAL_BASE_URL}/species-care-guide-list`, {
      params: {
        key: PERENUAL_API_KEY,
        species_id: plantId
      }
    });

    if (response.data.data && response.data.data.length > 0) {
      return {
        success: true,
        data: response.data.data[0]
      };
    }

    return {
      success: false,
      message: 'No care guide available for this plant'
    };
  } catch (error) {
    console.error('Perenual API care guide error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to get care guide',
      error: error.message
    };
  }
};

/**
 * Search Indian plants specifically
 */
const searchIndianPlants = async (query) => {
  // Common Indian plants to prioritize
  const indianPlants = [
    'tulsi', 'neem', 'curry', 'coriander', 'mint', 'basil',
    'tomato', 'chilli', 'brinjal', 'okra', 'spinach',
    'marigold', 'rose', 'jasmine', 'hibiscus',
    'aloe vera', 'snake plant', 'money plant'
  ];

  // If query matches Indian plant, search for it
  const searchTerm = query.toLowerCase();
  const matchedIndianPlant = indianPlants.find(p => searchTerm.includes(p));

  if (matchedIndianPlant) {
    return await searchPlants(matchedIndianPlant);
  }

  // Otherwise, normal search
  return await searchPlants(query);
};

module.exports = {
  searchPlants,
  getPlantDetails,
  getPlantCareGuide,
  searchIndianPlants
};