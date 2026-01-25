import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plantAPI, careAPI, waterQualityAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [plant, setPlant] = useState(null);
  const [careLogs, setCareLogs] = useState([]);
  const [seasonalTips, setSeasonalTips] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Care logging modal
  const [showCareModal, setShowCareModal] = useState(false);
  const [careType, setCareType] = useState('watering');
  const [careNotes, setCareNotes] = useState('');
  const [healthScore, setHealthScore] = useState(100);
  const [loggingCare, setLoggingCare] = useState(false);

  // Water quality modal
  const [showWaterModal, setShowWaterModal] = useState(false);
  const [waterSource, setWaterSource] = useState('tap');
  const [waterAdvice, setWaterAdvice] = useState(null);
  const [loadingWaterAdvice, setLoadingWaterAdvice] = useState(false);

  const fetchPlantData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get plant details
      const plantRes = await plantAPI.getPlant(id);
      if (plantRes.data.success) {
        setPlant(plantRes.data.data.plant);
        setCareLogs(plantRes.data.data.recentCareLogs || []);
      }

      // Get seasonal tips
      try {
        const tipsRes = await plantAPI.getSeasonalTips(id);
        if (tipsRes.data.success) {
          setSeasonalTips(tipsRes.data.data.tips);
        }
      } catch (err) {
        console.log('Seasonal tips not available');
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plant');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlantData();
  }, [fetchPlantData]);

  const handleLogCare = async (e) => {
    e.preventDefault();
    
    try {
      setLoggingCare(true);
      
      const response = await careAPI.logActivity({
        plantId: id,
        activityType: careType,
        notes: careNotes,
        measurements: {
          healthScore: healthScore
        }
      });

      if (response.data.success) {
        setShowCareModal(false);
        setCareNotes('');
        setHealthScore(100);
        fetchPlantData(); // Refresh data
      }
      
      setLoggingCare(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log care activity');
      setLoggingCare(false);
    }
  };

  const handleGetWaterAdvice = async () => {
    try {
      setLoadingWaterAdvice(true);
      const response = await waterQualityAPI.getAdvice(id, waterSource);
      
      if (response.data.success) {
        setWaterAdvice(response.data.data.advice);
      }
      
      setLoadingWaterAdvice(false);
    } catch (err) {
      setError('Failed to get water quality advice');
      setLoadingWaterAdvice(false);
    }
  };

  const handleDeletePlant = async () => {
    if (!window.confirm('Are you sure you want to delete this plant?')) {
      return;
    }

    try {
      await plantAPI.deletePlant(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete plant');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading plant details...</div>
        </div>
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">Plant not found</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </Layout>
    );
  }

  const daysUntilWatering = Math.ceil(
    (new Date(plant.careSchedule.nextWateringDue) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const daysUntilHarvest = plant.plantInfo.estimatedHarvestDate
    ? Math.ceil((new Date(plant.plantInfo.estimatedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <Link to="/dashboard" className="text-primary hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">{plant.nickname}</h1>
            <p className="text-gray-600 text-lg">{plant.species}</p>
            {plant.scientificName && (
              <p className="text-gray-500 text-sm italic">{plant.scientificName}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowWaterModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              💧 Water Quality
            </button>
            <button
              onClick={() => setShowCareModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
            >
              + Log Care
            </button>
            <button
              onClick={handleDeletePlant}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plant Image */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                {plant.images && plant.images.length > 0 ? (
                  <img
                    src={plant.images[0].url}
                    alt={plant.nickname}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-8xl">🌿</span>
                )}
              </div>
            </div>

            {/* AI Care Schedule */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                🤖 AI Care Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Watering</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Every {plant.careSchedule.wateringFrequency} days
                  </p>
                  <p className={`text-sm mt-2 ${daysUntilWatering <= 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    {daysUntilWatering <= 0 ? '⚠️ Water today!' : `Next: ${daysUntilWatering} days`}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Fertilizing</p>
                  <p className="text-2xl font-bold text-green-600">
                    Every {plant.careSchedule.fertilizingFrequency} days
                  </p>
                  {plant.careSchedule.nextFertilizingDue && (
                    <p className="text-sm text-gray-600 mt-2">
                      Next: {new Date(plant.careSchedule.nextFertilizingDue).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Sunlight</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {plant.sunlightReceived}h/day
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Needs: {plant.plantInfo.sunlightNeeds}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {plant.healthScore}/100
                  </p>
                  <p className="text-sm text-gray-600 mt-2 capitalize">
                    Status: {plant.status}
                  </p>
                </div>
              </div>

              {daysUntilHarvest !== null && daysUntilHarvest > 0 && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    🎉 Estimated harvest in <span className="font-bold">{daysUntilHarvest} days</span>
                  </p>
                </div>
              )}
            </div>

            {/* AI Seasonal Tips */}
            {seasonalTips && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  🌦️ Seasonal Care Tips (AI-Generated)
                </h2>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm font-semibold text-blue-800">Watering</p>
                    <p className="text-sm text-gray-700">{seasonalTips.wateringTips}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded">
                    <p className="text-sm font-semibold text-yellow-800">Common Issues</p>
                    <p className="text-sm text-gray-700">{seasonalTips.commonIssues}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <p className="text-sm font-semibold text-green-800">Protection</p>
                    <p className="text-sm text-gray-700">{seasonalTips.protectionNeeded}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <p className="text-sm font-semibold text-purple-800">Fertilization</p>
                    <p className="text-sm text-gray-700">{seasonalTips.fertilizationAdvice}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Care History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📋 Care History
              </h2>
              {careLogs.length === 0 ? (
                <p className="text-gray-500">No care activities logged yet</p>
              ) : (
                <div className="space-y-3">
                  {careLogs.map((log) => (
                    <div key={log._id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800 capitalize">
                            {log.activityType}
                          </p>
                          {log.notes && (
                            <p className="text-sm text-gray-600 mt-1">{log.notes}</p>
                          )}
                          {log.measurements?.healthScore && (
                            <p className="text-sm text-gray-500 mt-1">
                              Health: {log.measurements.healthScore}/100
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(log.activityDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plant Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-800 mb-4">Plant Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-semibold capitalize">{plant.category}</p>
                </div>
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-semibold capitalize">{plant.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Planted Date</p>
                  <p className="font-semibold">
                    {new Date(plant.plantedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Soil Type</p>
                  <p className="font-semibold">{plant.plantInfo.soilType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ideal Temperature</p>
                  <p className="font-semibold">{plant.plantInfo.idealTemperature}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {plant.notes && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-800 mb-4">Notes</h3>
                <p className="text-sm text-gray-700">{plant.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Care Logging Modal */}
      {showCareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Log Care Activity</h2>
            
            <form onSubmit={handleLogCare} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Type
                </label>
                <select
                  value={careType}
                  onChange={(e) => setCareType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="watering">💧 Watering</option>
                  <option value="fertilizing">🌿 Fertilizing</option>
                  <option value="pruning">✂️ Pruning</option>
                  <option value="repotting">🪴 Repotting</option>
                  <option value="inspection">👀 Inspection</option>
                  <option value="harvesting">🎉 Harvesting</option>
                  <option value="other">📝 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={healthScore}
                  onChange={(e) => setHealthScore(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={careNotes}
                  onChange={(e) => setCareNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Any observations or notes..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCareModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loggingCare}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-secondary disabled:opacity-50"
                >
                  {loggingCare ? 'Logging...' : 'Log Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Water Quality Modal */}
      {showWaterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💧 Water Quality Checker</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Source
                </label>
                <select
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="tap">Tap Water</option>
                  <option value="ro">RO Water</option>
                  <option value="rainwater">Rainwater</option>
                  <option value="borewell">Borewell</option>
                  <option value="filtered">Filtered Water</option>
                </select>
              </div>

              <button
                onClick={handleGetWaterAdvice}
                disabled={loadingWaterAdvice}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loadingWaterAdvice ? 'Getting AI Advice...' : 'Get AI Advice'}
              </button>

              {waterAdvice && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800">Suitability</p>
                    <p className="text-sm text-gray-700 capitalize">{waterAdvice.suitability}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Recommendation</p>
                    <p className="text-sm text-gray-700">{waterAdvice.recommendation}</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800">Preparation</p>
                    <p className="text-sm text-gray-700">{waterAdvice.preparation}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowWaterModal(false);
                  setWaterAdvice(null);
                }}
                className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlantDetails;