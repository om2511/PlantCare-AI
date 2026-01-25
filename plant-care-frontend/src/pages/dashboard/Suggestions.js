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

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-xl text-gray-600 mb-4">🤖 AI is analyzing your conditions...</div>
          <div className="animate-pulse text-gray-500">This may take a few seconds</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🤖 AI Plant Suggestions</h1>
          <p className="text-gray-600 mt-2">
            Based on your location and conditions, here are plants that will thrive in your garden
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {suggestions && (
          <>
            {/* User Conditions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Your Conditions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="font-semibold">
                    {suggestions.userConditions.city}, {suggestions.userConditions.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Climate</p>
                  <p className="font-semibold capitalize">{suggestions.userConditions.climateZone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Space</p>
                  <p className="font-semibold capitalize">{suggestions.userConditions.balconyType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sunlight</p>
                  <p className="font-semibold">{suggestions.userConditions.sunlightHours}h/day</p>
                </div>
              </div>
              {suggestions.currentSeason && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    Current Season: <span className="font-semibold capitalize">{suggestions.currentSeason}</span>
                  </p>
                </div>
              )}
            </div>

            {/* AI Reasoning */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-3">💡 AI Analysis</h2>
              <p className="text-gray-700">{suggestions.reasoning}</p>
            </div>

            {/* Suggested Plants */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recommended Plants ({suggestions.suggestions.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.suggestions.map((plantName, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-green-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🌱'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{plantName}</h3>
                        <p className="text-sm text-gray-600">
                          Perfect for your {suggestions.userConditions.balconyType}
                        </p>
                      </div>
                      <Link
                        to="/add-plant"
                        state={{ searchQuery: plantName }}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        Add →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <span className="font-semibold">Tip:</span> Click "Add" to quickly add these plants to your garden.
                AI will generate personalized care schedules based on your conditions!
              </p>
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={fetchSuggestions}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition font-semibold"
              >
                🔄 Get New Suggestions
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Suggestions;