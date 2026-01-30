import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../utils/api';

const WaterQuality = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedWaterSource, setSelectedWaterSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [plantsLoading, setPlantsLoading] = useState(true);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');
  const [analysisMode, setAnalysisMode] = useState('plant'); // 'plant' or 'general'

  // Water sources with details
  const waterSources = [
    {
      id: 'tap',
      name: 'Tap Water',
      icon: '🚰',
      description: 'Municipal water supply',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'ro',
      name: 'RO Water',
      icon: '💧',
      description: 'Reverse osmosis purified',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'rainwater',
      name: 'Rainwater',
      icon: '🌧️',
      description: 'Collected rain water',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'borewell',
      name: 'Borewell',
      icon: '⛲',
      description: 'Underground well water',
      color: 'from-amber-500 to-amber-600'
    },
    {
      id: 'filtered',
      name: 'Filtered',
      icon: '🔄',
      description: 'Filtered/treated water',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  // Fetch user's plants
  const fetchPlants = useCallback(async () => {
    try {
      const response = await api.get('/plants');
      setPlants(response.data.data || []);
    } catch (err) {
      console.error('Error fetching plants:', err);
    } finally {
      setPlantsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlants();
  }, [fetchPlants]);

  // Get water quality advice
  const getAdvice = async () => {
    if (!selectedWaterSource) {
      setError('Please select a water source');
      return;
    }

    if (analysisMode === 'plant' && !selectedPlant) {
      setError('Please select a plant or switch to general analysis mode');
      return;
    }

    setLoading(true);
    setError('');
    setAdvice(null);

    try {
      let response;
      if (analysisMode === 'plant' && selectedPlant) {
        response = await api.get(`/water-quality/${selectedPlant._id}/${selectedWaterSource}`);
      } else {
        response = await api.get(`/water-quality/general/${selectedWaterSource}`);
      }

      if (response.data.success) {
        setAdvice(response.data.data);
      } else {
        setError(response.data.message || 'Failed to get advice');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error getting water quality advice');
    } finally {
      setLoading(false);
    }
  };

  // Get suitability color
  const getSuitabilityColor = (suitability) => {
    switch (suitability?.toLowerCase()) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-emerald-600 bg-emerald-100';
      case 'suitable':
        return 'text-yellow-600 bg-yellow-100';
      case 'not-recommended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get suitability icon
  const getSuitabilityIcon = (suitability) => {
    switch (suitability?.toLowerCase()) {
      case 'excellent':
        return '✅';
      case 'good':
        return '👍';
      case 'suitable':
        return '⚠️';
      case 'not-recommended':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl">💧</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Water Quality Analysis
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check if your water source is suitable for your plants. Get AI-powered recommendations
              for optimal plant watering.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-xl p-1 shadow-md inline-flex">
              <button
                onClick={() => {
                  setAnalysisMode('plant');
                  setAdvice(null);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  analysisMode === 'plant'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">🌱</span>
                For My Plant
              </button>
              <button
                onClick={() => {
                  setAnalysisMode('general');
                  setAdvice(null);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  analysisMode === 'general'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">🌍</span>
                General Analysis
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Selection Panel */}
            <div className="space-y-6">
              {/* Plant Selection (only for plant mode) */}
              {analysisMode === 'plant' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">🌿</span>
                    Select Your Plant
                  </h2>

                  {plantsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : plants.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🪴</div>
                      <p className="text-gray-500 mb-4">No plants added yet</p>
                      <button
                        onClick={() => navigate('/add-plant')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Add Your First Plant
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                      {plants.map((plant) => (
                        <button
                          key={plant._id}
                          onClick={() => setSelectedPlant(plant)}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                            selectedPlant?._id === plant._id
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {plant.images && plant.images.length > 0 ? (
                              <img
                                src={plant.images[0].url}
                                alt={plant.species}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg">
                                🌱
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">
                                {plant.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {plant.species}
                              </p>
                            </div>
                          </div>
                          {selectedPlant?._id === plant._id && (
                            <div className="mt-2 flex justify-end">
                              <span className="text-green-500 text-lg">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* General Mode Info */}
              {analysisMode === 'general' && (
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
                  <h2 className="text-xl font-bold mb-3 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    General Water Analysis
                  </h2>
                  <p className="text-blue-100 mb-4">
                    Get general information about water quality for plants. This analysis provides
                    broad recommendations suitable for most common houseplants and garden plants.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      pH Levels
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Mineral Content
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                      Treatment Tips
                    </span>
                  </div>
                </div>
              )}

              {/* Water Source Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🚿</span>
                  Select Water Source
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {waterSources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setSelectedWaterSource(source.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedWaterSource === source.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${source.color} flex items-center justify-center text-2xl shadow-md`}>
                          {source.icon}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{source.name}</p>
                          <p className="text-sm text-gray-500">{source.description}</p>
                        </div>
                      </div>
                      {selectedWaterSource === source.id && (
                        <div className="mt-2 flex justify-end">
                          <span className="text-blue-500 text-lg">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={getAdvice}
                disabled={loading || !selectedWaterSource || (analysisMode === 'plant' && !selectedPlant)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading || !selectedWaterSource || (analysisMode === 'plant' && !selectedPlant)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>🔬</span>
                    <span>Analyze Water Quality</span>
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <p className="text-red-700">{error}</p>
                </div>
              )}
            </div>

            {/* Results Panel */}
            <div>
              {!advice && !loading && (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">💧</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Water Analysis Results
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Select a water source {analysisMode === 'plant' && 'and plant '}to get personalized
                    water quality recommendations powered by AI.
                  </p>

                  {/* Tips Section */}
                  <div className="mt-8 w-full max-w-md">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center justify-center">
                      <span className="mr-2">💡</span>
                      Quick Water Tips
                    </h4>
                    <div className="space-y-2 text-left">
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <span className="text-blue-500">•</span>
                        <span>Let tap water sit for 24 hours to remove chlorine</span>
                      </div>
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <span className="text-blue-500">•</span>
                        <span>Room temperature water is better than cold water</span>
                      </div>
                      <div className="flex items-start space-x-2 text-sm text-gray-600">
                        <span className="text-blue-500">•</span>
                        <span>Rainwater is often the best natural water source</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-4xl">🔬</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Analyzing Water Quality...
                  </h3>
                  <p className="text-gray-500">
                    Our AI is evaluating the water source for optimal plant health
                  </p>
                  <div className="mt-6 flex space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}

              {advice && (
                <div className="space-y-6">
                  {/* Suitability Card */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm mb-1">Water Quality for</p>
                          <h3 className="text-2xl font-bold">
                            {advice.plant || 'General Plants'}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="text-blue-100 text-sm mb-1">Water Source</p>
                          <p className="font-bold capitalize">{advice.waterSource}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Suitability Badge */}
                      <div className="flex items-center justify-center mb-6">
                        <div className={`px-6 py-3 rounded-full ${getSuitabilityColor(advice.advice?.suitability)} flex items-center space-x-2`}>
                          <span className="text-2xl">{getSuitabilityIcon(advice.advice?.suitability)}</span>
                          <span className="text-xl font-bold capitalize">
                            {advice.advice?.suitability || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                          <span className="mr-2">📋</span>
                          Recommendation
                        </h4>
                        <p className="text-gray-700">
                          {advice.advice?.recommendation || 'No specific recommendation available.'}
                        </p>
                      </div>

                      {/* Preparation */}
                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <h4 className="font-bold text-blue-800 mb-2 flex items-center">
                          <span className="mr-2">🔧</span>
                          Preparation Steps
                        </h4>
                        <p className="text-blue-700">
                          {advice.advice?.preparation || 'No special preparation needed.'}
                        </p>
                      </div>

                      {/* Frequency */}
                      <div className="bg-cyan-50 rounded-xl p-4">
                        <h4 className="font-bold text-cyan-800 mb-2 flex items-center">
                          <span className="mr-2">🕐</span>
                          Usage Frequency
                        </h4>
                        <p className="text-cyan-700">
                          {advice.advice?.frequency || 'Can be used as needed.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setAdvice(null);
                        setSelectedWaterSource('');
                        setSelectedPlant(null);
                      }}
                      className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      New Analysis
                    </button>
                    {analysisMode === 'plant' && selectedPlant && (
                      <button
                        onClick={() => navigate(`/plants/${selectedPlant._id}`)}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                      >
                        View Plant Details
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Water Source Comparison */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <span className="mr-3">📊</span>
              Water Source Comparison
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-700">Water Type</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">pH Range</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Minerals</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Best For</th>
                    <th className="text-center py-3 px-4 font-bold text-gray-700">Needs Treatment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <span>🚰</span>
                      <span className="font-medium">Tap Water</span>
                    </td>
                    <td className="text-center py-4 px-4">6.5 - 8.5</td>
                    <td className="text-center py-4 px-4">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Moderate</span>
                    </td>
                    <td className="text-center py-4 px-4 text-sm">Most houseplants</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-yellow-500">⚠️ Let sit 24h</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <span>💧</span>
                      <span className="font-medium">RO Water</span>
                    </td>
                    <td className="text-center py-4 px-4">5.0 - 7.0</td>
                    <td className="text-center py-4 px-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Low</span>
                    </td>
                    <td className="text-center py-4 px-4 text-sm">Sensitive plants</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-yellow-500">⚠️ Add minerals</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <span>🌧️</span>
                      <span className="font-medium">Rainwater</span>
                    </td>
                    <td className="text-center py-4 px-4">5.0 - 5.5</td>
                    <td className="text-center py-4 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">Natural</span>
                    </td>
                    <td className="text-center py-4 px-4 text-sm">All plants</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-green-500">✓ Ready to use</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <span>⛲</span>
                      <span className="font-medium">Borewell</span>
                    </td>
                    <td className="text-center py-4 px-4">7.0 - 8.5</td>
                    <td className="text-center py-4 px-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">High</span>
                    </td>
                    <td className="text-center py-4 px-4 text-sm">Hardy plants</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-red-500">⚠️ Test first</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-4 px-4 flex items-center space-x-2">
                      <span>🔄</span>
                      <span className="font-medium">Filtered</span>
                    </td>
                    <td className="text-center py-4 px-4">6.5 - 7.5</td>
                    <td className="text-center py-4 px-4">
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">Balanced</span>
                    </td>
                    <td className="text-center py-4 px-4 text-sm">Most plants</td>
                    <td className="text-center py-4 px-4">
                      <span className="text-green-500">✓ Ready to use</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">🌡️</div>
              <h3 className="font-bold text-lg mb-2">Water Temperature</h3>
              <p className="text-blue-100 text-sm">
                Use room temperature water (20-25°C) for most plants. Cold water can shock roots
                and slow growth.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">⏰</div>
              <h3 className="font-bold text-lg mb-2">Best Watering Time</h3>
              <p className="text-cyan-100 text-sm">
                Water early morning for outdoor plants. Indoor plants can be watered anytime,
                but avoid evening watering in winter.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
              <div className="text-3xl mb-3">📏</div>
              <h3 className="font-bold text-lg mb-2">Water Amount</h3>
              <p className="text-teal-100 text-sm">
                Water until it drains from bottom holes. Empty saucers after 30 minutes to
                prevent root rot.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WaterQuality;
