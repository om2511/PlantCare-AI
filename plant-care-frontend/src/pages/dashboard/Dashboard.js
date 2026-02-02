import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { plantAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import WeatherWidget from '../../components/common/WeatherWidget';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [plantsNeedingCare, setPlantsNeedingCare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when returning from add plant page
  useEffect(() => {
    if (location.state?.refresh) {
      fetchData();
      if (location.state?.newPlant) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }
      // Clear the state to prevent refetching on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const plantsRes = await plantAPI.getPlants();
      if (plantsRes.data.success) {
        setPlants(plantsRes.data.data);
      }

      const careRes = await plantAPI.getPlantsNeedingCare();
      if (careRes.data.success) {
        setPlantsNeedingCare(careRes.data.data);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plants');
      setLoading(false);
    }
  };

  // Filter and search plants
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        plant.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.species?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || plant.status === statusFilter;

      // Category filter
      const matchesCategory = categoryFilter === 'all' || plant.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [plants, searchQuery, statusFilter, categoryFilter]);

  // Get unique categories from plants
  const categories = useMemo(() => {
    const cats = [...new Set(plants.map(p => p.category).filter(Boolean))];
    return cats;
  }, [plants]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getHealthyPlantsCount = () => plants.filter(p => p.status === 'healthy').length;
  const getNeedsAttentionCount = () => plants.filter(p => p.status === 'needs-attention' || p.status === 'diseased').length;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
          <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8">
              <div className="h-8 w-48 bg-white/30 rounded-lg mb-2"></div>
              <div className="h-4 w-32 bg-white/30 rounded"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                  <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3"></div>
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="p-5">
                    <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">👋</span>
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {getGreeting()}, {user?.name?.split(' ')[0] || 'Plant Lover'}!
                  </h1>
                </div>
                <p className="text-white/80 text-lg">
                  {plants.length === 0
                    ? "Ready to start your garden journey?"
                    : `You have ${plants.length} plant${plants.length !== 1 ? 's' : ''} in your garden`
                  }
                </p>
              </div>
              <Link
                to="/add-plant"
                className="group flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Plant</span>
              </Link>
            </div>
          </div>

          {/* Success Alert */}
          {showSuccessMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 rounded-xl animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-700 dark:text-green-300 font-medium">🎉 Plant added successfully!</p>
              </div>
            </div>
          )}

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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<span className="text-xl">🌿</span>}
              value={plants.length}
              label="Total Plants"
              gradient="from-green-500 to-emerald-500"
              bgColor="bg-green-50 dark:bg-green-900/20"
            />
            <StatsCard
              icon={<span className="text-xl">✅</span>}
              value={getHealthyPlantsCount()}
              label="Healthy Plants"
              gradient="from-emerald-500 to-teal-500"
              bgColor="bg-emerald-50 dark:bg-emerald-900/20"
            />
            <Link to="/care-reminders">
              <StatsCard
                icon={<span className="text-xl">🔔</span>}
                value={plantsNeedingCare.length}
                label="Need Care"
                gradient="from-amber-500 to-orange-500"
                bgColor="bg-amber-50 dark:bg-amber-900/20"
                highlight={plantsNeedingCare.length > 0}
              />
            </Link>
            <StatsCard
              icon={<span className="text-xl">⚠️</span>}
              value={getNeedsAttentionCount()}
              label="Needs Attention"
              gradient="from-purple-500 to-pink-500"
              bgColor="bg-purple-50 dark:bg-purple-900/20"
            />
          </div>

          {/* Weather Widget & Quick Actions */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Weather Widget */}
            <div className="lg:col-span-1">
              <WeatherWidget />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <QuickActionCard
                  to="/disease-detection"
                  icon="🔬"
                  title="Disease Detection"
                  gradient="from-rose-500 to-pink-500"
                />
                <QuickActionCard
                  to="/suggestions"
                  icon="💡"
                  title="AI Suggestions"
                  gradient="from-blue-500 to-cyan-500"
                />
                <QuickActionCard
                  to="/care-reminders"
                  icon="🔔"
                  title="Care Reminders"
                  gradient="from-amber-500 to-orange-500"
                />
                <QuickActionCard
                  to="/water-quality"
                  icon="💧"
                  title="Water Quality"
                  gradient="from-cyan-500 to-teal-500"
                />
                <QuickActionCard
                  to="/analytics"
                  icon="📊"
                  title="Analytics"
                  gradient="from-indigo-500 to-purple-500"
                />
                <QuickActionCard
                  to="/add-plant"
                  icon="➕"
                  title="Add Plant"
                  gradient="from-green-500 to-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* All Plants Section */}
          {plants.length === 0 ? (
            <EmptyState />
          ) : (
            <div>
              {/* Search and Filter Bar */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search plants by name or species..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Filters */}
                  <div className="flex flex-wrap gap-2">
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="healthy">Healthy</option>
                      <option value="needs-attention">Needs Attention</option>
                      <option value="diseased">Diseased</option>
                      <option value="dormant">Dormant</option>
                    </select>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="capitalize">{cat}</option>
                        ))}
                      </select>
                    )}

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'list'
                            ? 'bg-white dark:bg-gray-600 text-green-600 dark:text-green-400 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
                    {searchQuery && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm flex items-center gap-1">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="hover:text-green-900 dark:hover:text-green-300">×</button>
                      </span>
                    )}
                    {statusFilter !== 'all' && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-1 capitalize">
                        Status: {statusFilter}
                        <button onClick={() => setStatusFilter('all')} className="hover:text-blue-900 dark:hover:text-blue-300">×</button>
                      </span>
                    )}
                    {categoryFilter !== 'all' && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm flex items-center gap-1 capitalize">
                        Category: {categoryFilter}
                        <button onClick={() => setCategoryFilter('all')} className="hover:text-purple-900 dark:hover:text-purple-300">×</button>
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setCategoryFilter('all');
                      }}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Plants</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filteredPlants.length === plants.length
                      ? `${plants.length} plants in your collection`
                      : `Showing ${filteredPlants.length} of ${plants.length} plants`}
                  </p>
                </div>
              </div>

              {/* Plants Grid/List */}
              {filteredPlants.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No plants found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPlants.map((plant, index) => (
                    <PlantCard key={plant._id} plant={plant} index={index} />
                  ))}

                  {/* Add Plant Card */}
                  <Link
                    to="/add-plant"
                    className="group bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 transition-all duration-300 flex flex-col items-center justify-center min-h-[320px]"
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4">
                      <svg className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Add New Plant</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlants.map((plant) => (
                    <PlantListItem key={plant._id} plant={plant} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tips Section */}
          <TipsSection />
        </div>
      </div>
    </Layout>
  );
};

