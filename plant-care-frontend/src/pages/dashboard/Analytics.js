import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { plantAPI, careAPI } from '../../utils/api';

const Analytics = () => {
  const [plants, setPlants] = useState([]);
  const [careLogs, setCareLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, all

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [plantsRes, careRes] = await Promise.all([
        plantAPI.getPlants(),
        careAPI.getUserCareLogs()
      ]);

      if (plantsRes.data.success) {
        setPlants(plantsRes.data.data || []);
      }
      if (careRes.data.success) {
        setCareLogs(careRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter care logs by time range
    let filteredLogs = careLogs;
    if (timeRange === 'week') {
      filteredLogs = careLogs.filter(log => new Date(log.activityDate) >= weekAgo);
    } else if (timeRange === 'month') {
      filteredLogs = careLogs.filter(log => new Date(log.activityDate) >= monthAgo);
    }

    // Care activity breakdown
    const activityCounts = filteredLogs.reduce((acc, log) => {
      acc[log.activityType] = (acc[log.activityType] || 0) + 1;
      return acc;
    }, {});

    // Health distribution
    const healthDistribution = plants.reduce((acc, plant) => {
      acc[plant.status] = (acc[plant.status] || 0) + 1;
      return acc;
    }, {});

    // Category distribution
    const categoryDistribution = plants.reduce((acc, plant) => {
      const cat = plant.category || 'other';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Average health score
    const avgHealthScore = plants.length > 0
      ? Math.round(plants.reduce((sum, p) => sum + (p.healthScore || 75), 0) / plants.length)
      : 0;

    // Care activity by day (last 7 days)
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const count = careLogs.filter(log => {
        const logDate = new Date(log.activityDate);
        return logDate >= dayStart && logDate <= dayEnd;
      }).length;

      dailyActivity.push({
        day: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short' }),
        count
      });
    }

    // Plants needing attention
    const needsAttention = plants.filter(p =>
      p.status === 'needs-attention' || p.status === 'diseased'
    ).length;

    return {
      totalPlants: plants.length,
      totalCareLogs: filteredLogs.length,
      activityCounts,
      healthDistribution,
      categoryDistribution,
      avgHealthScore,
      dailyActivity,
      needsAttention
    };
  }, [plants, careLogs, timeRange]);

  // Get max value for chart scaling
  const maxDailyActivity = Math.max(...stats.dailyActivity.map(d => d.count), 1);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-32"></div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-80"></div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-80"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <span className="text-4xl">📊</span>
                Plant Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your garden's health and care activities</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm">
                {[
                  { key: 'week', label: '7 Days' },
                  { key: 'month', label: '30 Days' },
                  { key: 'all', label: 'All Time' }
                ].map(option => (
                  <button
                    key={option.key}
                    onClick={() => setTimeRange(option.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      timeRange === option.key
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon="🌿"
              value={stats.totalPlants}
              label="Total Plants"
              gradient="from-green-500 to-emerald-500"
            />
            <StatCard
              icon="💚"
              value={stats.avgHealthScore}
              label="Avg Health Score"
              suffix="%"
              gradient="from-emerald-500 to-teal-500"
            />
            <StatCard
              icon="📝"
              value={stats.totalCareLogs}
              label="Care Activities"
              gradient="from-blue-500 to-indigo-500"
            />
            <StatCard
              icon="⚠️"
              value={stats.needsAttention}
              label="Need Attention"
              gradient="from-amber-500 to-orange-500"
              highlight={stats.needsAttention > 0}
            />
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Activity Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <span>📈</span>
                Daily Care Activity
              </h3>
              <div className="flex items-end justify-between h-48 gap-2">
                {stats.dailyActivity.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-40">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                        {day.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-purple-600"
                        style={{
                          height: `${(day.count / maxDailyActivity) * 100}%`,
                          minHeight: day.count > 0 ? '8px' : '4px'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <span>🩺</span>
                Plant Health Distribution
              </h3>
              <div className="space-y-4">
                {[
                  { key: 'healthy', label: 'Healthy', color: 'bg-green-500', icon: '✅' },
                  { key: 'needs-attention', label: 'Needs Attention', color: 'bg-amber-500', icon: '⚠️' },
                  { key: 'diseased', label: 'Diseased', color: 'bg-red-500', icon: '🤒' },
                  { key: 'dormant', label: 'Dormant', color: 'bg-gray-400', icon: '💤' }
                ].map(status => {
                  const count = stats.healthDistribution[status.key] || 0;
                  const percentage = stats.totalPlants > 0 ? (count / stats.totalPlants) * 100 : 0;

                  return (
                    <div key={status.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <span>{status.icon}</span>
                          {status.label}
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                          {count} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${status.color} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity Breakdown & Categories */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Care Activity Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <span>🎯</span>
                Care Activity Breakdown
              </h3>
              {Object.keys(stats.activityCounts).length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <span className="text-4xl mb-2 block">📋</span>
                  <p>No care activities logged yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'watering', icon: '💧', color: 'from-blue-400 to-cyan-500' },
                    { key: 'fertilizing', icon: '🌿', color: 'from-green-400 to-emerald-500' },
                    { key: 'pruning', icon: '✂️', color: 'from-purple-400 to-pink-500' },
                    { key: 'repotting', icon: '🪴', color: 'from-amber-400 to-orange-500' },
                    { key: 'inspection', icon: '🔍', color: 'from-indigo-400 to-blue-500' },
                    { key: 'harvesting', icon: '🌾', color: 'from-yellow-400 to-amber-500' }
                  ].map(activity => {
                    const count = stats.activityCounts[activity.key] || 0;
                    return (
                      <div
                        key={activity.key}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center gap-3"
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-xl`}>
                          {activity.icon}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800 dark:text-white">{count}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{activity.key}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <span>🏷️</span>
                Plants by Category
              </h3>
              {Object.keys(stats.categoryDistribution).length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <span className="text-4xl mb-2 block">🌱</span>
                  <p>No plants added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(stats.categoryDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => {
                      const percentage = (count / stats.totalPlants) * 100;
                      const colors = {
                        flower: 'from-pink-500 to-rose-500',
                        vegetable: 'from-green-500 to-emerald-500',
                        herb: 'from-lime-500 to-green-500',
                        fruit: 'from-orange-500 to-red-500',
                        succulent: 'from-teal-500 to-cyan-500',
                        indoor: 'from-indigo-500 to-purple-500',
                        outdoor: 'from-blue-500 to-sky-500',
                        other: 'from-gray-500 to-slate-500'
                      };
                      const gradient = colors[category] || colors.other;

                      return (
                        <div
                          key={category}
                          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                        >
                          <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${gradient}`}></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-800 dark:text-white capitalize">{category}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">{count} plants</span>
                            </div>
                            <div className="mt-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Plants Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <span>🌱</span>
              Plant Health Overview
            </h3>
            {plants.length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">🌿</span>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No plants to analyze yet</p>
                <Link
                  to="/add-plant"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <span>➕</span>
                  Add Your First Plant
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Plant</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Health</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Next Water</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plants.slice(0, 10).map(plant => {
                      const daysUntilWater = Math.ceil(
                        (new Date(plant.careSchedule?.nextWateringDue) - new Date()) / (1000 * 60 * 60 * 24)
                      );
                      const statusColors = {
                        healthy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        'needs-attention': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                        diseased: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                        dormant: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                      };

                      return (
                        <tr key={plant._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <Link to={`/plants/${plant._id}`} className="flex items-center gap-3 hover:text-green-600 dark:hover:text-green-400">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex-shrink-0">
                                {plant.images?.[0]?.url ? (
                                  <img src={plant.images[0].url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 dark:text-white">{plant.nickname}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{plant.species}</p>
                              </div>
                            </Link>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[plant.status] || statusColors.healthy}`}>
                              {plant.status?.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    (plant.healthScore || 75) >= 70 ? 'bg-green-500' :
                                    (plant.healthScore || 75) >= 40 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${plant.healthScore || 75}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{plant.healthScore || 75}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize text-gray-600 dark:text-gray-400">{plant.category || 'other'}</td>
                          <td className="py-3 px-4">
                            <span className={`text-sm ${daysUntilWater <= 0 ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                              {daysUntilWater <= 0 ? '💧 Today' : `${daysUntilWater} days`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {plants.length > 10 && (
                  <div className="text-center py-4">
                    <Link to="/dashboard" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                      View all {plants.length} plants →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label, suffix = '', gradient, highlight }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 ${
    highlight ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-gray-900' : ''
  }`}>
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl text-white shadow-lg mb-3`}>
      {icon}
    </div>
    <p className="text-3xl font-black text-gray-800 dark:text-white">
      {value}{suffix}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
  </div>
);

export default Analytics;
