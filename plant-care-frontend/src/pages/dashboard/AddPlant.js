import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plantAPI, plantDataAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';

const AddPlant = () => {
  const [step, setStep] = useState(1); // 1: Search, 2: Details
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  
  const [formData, setFormData] = useState({
    nickname: '',
    species: '',
    perenualId: null,
    category: 'other',
    plantedDate: new Date().toISOString().split('T')[0],
    location: 'balcony',
    sunlightReceived: 6,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Search plants in database
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      setError('');
      
      const response = await plantDataAPI.searchPlants(searchQuery);
      
      if (response.data.success) {
        setSearchResults(response.data.data);
        if (response.data.data.length === 0) {
          setError('No plants found. Try a different search term.');
        }
      }
      
      setSearching(false);
    } catch (err) {
      setError('Failed to search plants');
      setSearching(false);
    }
  };

  // Select a plant from search results
  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
    setFormData({
      ...formData,
      species: plant.name,
      perenualId: plant.id,
      category: plant.type || 'other',
      nickname: plant.name
    });
    setStep(2);
  };

  // Skip search and add manually
  const handleSkipSearch = () => {
    setSelectedPlant(null);
    setStep(2);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nickname || !formData.species) {
      setError('Nickname and species are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await plantAPI.addPlant(formData);

      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add plant');
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Plant</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Search for plant */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Search for your plant
            </h2>
            <p className="text-gray-600 mb-6">
              Search our database of Indian plants to get AI-powered care recommendations
            </p>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name (e.g., Tomato, Tulsi, Rose...)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-gray-800">
                  Found {searchResults.length} plant{searchResults.length !== 1 ? 's' : ''}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {searchResults.map((plant) => (
                    <button
                      key={plant.id}
                      onClick={() => handleSelectPlant(plant)}
                      className="text-left p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-green-50 transition"
                    >
                      <h4 className="font-semibold text-gray-800">{plant.name}</h4>
                      <p className="text-sm text-gray-600">{plant.scientificName}</p>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className="bg-gray-100 px-2 py-1 rounded">{plant.type}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{plant.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">☀️ {plant.sunlight}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center border-t pt-6">
              <p className="text-gray-600 mb-3">Can't find your plant?</p>
              <button
                onClick={handleSkipSearch}
                className="text-primary font-semibold hover:underline"
              >
                Add plant manually →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Plant Details */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow p-6">
            {selectedPlant && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{selectedPlant.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPlant.scientificName}</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedPlant.hindiName}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-primary hover:underline"
                  >
                    Change
                  </button>
                </div>
                <p className="text-xs text-green-700 mt-2">
                  ✨ AI will generate personalized care schedule for your conditions
                </p>
              </div>
            )}

            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Plant Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nickname * <span className="text-xs text-gray-500">(Give your plant a name)</span>
                  </label>
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="My Tomato Plant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species *
                  </label>
                  <input
                    type="text"
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tomato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="vegetable">Vegetable</option>
                    <option value="fruit">Fruit</option>
                    <option value="flower">Flower</option>
                    <option value="herb">Herb</option>
                    <option value="indoor">Indoor</option>
                    <option value="succulent">Succulent</option>
                    <option value="tree">Tree</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planted Date
                  </label>
                  <input
                    type="date"
                    name="plantedDate"
                    value={formData.plantedDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="balcony">Balcony</option>
                    <option value="terrace">Terrace</option>
                    <option value="garden">Garden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sunlight Hours/Day
                  </label>
                  <input
                    type="number"
                    name="sunlightReceived"
                    value={formData.sunlightReceived}
                    onChange={handleChange}
                    min="0"
                    max="24"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Any special notes about this plant..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50"
                >
                  {loading ? 'Adding Plant...' : 'Add Plant 🌱'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AddPlant;