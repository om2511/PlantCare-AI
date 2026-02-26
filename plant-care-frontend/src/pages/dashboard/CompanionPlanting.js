import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { plantAPI } from '../../utils/api';

const CompanionPlanting = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [plantCount, setPlantCount] = useState(0);
  const [userPlants, setUserPlants] = useState([]);
  const [error, setError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    fetchPlantCount();
  }, []);

  const fetchPlantCount = async () => {
    try {
      const res = await plantAPI.getPlants();
      if (res.data.success) {
        setUserPlants(res.data.data);
        setPlantCount(res.data.data.length);
      }
    } catch (err) {
      console.log('Failed to fetch plants');
    }
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await plantAPI.getCompanionSuggestions();
      if (res.data.success) {
        setSuggestions(res.data.data.suggestions);
        setPlantCount(res.data.data.plantCount);
        setHasLoaded(true);
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get companion suggestions');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', ring: 'ring-green-400', label: 'Excellent' };
    if (score >= 60) return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', ring: 'ring-amber-400', label: 'Good' };
    return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', ring: 'ring-red-400', label: 'Needs Work' };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 px-4 py-2 rounded-full text-green-700 dark:text-green-400 font-medium text-sm mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              AI Multi-Plant Analysis
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              Companion Planting
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover which plants thrive together, which to keep apart, and which new plants would supercharge your garden. AI analyzes all your plants for perfect compatibility.
            </p>
          </div>

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

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-xl">
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {/* No Plants State */}
          {plantCount === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <div className="text-7xl mb-6">🌱</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">No Plants Yet</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Add at least 2 plants to your garden to get companion planting analysis.</p>
              <Link
                to="/add-plant"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Plants
              </Link>
            </div>
          ) : (
            <>
              {/* Garden Overview Card */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 p-6 text-white">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                        🌿
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Your Garden</h2>
                        <p className="text-white/80">{plantCount} plant{plantCount !== 1 ? 's' : ''} ready for analysis</p>
                      </div>
                    </div>
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="bg-white text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <span>🤖</span>
                          {hasLoaded ? 'Re-Analyze Garden' : 'Analyze Garden'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Plant chips */}
                <div className="p-4 flex flex-wrap gap-2">
                  {userPlants.map((plant) => (
                    <Link
                      key={plant._id}
                      to={`/plants/${plant._id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-700"
                    >
                      <span>🌱</span>
                      {plant.species}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Results */}
              {!hasLoaded && !loading && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                    Click "Analyze Garden" to get AI-powered companion planting insights for all your plants.
                  </p>
                </div>
              )}

              {suggestions && (
                <div className="space-y-6 animate-fade-in">
                  {/* Compatibility Score */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Score Circle */}
                      <div className="flex-shrink-0">
                        {(() => {
                          const sc = getScoreColor(suggestions.compatibilityScore);
                          return (
                            <div className={`relative w-32 h-32 rounded-full ${sc.bg} ring-4 ${sc.ring} ring-offset-4 dark:ring-offset-gray-800 flex flex-col items-center justify-center shadow-lg`}>
                              <span className={`text-4xl font-black ${sc.text}`}>{suggestions.compatibilityScore}</span>
                              <span className={`text-xs font-bold ${sc.text}`}>{sc.label}</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Garden Compatibility Score</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{suggestions.compatibilitySummary}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Good Pairings */}
                    {suggestions.goodPairings && suggestions.goodPairings.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <span>✅</span> Great Pairings
                          </h3>
                          <p className="text-white/80 text-sm">Plants that thrive together</p>
                        </div>
                        <div className="p-4 space-y-3">
                          {suggestions.goodPairings.map((pair, i) => (
                            <div key={i} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {pair.plants.map((plant, j) => (
                                  <span key={j} className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-xs font-semibold">
                                    {plant}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{pair.benefit}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bad Pairings */}
                    {suggestions.badPairings && suggestions.badPairings.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4 text-white">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <span>⚠️</span> Keep Separated
                          </h3>
                          <p className="text-white/80 text-sm">Plants that compete or harm each other</p>
                        </div>
                        <div className="p-4 space-y-3">
                          {suggestions.badPairings.map((pair, i) => (
                            <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {pair.plants.map((plant, j) => (
                                  <span key={j} className="px-2 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-full text-xs font-semibold">
                                    {plant}
                                  </span>
                                ))}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{pair.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggested Companions */}
                  {suggestions.suggestedCompanions && suggestions.suggestedCompanions.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <span>💡</span> Suggested Additions to Your Garden
                        </h3>
                        <p className="text-white/80 text-sm">New plants that would complement what you already have</p>
                      </div>
                      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestions.suggestedCompanions.map((companion, i) => (
                          <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-lg shadow-md flex-shrink-0">
                                🌱
                              </div>
                              <h4 className="font-bold text-gray-800 dark:text-white text-sm">{companion.plant}</h4>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{companion.reason}</p>
                            {companion.benefitsFor && companion.benefitsFor.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {companion.benefitsFor.map((plant, j) => (
                                  <span key={j} className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded text-xs">
                                    Helps: {plant}
                                  </span>
                                ))}
                              </div>
                            )}
                            <Link
                              to="/add-plant"
                              className="mt-3 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                            >
                              <span>+</span> Add to Garden
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Layout Tips */}
                    {suggestions.layoutTips && suggestions.layoutTips.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <span>🗺️</span> Garden Layout Tips
                          </h3>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-3">
                            {suggestions.layoutTips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-400 flex-shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{tip}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Pest Control Benefits */}
                    {suggestions.pestControlBenefits && suggestions.pestControlBenefits.length > 0 && (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            <span>🛡️</span> Natural Pest Control
                          </h3>
                        </div>
                        <div className="p-4 space-y-3">
                          {suggestions.pestControlBenefits.map((item, i) => (
                            <div key={i} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-800 dark:text-white">{item.plant}</span>
                                <span className="text-amber-600 dark:text-amber-400">→</span>
                                <span className="text-xs text-red-600 dark:text-red-400">repels {item.repels}</span>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Protects: {item.protects}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-3">✅</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Boost Growth</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Some plants naturally enhance each other's growth through root secretions and nutrient sharing.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-3">🦟</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Repel Pests</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Strategic placement of plants like Tulsi and Marigold can deter harmful insects naturally.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-3">🌸</div>
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Attract Pollinators</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Flowering companion plants attract bees and butterflies, improving your entire garden's yield.</p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default CompanionPlanting;