// Stats Card Component
const StatsCard = ({ icon, value, label, gradient, bgColor, highlight }) => (
  <div className={`${bgColor} rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 ${highlight ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-gray-900' : ''}`}>
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg mb-3`}>
      {icon}
    </div>
    <div className="text-3xl font-black text-gray-800 dark:text-white mb-1">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
  </div>
);

// Quick Action Card Component
const QuickActionCard = ({ to, icon, title, gradient }) => (
  <Link
    to={to}
    className="group bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
  >
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-all duration-300 mb-2`}>
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{title}</h3>
  </Link>
);

// Plant Card Component
const PlantCard = ({ plant, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'needs-attention':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      case 'diseased':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const daysUntilWatering = Math.ceil(
    (new Date(plant.careSchedule?.nextWateringDue) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      to={`/plants/${plant._id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30 overflow-hidden">
        {plant.images && plant.images.length > 0 ? (
          <img
            src={plant.images[0].url}
            alt={plant.nickname}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">🌿</span>
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(plant.status)} backdrop-blur-sm`}>
          <span className="capitalize">{plant.status?.replace('-', ' ')}</span>
        </div>

        {/* Watering Indicator */}
        {daysUntilWatering <= 0 && (
          <div className="absolute top-3 left-3 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
            💧
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
            {plant.nickname}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{plant.species}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <span className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs">📍</span>
            <span className="truncate">{plant.location}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${daysUntilWatering <= 0 ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
            <span className={`w-6 h-6 ${daysUntilWatering <= 0 ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'} rounded-full flex items-center justify-center text-xs`}>💧</span>
            <span>Water {daysUntilWatering <= 0 ? 'today!' : `in ${daysUntilWatering} day${daysUntilWatering !== 1 ? 's' : ''}`}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Plant List Item Component
const PlantListItem = ({ plant }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'needs-attention':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'diseased':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const daysUntilWatering = Math.ceil(
    (new Date(plant.careSchedule?.nextWateringDue) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      to={`/plants/${plant._id}`}
      className="group flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
    >
      {/* Image */}
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
        {plant.images && plant.images.length > 0 ? (
          <img src={plant.images[0].url} alt={plant.nickname} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
          {plant.nickname}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{plant.species}</p>
      </div>

      {/* Status */}
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(plant.status)} capitalize hidden sm:block`}>
        {plant.status?.replace('-', ' ')}
      </span>

      {/* Watering */}
      <div className={`text-sm ${daysUntilWatering <= 0 ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-500 dark:text-gray-400'} hidden md:block`}>
        💧 {daysUntilWatering <= 0 ? 'Today!' : `${daysUntilWatering}d`}
      </div>

      {/* Arrow */}
      <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 text-center border border-gray-100 dark:border-gray-700">
    <div className="relative inline-block mb-6">
      <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
        <img src="/logo.png" alt="PlantCare AI" className="w-20 h-20 object-contain" />
      </div>
    </div>

    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Start Your Garden Journey</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
      Your digital garden is waiting! Add your first plant and let AI help you grow healthier, happier plants.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/add-plant"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Your First Plant</span>
      </Link>
      <Link
        to="/suggestions"
        className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 text-green-600 dark:text-green-400 border-2 border-green-600 dark:border-green-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 dark:hover:bg-gray-600 transition-all duration-300"
      >
        <span>💡</span>
        <span>Get Plant Suggestions</span>
      </Link>
    </div>
  </div>
);

// Tips Section Component
const TipsSection = () => {
  const tips = [
    {
      icon: '💧',
      title: 'Watering Tip',
      content: 'Water your plants early in the morning to reduce evaporation.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '☀️',
      title: 'Sunlight Tip',
      content: 'Most indoor plants prefer bright, indirect light.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: '🌡️',
      title: 'Temperature Tip',
      content: 'Keep plants away from AC vents and heaters.',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
          💡
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Quick Tips</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Helpful advice for your plants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-5 hover:shadow-md transition-all duration-300"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${tip.gradient} rounded-xl flex items-center justify-center text-xl mb-3 shadow-lg`}>
              {tip.icon}
            </div>
            <h4 className="font-bold text-gray-800 dark:text-white mb-2">{tip.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
