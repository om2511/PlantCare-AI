import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { plantAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';

const AddPlant = () => {
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

  const categories = [
    { value: 'vegetable', label: 'Vegetable', icon: '🥬', color: 'from-green-500 to-emerald-500' },
    { value: 'fruit', label: 'Fruit', icon: '🍎', color: 'from-red-500 to-orange-500' },
    { value: 'flower', label: 'Flower', icon: '🌸', color: 'from-pink-500 to-rose-500' },
    { value: 'herb', label: 'Herb', icon: '🌿', color: 'from-emerald-500 to-teal-500' },
    { value: 'indoor', label: 'Indoor', icon: '🪴', color: 'from-teal-500 to-cyan-500' },
    { value: 'succulent', label: 'Succulent', icon: '🌵', color: 'from-lime-500 to-green-500' },
    { value: 'tree', label: 'Tree', icon: '🌳', color: 'from-green-600 to-emerald-600' },
    { value: 'other', label: 'Other', icon: '🌱', color: 'from-gray-500 to-gray-600' },
  ];

  const locations = [
    { value: 'indoor', label: 'Indoor', icon: '🏠', description: 'Inside your home' },
    { value: 'balcony', label: 'Balcony', icon: '🪟', description: 'Apartment balcony' },
    { value: 'terrace', label: 'Terrace', icon: '🏢', description: 'Rooftop space' },
    { value: 'garden', label: 'Garden', icon: '🌳', description: 'Outdoor garden' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
        // Navigate to dashboard with a refresh flag
        navigate('/dashboard', { state: { refresh: true, newPlant: true } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add plant');
      setLoading(false);
    }
  };

  const getSunlightLabel = (hours) => {
    if (hours <= 2) return { label: 'Low Light', color: 'text-gray-600' };
    if (hours <= 4) return { label: 'Partial Shade', color: 'text-blue-600' };
    if (hours <= 6) return { label: 'Partial Sun', color: 'text-yellow-600' };
    if (hours <= 8) return { label: 'Full Sun', color: 'text-orange-600' };
    return { label: 'Intense Sun', color: 'text-red-600' };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">Add New Plant</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Let's add a new member to your garden family</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">

            {/* Details Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Plant Details</h2>
                  <p className="text-gray-500 dark:text-gray-400">Fill in the information about your plant</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Nickname <span className="text-red-500">*</span>
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">(Give your plant a name)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400">💚</span>
                      </div>
                      <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all dark:text-white dark:placeholder-gray-400"
                        placeholder="My Lovely Tomato"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Species <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400">🌿</span>
                      </div>
                      <input
                        type="text"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all dark:text-white dark:placeholder-gray-400"
                        placeholder="Tomato"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 transform hover:-translate-y-1 ${
                          formData.category === cat.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-md`}>
                          {cat.icon}
                        </div>
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Growing Location</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {locations.map((loc) => (
                      <button
                        key={loc.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, location: loc.value })}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 transform hover:-translate-y-1 ${
                          formData.location === loc.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/30 shadow-lg'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-3xl mb-2">{loc.icon}</div>
                        <span className="font-medium text-sm text-gray-800 dark:text-gray-200 block">{loc.label}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{loc.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Planted Date & Sunlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Planted Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="text-gray-400">📅</span>
                      </div>
                      <input
                        type="date"
                        name="plantedDate"
                        value={formData.plantedDate}
                        onChange={handleChange}
                        max="9999-12-31"
                        className="w-full pl-12 pr-2 sm:pr-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all dark:text-white text-sm sm:text-base"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Daily Sunlight Hours
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border-2 border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">🌙</span>
                        <div className={`px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white font-bold shadow-md ${getSunlightLabel(formData.sunlightReceived).color}`}>
                          {formData.sunlightReceived}h - {getSunlightLabel(formData.sunlightReceived).label}
                        </div>
                        <span className="text-2xl">☀️</span>
                      </div>
                      <input
                        type="range"
                        name="sunlightReceived"
                        value={formData.sunlightReceived}
                        onChange={handleChange}
                        min="0"
                        max="12"
                        className="w-full h-2 bg-gradient-to-r from-gray-300 via-yellow-300 to-orange-400 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>0h</span>
                        <span>6h</span>
                        <span>12h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Notes <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:focus:border-green-400 transition-all resize-none dark:text-white dark:placeholder-gray-400"
                      placeholder="Any special notes about this plant... (e.g., bought from local nursery, gift from friend)"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Adding Plant...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Plant to Garden</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Tips Card - Dark mode */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
                  💡
                </div>
                <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Pro Tips</h3>
                  <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
                    <li>• Give your plant a memorable nickname to easily identify it</li>
                    <li>• Accurate sunlight hours help AI generate better care schedules</li>
                    <li>• Add notes about where you bought it or any special care it needs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
      </div>
      </div>
    </Layout>
  );
};

export default AddPlant;
