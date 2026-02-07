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

  const [showCareModal, setShowCareModal] = useState(false);
  const [careType, setCareType] = useState('watering');
  const [careNotes, setCareNotes] = useState('');
  const [healthScore, setHealthScore] = useState(100);
  const [loggingCare, setLoggingCare] = useState(false);

  const [showWaterModal, setShowWaterModal] = useState(false);
  const [waterSource, setWaterSource] = useState('tap');
  const [waterAdvice, setWaterAdvice] = useState(null);
  const [loadingWaterAdvice, setLoadingWaterAdvice] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchPlantData = useCallback(async () => {
    try {
      setLoading(true);

      const plantRes = await plantAPI.getPlant(id);
      if (plantRes.data.success) {
        setPlant(plantRes.data.data.plant);
        setCareLogs(plantRes.data.data.recentCareLogs || []);
      }

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
        fetchPlantData();
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
    try {
      await plantAPI.deletePlant(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete plant');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'healthy':
        return { color: 'from-green-500 to-emerald-500', bg: 'bg-green-100', text: 'text-green-700', icon: '✓', label: 'Healthy' };
      case 'needs-attention':
        return { color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-700', icon: '!', label: 'Needs Attention' };
      case 'diseased':
        return { color: 'from-red-500 to-rose-500', bg: 'bg-red-100', text: 'text-red-700', icon: '✕', label: 'Diseased' };
      default:
        return { color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100', text: 'text-gray-700', icon: '?', label: 'Unknown' };
    }
  };

  const getCareActivityIcon = (type) => {
    const icons = {
      watering: { icon: '💧', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100' },
      fertilizing: { icon: '🌿', color: 'from-green-500 to-emerald-500', bg: 'bg-green-100' },
      pruning: { icon: '✂️', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-100' },
      repotting: { icon: '🪴', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100' },
      inspection: { icon: '👀', color: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-100' },
      harvesting: { icon: '🎉', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-100' },
      other: { icon: '📝', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100' },
    };
    return icons[type] || icons.other;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
          <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="h-72 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-lg mb-2"></div>
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex justify-between py-2">
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!plant) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🌱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Plant Not Found</h2>
          <p className="text-gray-600 mb-6">The plant you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
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

  const statusConfig = getStatusConfig(plant.status);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="relative">
            {/* Plant Image */}
            <div className="h-64 sm:h-80 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30 relative overflow-hidden">
              {plant.images && plant.images.length > 0 ? (
                <img
                  src={plant.images[0].url}
                  alt={plant.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-9xl opacity-50">🌿</span>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold flex items-center gap-2 ${statusConfig.bg} ${statusConfig.text} border backdrop-blur-sm`}>
                <span>{statusConfig.icon}</span>
                <span>{statusConfig.label}</span>
              </div>

              {/* Watering Alert */}
              {daysUntilWatering <= 0 && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded-full font-bold flex items-center gap-2 animate-pulse shadow-lg">
                  <span>💧</span>
                  <span>Water Today!</span>
                </div>
              )}

              {/* Plant Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 break-words">{plant.nickname}</h1>
                <p className="text-base sm:text-lg text-white/90">{plant.species}</p>
                {plant.scientificName && (
                  <p className="text-xs sm:text-sm text-white/70 italic">{plant.scientificName}</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute bottom-0 right-0 p-2 sm:p-4 flex gap-1.5 sm:gap-2">
              <button
                onClick={() => setShowWaterModal(true)}
                className="p-1.5 sm:p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 group"
                title="Water Quality"
              >
                <span className="text-base sm:text-xl group-hover:scale-110 inline-block transition-transform">💧</span>
              </button>
              <button
                onClick={() => setShowCareModal(true)}
                className="p-1.5 sm:p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all hover:scale-105 group"
                title="Log Care"
              >
                <span className="text-base sm:text-xl group-hover:scale-110 inline-block transition-transform">📝</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-1.5 sm:p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-all hover:scale-105 group"
                title="Delete Plant"
              >
                <span className="text-base sm:text-xl group-hover:scale-110 inline-block transition-transform">🗑️</span>
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 dark:border-gray-600 flex flex-wrap gap-3">
            <button
              onClick={() => setShowCareModal(true)}
              className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Log Care Activity</span>
              <span className="sm:hidden">Log Care</span>
            </button>
            <button
              onClick={() => setShowWaterModal(true)}
              className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 sm:px-4 py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>💧</span>
              <span className="hidden sm:inline">Water Quality</span>
              <span className="sm:hidden">Water</span>
            </button>
            <Link
              to="/disease-detection"
              className="flex-1 min-w-[120px] sm:min-w-[140px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-3 rounded-xl text-sm sm:text-base font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>🔬</span>
              <span className="hidden sm:inline">Scan for Disease</span>
              <span className="sm:hidden">Scan</span>
            </Link>
          </div>
        </div>

        {/* Care Schedule Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <CareCard
            icon="💧"
            title="Watering"
            value={`Every ${plant.careSchedule.wateringFrequency} days`}
            subtitle={daysUntilWatering <= 0 ? 'Water today!' : `Next in ${daysUntilWatering} days`}
            gradient="from-blue-500 to-cyan-500"
            bgColor="bg-blue-50"
            urgent={daysUntilWatering <= 0}
          />
          <CareCard
            icon="🌿"
            title="Fertilizing"
            value={`Every ${plant.careSchedule.fertilizingFrequency} days`}
            subtitle={plant.careSchedule.nextFertilizingDue ? `Next: ${new Date(plant.careSchedule.nextFertilizingDue).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'Not scheduled'}
            gradient="from-green-500 to-emerald-500"
            bgColor="bg-green-50"
          />
          <CareCard
            icon="☀️"
            title="Sunlight"
            value={`${plant.sunlightReceived}h/day`}
            subtitle={`Needs: ${plant.plantInfo.sunlightNeeds}`}
            gradient="from-yellow-500 to-orange-500"
            bgColor="bg-yellow-50"
          />
          <CareCard
            icon="❤️"
            title="Health Score"
            value={`${plant.healthScore}/100`}
            subtitle={`Status: ${plant.status?.replace('-', ' ')}`}
            gradient={statusConfig.color}
            bgColor={statusConfig.bg}
          />
        </div>

        {/* Harvest Countdown */}
        {daysUntilHarvest !== null && daysUntilHarvest > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0">
              🎉
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm sm:text-base">Harvest Countdown</h3>
              <p className="text-amber-700 dark:text-amber-400 text-xs sm:text-sm">Your plant will be ready for harvest in <span className="font-bold">{daysUntilHarvest} days</span>!</p>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 hidden sm:block">{daysUntilHarvest}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Seasonal Tips */}
            {seasonalTips && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <span className="text-lg sm:text-xl">🌦️</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">Seasonal Care Tips</h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">AI-generated recommendations for current season</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TipCard
                    icon="💧"
                    title="Watering"
                    content={seasonalTips.wateringTips}
                    gradient="from-blue-500 to-cyan-500"
                  />
                  <TipCard
                    icon="⚠️"
                    title="Common Issues"
                    content={seasonalTips.commonIssues}
                    gradient="from-amber-500 to-orange-500"
                  />
                  <TipCard
                    icon="🛡️"
                    title="Protection"
                    content={seasonalTips.protectionNeeded}
                    gradient="from-green-500 to-emerald-500"
                  />
                  <TipCard
                    icon="🌱"
                    title="Fertilization"
                    content={seasonalTips.fertilizationAdvice}
                    gradient="from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            )}

            {/* Care History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <span className="text-lg sm:text-xl">📋</span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">Care History</h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">Recent care activities</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCareModal(true)}
                  className="px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <span className="hidden sm:inline">+ Log</span>
                  <span className="sm:hidden">+</span>
                </button>
              </div>

              {careLogs.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📝</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">No Care Activities Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start logging your care activities to track your plant's health</p>
                  <button
                    onClick={() => setShowCareModal(true)}
                    className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Log First Activity
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {careLogs.map((log, index) => {
                    const activityConfig = getCareActivityIcon(log.activityType);
                    return (
                      <div
                        key={log._id}
                        className={`p-4 rounded-xl border-2 border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-all ${index === 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-700/50'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 bg-gradient-to-br ${activityConfig.color} rounded-xl flex items-center justify-center text-lg shadow-md flex-shrink-0`}>
                            {activityConfig.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-gray-800 dark:text-white capitalize">{log.activityType}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(log.activityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            {log.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">{log.notes}</p>
                            )}
                            {log.measurements?.healthScore && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Health Score:</span>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden max-w-[100px]">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                    style={{ width: `${log.measurements.healthScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{log.measurements.healthScore}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plant Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <span className="text-lg">🌱</span>
                Plant Information
              </h3>
              <div className="space-y-4">
                <InfoRow icon="📂" label="Category" value={plant.category} />
                <InfoRow icon="📍" label="Location" value={plant.location} />
                <InfoRow icon="📅" label="Planted" value={new Date(plant.plantedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                <InfoRow icon="🌍" label="Soil Type" value={plant.plantInfo.soilType} />
                <InfoRow icon="🌡️" label="Ideal Temp" value={plant.plantInfo.idealTemperature} />
              </div>
            </div>

            {/* Notes Card */}
            {plant.notes && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-amber-700">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-base sm:text-lg">📝</span>
                  Notes
                </h3>
                <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 leading-relaxed break-words">{plant.notes}</p>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-700">
              <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <span className="text-base sm:text-lg">💡</span>
                Quick Tips
              </h3>
              <ul className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 space-y-1.5 sm:space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Log care activities regularly for better AI recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Check water quality if you notice leaf discoloration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Update health score after each inspection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Care Logging Modal */}
      {showCareModal && (
        <Modal onClose={() => setShowCareModal(false)}>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <span className="text-xl sm:text-2xl">📝</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">Log Care Activity</h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">Record what you did for your plant</p>
            </div>
          </div>

          <form onSubmit={handleLogCare} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Activity Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'watering', icon: '💧', label: 'Watering' },
                  { value: 'fertilizing', icon: '🌿', label: 'Fertilizing' },
                  { value: 'pruning', icon: '✂️', label: 'Pruning' },
                  { value: 'repotting', icon: '🪴', label: 'Repotting' },
                  { value: 'inspection', icon: '👀', label: 'Inspection' },
                  { value: 'harvesting', icon: '🎉', label: 'Harvesting' },
                  { value: 'other', icon: '📝', label: 'Other' },
                ].map((activity) => (
                  <button
                    key={activity.value}
                    type="button"
                    onClick={() => setCareType(activity.value)}
                    className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 text-center transition-all ${
                      careType === activity.value
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-base sm:text-xl mb-0.5 sm:mb-1">{activity.icon}</div>
                    <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{activity.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Health Score: <span className="text-green-600 dark:text-green-400">{healthScore}/100</span>
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200 dark:border-gray-600">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={healthScore}
                  onChange={(e) => setHealthScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  <span>Poor</span>
                  <span className="hidden sm:inline">Average</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes (Optional)</label>
              <textarea
                value={careNotes}
                onChange={(e) => setCareNotes(e.target.value)}
                rows="3"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-sm sm:text-base text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-500 transition-all resize-none"
                placeholder="Any observations or notes..."
              />
            </div>

            <div className="flex gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCareModal(false)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loggingCare}
                className="flex-[2] bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingCare ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging...</span>
                  </>
                ) : (
                  <span>Log Activity</span>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Water Quality Modal */}
      {showWaterModal && (
        <Modal onClose={() => { setShowWaterModal(false); setWaterAdvice(null); }}>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <span className="text-xl sm:text-2xl">💧</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">Water Quality Checker</h2>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 truncate">Get AI advice for your water source</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Water Source</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { value: 'tap', icon: '🚰', label: 'Tap' },
                  { value: 'ro', icon: '💧', label: 'RO' },
                  { value: 'rainwater', icon: '🌧️', label: 'Rain' },
                  { value: 'borewell', icon: '⛲', label: 'Borewell' },
                  { value: 'filtered', icon: '🧊', label: 'Filtered' },
                ].map((source) => (
                  <button
                    key={source.value}
                    type="button"
                    onClick={() => setWaterSource(source.value)}
                    className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 text-center transition-all ${
                      waterSource === source.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-md'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50'
                    }`}
                  >
                    <div className="text-lg sm:text-xl mb-0.5 sm:mb-1">{source.icon}</div>
                    <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight">{source.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGetWaterAdvice}
              disabled={loadingWaterAdvice}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingWaterAdvice ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Getting AI Advice...</span>
                </>
              ) : (
                <>
                  <span>🤖</span>
                  <span>Get AI Advice</span>
                </>
              )}
            </button>

            {waterAdvice && (
              <div className="space-y-3 animate-fade-in">
                <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-700">
                  <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    <span>✓</span> <span>Suitability</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 capitalize break-words">{waterAdvice.suitability}</p>
                </div>
                <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/30 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-700">
                  <h4 className="font-bold text-green-800 dark:text-green-300 mb-1 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    <span>💡</span> <span>Recommendation</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 break-words">{waterAdvice.recommendation}</p>
                </div>
                <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-700">
                  <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base">
                    <span>⚙️</span> <span>Preparation</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400 break-words">{waterAdvice.preparation}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => { setShowWaterModal(false); setWaterAdvice(null); }}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl">🗑️</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">Delete Plant?</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              Are you sure you want to delete <span className="font-semibold">{plant.nickname}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlant}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:from-red-600 hover:to-rose-600 transition-all"
              >
                Delete Plant
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

// Care Card Component
const CareCard = ({ icon, title, value, subtitle, gradient, bgColor, urgent }) => (
  <div className={`${bgColor} dark:bg-opacity-20 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all ${urgent ? 'ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-900 animate-pulse' : ''}`}>
    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-lg mb-2 sm:mb-3`}>
      {icon}
    </div>
    <h3 className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 truncate">{title}</h3>
    <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">{value}</p>
    <p className={`text-xs sm:text-sm mt-1 ${urgent ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>{subtitle}</p>
  </div>
);

// Tip Card Component
const TipCard = ({ icon, title, content, gradient }) => (
  <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all">
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-xs sm:text-sm shadow-md flex-shrink-0`}>
        {icon}
      </div>
      <h4 className="font-bold text-gray-800 dark:text-white text-sm sm:text-base truncate">{title}</h4>
    </div>
    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">{content}</p>
  </div>
);

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 gap-2">
    <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
      <span>{icon}</span>
      <span className="truncate">{label}</span>
    </span>
    <span className="font-semibold text-gray-800 dark:text-white capitalize text-xs sm:text-sm text-right truncate">{value}</span>
  </div>
);

// Modal Component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in">
    <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-4 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-scale-in relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  </div>
);

export default PlantDetails;
