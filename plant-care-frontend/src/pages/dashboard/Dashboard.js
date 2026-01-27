import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plantAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [plantsNeedingCare, setPlantsNeedingCare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getHealthyPlantsCount = () => plants.filter(p => p.status === 'healthy').length;
  const getNeedsAttentionCount = () => plants.filter(p => p.status === 'needs-attention').length;

  if (loading) {
    return (
      <Layout>
        <div className="space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 w-40 bg-gray-200 rounded-xl"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-10 w-10 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
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

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            value={plants.length}
            label="Total Plants"
            gradient="from-green-500 to-emerald-500"
            bgColor="bg-green-50"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            value={getHealthyPlantsCount()}
            label="Healthy Plants"
            gradient="from-emerald-500 to-teal-500"
            bgColor="bg-emerald-50"
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            value={plantsNeedingCare.length}
            label="Need Care"
            gradient="from-amber-500 to-orange-500"
            bgColor="bg-amber-50"
            highlight={plantsNeedingCare.length > 0}
          />
          <StatsCard
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            value={getNeedsAttentionCount()}
            label="Needs Attention"
            gradient="from-purple-500 to-pink-500"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            to="/disease-detection"
            icon="🔬"
            title="Disease Detection"
            description="Scan plants for diseases"
            gradient="from-rose-500 to-pink-500"
          />
          <QuickActionCard
            to="/suggestions"
            icon="💡"
            title="Get Suggestions"
            description="AI plant recommendations"
            gradient="from-blue-500 to-cyan-500"
          />
          <QuickActionCard
            to="/add-plant"
            icon="🌱"
            title="Add New Plant"
            description="Grow your garden"
            gradient="from-green-500 to-emerald-500"
          />
          <QuickActionCard
            to="/water-quality"
            icon="💧"
            title="Water Quality"
            description="Check water suitability"
            gradient="from-cyan-500 to-teal-500"
          />
        </div>

        {/* Plants Needing Care Alert */}
        {plantsNeedingCare.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-800">
                  Care Reminder
                </h2>
                <p className="text-amber-700">
                  {plantsNeedingCare.length} plant{plantsNeedingCare.length !== 1 ? 's' : ''} need{plantsNeedingCare.length === 1 ? 's' : ''} your attention today
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantsNeedingCare.map((plant) => (
                <Link
                  key={plant._id}
                  to={`/plants/${plant._id}`}
                  className="group bg-white p-4 rounded-xl border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {plant.images && plant.images.length > 0 ? (
                        <img src={plant.images[0].url} alt={plant.nickname} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        '🌿'
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 truncate">{plant.nickname}</h3>
                      <p className="text-sm text-gray-500 truncate">{plant.species}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-100 space-y-1">
                    {new Date(plant.careSchedule.nextWateringDue) <= new Date() && (
                      <div className="flex items-center gap-2 text-sm text-amber-700">
                        <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs">💧</span>
                        <span>Needs watering</span>
                      </div>
                    )}
                    {plant.careSchedule.nextFertilizingDue &&
                     new Date(plant.careSchedule.nextFertilizingDue) <= new Date() && (
                      <div className="flex items-center gap-2 text-sm text-amber-700">
                        <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">🌿</span>
                        <span>Needs fertilizing</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Plants Section */}
        {plants.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">My Plants</h2>
                <p className="text-gray-500">Your complete plant collection</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{plants.length} plants</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plants.map((plant, index) => (
                <PlantCard key={plant._id} plant={plant} index={index} />
              ))}

              {/* Add Plant Card */}
              <Link
                to="/add-plant"
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-400 hover:from-green-50 hover:to-emerald-50 transition-all duration-300 flex flex-col items-center justify-center min-h-[320px]"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4">
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-500 group-hover:text-green-600 transition-colors">Add New Plant</span>
              </Link>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <TipsSection />
      </div>
    </Layout>
  );
};

// Stats Card Component
const StatsCard = ({ icon, value, label, gradient, bgColor, highlight }) => (
  <div className={`${bgColor} rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ${highlight ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}>
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white shadow-lg mb-3`}>
      {icon}
    </div>
    <div className="text-3xl font-black text-gray-800 mb-1">{value}</div>
    <div className="text-sm text-gray-500 font-medium">{label}</div>
  </div>
);

// Quick Action Card Component
const QuickActionCard = ({ to, icon, title, description, gradient }) => (
  <Link
    to={to}
    className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
  >
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-3`}>
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </Link>
);

// Plant Card Component
const PlantCard = ({ plant, index }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'needs-attention':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'diseased':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return '✓';
      case 'needs-attention':
        return '!';
      case 'diseased':
        return '✕';
      default:
        return '?';
    }
  };

  const daysUntilWatering = Math.ceil(
    (new Date(plant.careSchedule.nextWateringDue) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      to={`/plants/${plant._id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 overflow-hidden">
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
        <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(plant.status)} backdrop-blur-sm bg-opacity-90 flex items-center gap-1`}>
          <span>{getStatusIcon(plant.status)}</span>
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
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors truncate">
            {plant.nickname}
          </h3>
          <p className="text-sm text-gray-500 truncate">{plant.species}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">📍</span>
            <span className="truncate">{plant.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs">☀️</span>
            <span>{plant.sunlightReceived}h sunlight</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${daysUntilWatering <= 0 ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
            <span className={`w-6 h-6 ${daysUntilWatering <= 0 ? 'bg-blue-100' : 'bg-gray-100'} rounded-full flex items-center justify-center text-xs`}>💧</span>
            <span>Water {daysUntilWatering <= 0 ? 'today!' : `in ${daysUntilWatering} day${daysUntilWatering !== 1 ? 's' : ''}`}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Added {new Date(plant.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>View</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-8 sm:p-12 text-center border border-green-100">
    <div className="relative inline-block mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
      <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl mx-auto">
        <img src="/logo.png" alt="PlantCare AI" className="w-full h-full object-contain" />
      </div>
    </div>

    <h2 className="text-3xl font-bold text-gray-800 mb-3">Start Your Garden Journey</h2>
    <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
      Your digital garden is waiting! Add your first plant and let AI help you grow healthier, happier plants.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/add-plant"
        className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Your First Plant</span>
      </Link>
      <Link
        to="/suggestions"
        className="group inline-flex items-center gap-2 bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all duration-300"
      >
        <span>💡</span>
        <span>Get Plant Suggestions</span>
      </Link>
    </div>

    {/* Feature Highlights */}
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        { icon: '🤖', title: 'AI Care Schedules', desc: 'Personalized watering & feeding' },
        { icon: '🔬', title: 'Disease Detection', desc: 'Instant photo diagnosis' },
        { icon: '🌦️', title: 'Seasonal Tips', desc: 'Climate-aware guidance' },
      ].map((feature, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm">
          <div className="text-3xl mb-2">{feature.icon}</div>
          <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-500">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

// Tips Section Component
const TipsSection = () => {
  const tips = [
    {
      icon: '💧',
      title: 'Watering Tip',
      content: 'Water your plants early in the morning to reduce evaporation and give them time to absorb moisture before the heat of the day.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '☀️',
      title: 'Sunlight Tip',
      content: 'Most indoor plants prefer bright, indirect light. Direct sunlight can scorch their leaves, while too little light can cause leggy growth.',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: '🌡️',
      title: 'Temperature Tip',
      content: 'Keep plants away from AC vents and heaters. Sudden temperature changes can stress your plants and affect their growth.',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Quick Tips</h3>
          <p className="text-sm text-gray-500">Helpful advice for your plants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tips.map((tip, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${tip.gradient} rounded-xl flex items-center justify-center text-xl mb-3 shadow-lg`}>
              {tip.icon}
            </div>
            <h4 className="font-bold text-gray-800 mb-2">{tip.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{tip.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
