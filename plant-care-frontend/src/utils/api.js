import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  deleteAccount: (password) => api.delete('/auth/account', { data: { password } })
};

// Plant API calls
export const plantAPI = {
  // Get all user plants
  getPlants: () => api.get('/plants'),
  
  // Get single plant
  getPlant: (id) => api.get(`/plants/${id}`),
  
  // Add new plant
  addPlant: (plantData) => api.post('/plants', plantData),
  
  // Update plant
  updatePlant: (id, plantData) => api.put(`/plants/${id}`, plantData),
  
  // Delete plant
  deletePlant: (id) => api.delete(`/plants/${id}`),
  
  // Get plants needing care today
  getPlantsNeedingCare: () => api.get('/plants/care/today'),
  
  // Get seasonal tips for a plant
  getSeasonalTips: (id) => api.get(`/plants/${id}/seasonal-tips`)
};

// Plant database API calls
export const plantDataAPI = {
  // Search plants in database
  searchPlants: (query) => api.get(`/plant-data/search?q=${query}`),
  
  // Get plant details
  getPlantDetails: (id) => api.get(`/plant-data/${id}`),
  
  // Get AI suggestions
  getAISuggestions: () => api.get('/plant-data/suggestions/ai'),
  
  // Get plants by category
  getPlantsByCategory: (category) => api.get(`/plant-data/category/${category}`)
};

// Care log API calls
export const careAPI = {
  // Log care activity
  logActivity: (activityData) => api.post('/care', activityData),
  
  // Get care logs for a plant
  getPlantCareLogs: (plantId) => api.get(`/care/plant/${plantId}`),
  
  // Get all user care logs
  getUserCareLogs: () => api.get('/care'),
  
  // Delete care log
  deleteLog: (id) => api.delete(`/care/${id}`)
};

// Water quality API calls
export const waterQualityAPI = {
  getAdvice: (plantId, waterSource) => api.get(`/water-quality/${plantId}/${waterSource}`)
};

export default api;