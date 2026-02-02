import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import api from '../../utils/api';

const CareReminders = () => {
  const [plants, setPlants] = useState([]);
  const [allPlants, setAllPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, watering, fertilizing, pruning
  const [markingCare, setMarkingCare] = useState(null);

  // Fetch plants needing care
  const fetchPlantsNeedingCare = useCallback(async () => {
    try {
      setLoading(true);
      const [careResponse, allPlantsResponse] = await Promise.all([
        api.get('/plants/care/today'),
        api.get('/plants')
      ]);
      setPlants(careResponse.data.data || []);
      setAllPlants(allPlantsResponse.data.data || []);
    } catch (err) {
      console.error('Error fetching care reminders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlantsNeedingCare();
  }, [fetchPlantsNeedingCare]);

  // Get care tasks from plants
  const getCareTasks = () => {
    const tasks = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    plants.forEach(plant => {
      // Watering task
      if (plant.careSchedule?.nextWateringDue) {
        const dueDate = new Date(plant.careSchedule.nextWateringDue);
        dueDate.setHours(0, 0, 0, 0);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

        tasks.push({
          id: `${plant._id}-water`,
          plantId: plant._id,
          plantName: plant.nickname || plant.species,
          plantImage: plant.images?.[0]?.url,
          type: 'watering',
          dueDate: plant.careSchedule.nextWateringDue,
          daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
          isOverdue: daysOverdue > 0,
          isDueToday: daysOverdue === 0,
          status: plant.status
        });
      }

      // Fertilizing task
      if (plant.careSchedule?.nextFertilizingDue) {
        const dueDate = new Date(plant.careSchedule.nextFertilizingDue);
        dueDate.setHours(0, 0, 0, 0);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

        if (daysOverdue >= 0) {
          tasks.push({
            id: `${plant._id}-fertilize`,
            plantId: plant._id,
            plantName: plant.nickname || plant.species,
            plantImage: plant.images?.[0]?.url,
            type: 'fertilizing',
            dueDate: plant.careSchedule.nextFertilizingDue,
            daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
            isOverdue: daysOverdue > 0,
            isDueToday: daysOverdue === 0,
            status: plant.status
          });
        }
      }

      // Pruning task
      if (plant.careSchedule?.nextPruningDue) {
        const dueDate = new Date(plant.careSchedule.nextPruningDue);
        dueDate.setHours(0, 0, 0, 0);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

        if (daysOverdue >= 0) {
          tasks.push({
            id: `${plant._id}-prune`,
            plantId: plant._id,
            plantName: plant.nickname || plant.species,
            plantImage: plant.images?.[0]?.url,
            type: 'pruning',
            dueDate: plant.careSchedule.nextPruningDue,
            daysOverdue: daysOverdue > 0 ? daysOverdue : 0,
            isOverdue: daysOverdue > 0,
            isDueToday: daysOverdue === 0,
            status: plant.status
          });
        }
      }
    });

    // Filter tasks
    let filteredTasks = tasks;
    if (filter !== 'all') {
      filteredTasks = tasks.filter(task => task.type === filter);
    }

    // Sort by urgency (overdue first, then by days)
    return filteredTasks.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return b.daysOverdue - a.daysOverdue;
    });
  };

  // Mark care as done
  const markCareDone = async (task) => {
    setMarkingCare(task.id);
    try {
      await api.post('/care', {
        plantId: task.plantId,
        activityType: task.type,
        notes: `Marked as done from Care Reminders`
      });
      await fetchPlantsNeedingCare();
    } catch (err) {
      console.error('Error marking care done:', err);
    } finally {
      setMarkingCare(null);
    }
  };

  // Get task icon
  const getTaskIcon = (type) => {
    switch (type) {
      case 'watering': return '💧';
      case 'fertilizing': return '🌿';
      case 'pruning': return '✂️';
      default: return '🌱';
    }
  };

  // Get task color
  const getTaskColor = (type) => {
    switch (type) {
      case 'watering': return 'from-blue-500 to-cyan-500';
      case 'fertilizing': return 'from-green-500 to-emerald-500';
      case 'pruning': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // Get urgency badge
  const getUrgencyBadge = (task) => {
    if (task.daysOverdue > 3) {
      return { text: 'Critical', color: 'bg-red-500' };
    } else if (task.daysOverdue > 0) {
      return { text: `${task.daysOverdue}d overdue`, color: 'bg-orange-500' };
    } else if (task.isDueToday) {
      return { text: 'Due Today', color: 'bg-yellow-500' };
    }
    return null;
  };

  // Get upcoming care (next 7 days)
  const getUpcomingCare = () => {
    const upcoming = [];
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    allPlants.forEach(plant => {
      if (plant.careSchedule?.nextWateringDue) {
        const dueDate = new Date(plant.careSchedule.nextWateringDue);
        if (dueDate > today && dueDate <= nextWeek) {
          upcoming.push({
            plantName: plant.nickname || plant.species,
            type: 'watering',
            dueDate: dueDate,
            daysUntil: Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
          });
        }
      }
    });

    return upcoming.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 5);
  };

  const careTasks = getCareTasks();
  const upcomingCare = getUpcomingCare();
  const stats = {
    total: careTasks.length,
    overdue: careTasks.filter(t => t.isOverdue).length,
    dueToday: careTasks.filter(t => t.isDueToday).length,
    watering: careTasks.filter(t => t.type === 'watering').length,
    fertilizing: careTasks.filter(t => t.type === 'fertilizing').length,
    pruning: careTasks.filter(t => t.type === 'pruning').length
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <span className="text-4xl">🔔</span>
                Care Reminders
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Keep your plants healthy with timely care</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center text-2xl">
                  ⚠️
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Due Today</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.dueToday}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-2xl">
                  📅
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Watering</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.watering}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-2xl">
                  💧
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-2xl">
                  ✅
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Tasks Section */}
            <div className="lg:col-span-2">
              {/* Filter Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-md mb-6 flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All Tasks', icon: '📋' },
                  { key: 'watering', label: 'Watering', icon: '💧' },
                  { key: 'fertilizing', label: 'Fertilizing', icon: '🌿' },
                  { key: 'pruning', label: 'Pruning', icon: '✂️' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      filter === tab.key
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : careTasks.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-md text-center">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                    🎉
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">All Caught Up!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No pending care tasks. Your plants are well taken care of!
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <span>🌿</span>
                    View My Plants
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {careTasks.map(task => {
                    const urgency = getUrgencyBadge(task);
                    return (
                      <div
                        key={task.id}
                        className={`bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 shadow-md border-l-4 transition-all hover:shadow-lg ${
                          task.isOverdue ? 'border-red-500' : task.isDueToday ? 'border-yellow-500' : 'border-green-500'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Plant Image */}
                          <Link to={`/plants/${task.plantId}`} className="flex-shrink-0">
                            {task.plantImage ? (
                              <img
                                src={task.plantImage}
                                alt={task.plantName}
                                className="w-16 h-16 rounded-xl object-cover"
                              />
                            ) : (
                              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getTaskColor(task.type)} flex items-center justify-center text-2xl text-white`}>
                                {getTaskIcon(task.type)}
                              </div>
                            )}
                          </Link>

                          {/* Task Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Link
                                to={`/plants/${task.plantId}`}
                                className="font-bold text-gray-800 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors truncate"
                              >
                                {task.plantName}
                              </Link>
                              {urgency && (
                                <span className={`px-2 py-0.5 ${urgency.color} text-white text-xs rounded-full font-medium`}>
                                  {urgency.text}
                                </span>
                              )}
                              {task.status === 'diseased' && (
                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full">
                                  Diseased
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <span className="text-lg">{getTaskIcon(task.type)}</span>
                              <span className="capitalize font-medium">{task.type}</span>
                              <span className="text-gray-400 dark:text-gray-500">•</span>
                              <span className="text-sm">
                                Due: {new Date(task.dueDate).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => markCareDone(task)}
                            disabled={markingCare === task.id}
                            className={`flex-shrink-0 px-4 py-2 bg-gradient-to-r ${getTaskColor(task.type)} text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50`}
                          >
                            {markingCare === task.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <span>✓</span>
                                <span>Mark Done</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Care */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>📆</span>
                  Upcoming This Week
                </h3>
                {upcomingCare.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming tasks this week</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingCare.map((task, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-sm">
                          {getTaskIcon(task.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{task.plantName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            In {task.daysUntil} day{task.daysUntil > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Tips */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span>💡</span>
                  Care Tips
                </h3>
                <ul className="space-y-3 text-sm text-green-50">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Water plants in the morning for best absorption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Check soil moisture before watering - stick your finger 2 inches deep</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Yellow leaves often indicate overwatering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Fertilize less in winter when growth slows</span>
                  </li>
                </ul>
              </div>

              {/* Plant Health Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <span>🌡️</span>
                  Plant Health
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Healthy</span>
                    <span className="font-bold text-green-600">
                      {allPlants.filter(p => p.status === 'healthy').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Needs Attention</span>
                    <span className="font-bold text-yellow-600">
                      {allPlants.filter(p => p.status === 'needs-attention').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Diseased</span>
                    <span className="font-bold text-red-600">
                      {allPlants.filter(p => p.status === 'diseased').length}
                    </span>
                  </div>
                </div>
                <Link
                  to="/disease-detection"
                  className="mt-4 w-full py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔬</span>
                  Check Plant Health
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CareReminders;
