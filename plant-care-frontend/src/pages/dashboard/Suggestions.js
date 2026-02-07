import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plantDataAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await plantDataAPI.getAISuggestions();

      if (response.data.success) {
        setSuggestions(response.data);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get AI suggestions');
      setLoading(false);
    }
  };

  const getSeasonIcon = (season) => {
    switch (season?.toLowerCase()) {
      case 'summer': return '☀️';
      case 'monsoon': return '🌧️';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌿';
    }
  };

  const getSeasonColor = (season) => {
    switch (season?.toLowerCase()) {
      case 'summer': return 'from-orange-500 to-amber-500';
      case 'monsoon': return 'from-blue-500 to-cyan-500';
      case 'autumn': return 'from-amber-500 to-orange-600';
      case 'winter': return 'from-cyan-500 to-blue-500';
      default: return 'from-green-500 to-emerald-500';
    }
  };

  const getClimateIcon = (climate) => {
    switch (climate?.toLowerCase()) {
      case 'tropical': return '🌴';
      case 'coastal': return '🌊';
      case 'temperate': return '🌳';
      case 'arid': return '🏜️';
      case 'mountain': return '⛰️';
      default: return '🌍';
    }
  };

  const getSpaceIcon = (space) => {
    switch (space?.toLowerCase()) {
      case 'indoor': return '🏠';
      case 'balcony': return '🪟';
      case 'terrace': return '🏢';
      case 'garden': return '🌳';
      default: return '🌱';
    }
  };

  const getRankBadge = (index) => {
    if (index === 0) return { icon: '🥇', label: 'Best Match', color: 'from-yellow-400 to-amber-500' };
    if (index === 1) return { icon: '🥈', label: 'Great Choice', color: 'from-gray-300 to-gray-400' };
    if (index === 2) return { icon: '🥉', label: 'Excellent', color: 'from-amber-600 to-orange-700' };
    return { icon: '⭐', label: 'Recommended', color: 'from-green-500 to-emerald-500' };
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-4xl mx-auto">
          {/* Loading Header */}
          <div className="text-center py-16">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl mx-auto animate-bounce">
                <span className="text-5xl">🤖</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">AI is Analyzing Your Garden</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Our AI is analyzing your location, climate, and growing conditions to find the perfect plants for you...
            </p>

            {/* Loading Steps */}
            <div className="max-w-md mx-auto space-y-4">
              {[
                { icon: '📍', text: 'Analyzing your location...', delay: '0s' },
                { icon: '🌡️', text: 'Checking climate conditions...', delay: '0.5s' },
                { icon: '☀️', text: 'Evaluating sunlight availability...', delay: '1s' },
                { icon: '🌱', text: 'Finding perfect plant matches...', delay: '1.5s' },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse"
                  style={{ animationDelay: step.delay }}
                >
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-xl">
                    {step.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full text-green-700 font-medium text-sm mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI-Powered Recommendations
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Plant Suggestions for You
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Based on your location, climate, and growing conditions, our AI has selected the best plants that will thrive in your garden.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                <button
                  onClick={fetchSuggestions}
                  className="text-red-600 text-sm font-semibold hover:underline mt-1"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {suggestions && (
          <>
            {/* User Conditions Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <h2 className="text-xl font-bold">Your Growing Profile</h2>
                </div>
                <p className="text-white/80 text-sm">AI analyzed these conditions to find your perfect plants</p>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <ConditionCard
                    icon="📍"
                    label="Location"
                    value={`${suggestions.userConditions.city}, ${suggestions.userConditions.state}`}
                    gradient="from-blue-500 to-cyan-500"
                  />
                  <ConditionCard
                    icon={getClimateIcon(suggestions.userConditions.climateZone)}
                    label="Climate"
                    value={suggestions.userConditions.climateZone}
                    gradient="from-green-500 to-emerald-500"
                  />
                  <ConditionCard
                    icon={getSpaceIcon(suggestions.userConditions.balconyType)}
                    label="Space"
                    value={suggestions.userConditions.balconyType}
                    gradient="from-purple-500 to-pink-500"
                  />
                  <ConditionCard
                    icon="☀️"
                    label="Sunlight"
                    value={`${suggestions.userConditions.sunlightHours}h/day`}
                    gradient="from-yellow-500 to-orange-500"
                  />
                </div>

                {/* Current Season Badge */}
                {suggestions.currentSeason && (
                  <div className={`mt-6 flex items-center justify-center gap-3 bg-gradient-to-r ${getSeasonColor(suggestions.currentSeason)} rounded-2xl p-4 text-white`}>
                    <span className="text-3xl">{getSeasonIcon(suggestions.currentSeason)}</span>
                    <div>
                      <p className="text-sm text-white/80">Current Season</p>
                      <p className="text-xl font-bold capitalize">{suggestions.currentSeason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 rounded-3xl p-6 sm:p-8 border border-purple-200 dark:border-purple-700">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                  🧠
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">AI Analysis</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{suggestions.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Suggested Plants */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Recommended Plants</h2>
                  <p className="text-gray-500 dark:text-gray-400">Top {suggestions.suggestions.length} plants perfect for your conditions</p>
                </div>
                <button
                  onClick={fetchSuggestions}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.suggestions.map((plantName, index) => {
                  const rank = getRankBadge(index);
                  return (
                    <div
                      key={index}
                      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Rank Banner */}
                      <div className={`bg-gradient-to-r ${rank.color} p-3 flex items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{rank.icon}</span>
                          <span className="text-white font-bold">#{index + 1}</span>
                        </div>
                        <span className="text-white/90 text-sm font-medium">{rank.label}</span>
                      </div>

                      {/* Plant Info */}
                      <div className="p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                            🌱
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                              {plantName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Perfect for your {suggestions.userConditions.balconyType}
                            </p>
                          </div>
                        </div>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <span>✓</span> Suitable Climate
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            <span>☀️</span> {suggestions.userConditions.sunlightHours}h Sun
                          </span>
                        </div>

                        {/* Add Button */}
                        <Link
                          to="/add-plant"
                          state={{ searchQuery: plantName }}
                          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add to Garden
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Plants Section */}
            {suggestions.availablePlants && suggestions.availablePlants.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <span className="text-xl">🌿</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">More Plants to Explore</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Other plants that grow well in India</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {suggestions.availablePlants.slice(0, 12).map((plant, index) => (
                    <Link
                      key={index}
                      to="/add-plant"
                      state={{ searchQuery: plant.name }}
                      className="group p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all overflow-hidden"
                    >
                      <h4 className="font-semibold text-gray-800 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-sm">
                        {plant.name}
                      </h4>
                      {plant.scientificName && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic truncate mt-0.5">{plant.scientificName}</p>
                      )}
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                        {plant.sunlight && (
                          <span className="truncate">☀️ {Array.isArray(plant.sunlight) ? plant.sunlight[0] : plant.sunlight}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TipCard
                icon="🌱"
                title="Start Small"
                description="Begin with 2-3 plants and gradually expand your garden as you gain experience."
                gradient="from-green-500 to-emerald-500"
              />
              <TipCard
                icon="📱"
                title="Track Progress"
                description="Use the care logging feature to track your plants' health and watering schedule."
                gradient="from-blue-500 to-cyan-500"
              />
              <TipCard
                icon="🔬"
                title="Stay Alert"
                description="Use disease detection to catch any plant health issues early and treat them."
                gradient="from-purple-500 to-pink-500"
              />
            </div>

            {/* Refresh Button (Mobile) */}
            <div className="text-center sm:hidden">
              <button
                onClick={fetchSuggestions}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Get New Suggestions
              </button>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative">
                <div className="text-4xl mb-4">🌻</div>
                <h3 className="text-2xl font-bold mb-2">Ready to Grow?</h3>
                <p className="text-white/80 mb-6 max-w-md mx-auto">
                  Pick your favorite plant from the recommendations and start your gardening journey today!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/add-plant"
                    className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add a Plant
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </Layout>
  );
};

// Condition Card Component
const ConditionCard = ({ icon, label, value, gradient }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
    <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-xl shadow-md mb-2`}>
      {icon}
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="font-bold text-gray-800 dark:text-white capitalize truncate">{value}</p>
  </div>
);

// Tip Card Component
const TipCard = ({ icon, title, description, gradient }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg mb-3`}>
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default Suggestions;
