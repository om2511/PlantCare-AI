import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getPermissionStatus, subscribeToNotifications, unsubscribeFromNotifications } from '../../utils/notifications';
import { notificationAPI } from '../../utils/api';

const Settings = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuth();
  const [notificationError, setNotificationError] = useState('');
  const [notificationBusy, setNotificationBusy] = useState(false);
  const [testBusy, setTestBusy] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [permissionStatus, setPermissionStatus] = useState(getPermissionStatus());
  const [notifications, setNotifications] = useState({
    careReminders: localStorage.getItem('notif_careReminders') !== 'false',
    weeklyReport: localStorage.getItem('notif_weeklyReport') !== 'false',
    tips: localStorage.getItem('notif_tips') !== 'false'
  });
  const [units, setUnits] = useState({
    temperature: localStorage.getItem('unit_temperature') || 'celsius',
    measurement: localStorage.getItem('unit_measurement') || 'metric'
  });

  useEffect(() => {
    const loadNotificationStatus = async () => {
      try {
        const response = await notificationAPI.getStatus();
        setNotificationStatus(response.data.data);
      } catch (error) {
        setNotificationStatus(null);
      }
    };

    loadNotificationStatus();
  }, []);

  // Handle notification toggle
  const handleNotificationChange = async (key) => {
    const newValue = !notifications[key];
    setNotificationError('');

    if (key === 'careReminders') {
      setNotificationBusy(true);
      setNotificationMessage('');
      try {
        if (newValue) {
          await subscribeToNotifications();
          setNotificationMessage('Notifications enabled and subscription synced.');
        } else {
          await unsubscribeFromNotifications();
          setNotificationMessage('Notifications disabled.');
        }
        setPermissionStatus(getPermissionStatus());
        const response = await notificationAPI.getStatus();
        setNotificationStatus(response.data.data);
      } catch (error) {
        setNotificationError(error.message || 'Failed to update notification settings');
        setNotificationBusy(false);
        return;
      }
      setNotificationBusy(false);
    }

    setNotifications((prev) => ({ ...prev, [key]: newValue }));
    localStorage.setItem(`notif_${key}`, newValue.toString());
  };

  // Handle unit change
  const handleUnitChange = (key, value) => {
    setUnits(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`unit_${key}`, value);
  };

  // Clear app cache
  const clearCache = () => {
    // Clear non-essential localStorage items
    const keysToKeep = ['token', 'user', 'darkMode'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    alert('Cache cleared successfully!');
  };

  const sendTestNotification = async () => {
    setNotificationError('');
    setNotificationMessage('');
    setTestBusy(true);
    try {
      await subscribeToNotifications();
      await notificationAPI.sendTest();
      const response = await notificationAPI.getStatus();
      setNotificationStatus(response.data.data);
      setNotificationMessage('Test notification sent. Check this device now.');
    } catch (error) {
      setNotificationError(error.response?.data?.message || error.message || 'Failed to send test notification');
    } finally {
      setTestBusy(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <span className="text-4xl">⚙️</span>
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your PlantCare AI experience</p>
          </div>

          <div className="space-y-6">
            {/* Appearance */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>🎨</span>
                Appearance
              </h2>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-xl">
                    {darkMode ? '🌙' : '☀️'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {darkMode ? 'Dark theme is enabled' : 'Light theme is enabled'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                    darkMode ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      darkMode ? 'translate-x-7' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Theme Preview */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button
                  onClick={() => toggleDarkMode()}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    !darkMode
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-16 bg-white rounded-lg shadow-sm mb-2 flex items-center justify-center">
                    <span className="text-gray-800">Aa</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Light</p>
                </button>
                <button
                  onClick={() => toggleDarkMode()}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    darkMode
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="w-full h-16 bg-gray-800 rounded-lg shadow-sm mb-2 flex items-center justify-center">
                    <span className="text-white">Aa</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark</p>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>🔔</span>
                Notifications
              </h2>
              {notificationError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/50 dark:bg-red-900/20 dark:text-red-300">
                  {notificationError}
                </div>
              )}
              {notificationMessage && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-900/20 dark:text-emerald-300">
                  {notificationMessage}
                </div>
              )}
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Browser permission status: <span className="font-semibold capitalize">{permissionStatus}</span>
              </p>
              <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                <p>Server push configured: <span className="font-semibold">{notificationStatus?.pushConfigured ? 'Yes' : 'No'}</span></p>
                <p>Saved device subscriptions: <span className="font-semibold">{notificationStatus?.subscriptionCount ?? 0}</span></p>
              </div>
              <div className="mb-5 flex flex-wrap gap-3">
                <button
                  onClick={sendTestNotification}
                  disabled={testBusy || notificationBusy}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                    testBusy || notificationBusy
                      ? 'cursor-not-allowed bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {testBusy ? 'Sending Test...' : 'Send Test Notification'}
                </button>
              </div>

              <div className="space-y-4">
                {/* Care Reminders */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl">
                      💧
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Care Reminders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when plants need care</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('careReminders')}
                    disabled={notificationBusy}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      notifications.careReminders ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    } ${notificationBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        notifications.careReminders ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Weekly Report */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-xl">
                      📊
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Weekly Report</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly plant health summary</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('weeklyReport')}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      notifications.weeklyReport ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        notifications.weeklyReport ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Tips & Suggestions */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-xl">
                      💡
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Tips & Suggestions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Helpful gardening tips and tricks</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationChange('tips')}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      notifications.tips ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                        notifications.tips ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Units & Measurements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>📏</span>
                Units & Measurements
              </h2>

              <div className="space-y-4">
                {/* Temperature */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Temperature</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose temperature unit</p>
                  </div>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => handleUnitChange('temperature', 'celsius')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        units.temperature === 'celsius'
                          ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      °C
                    </button>
                    <button
                      onClick={() => handleUnitChange('temperature', 'fahrenheit')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        units.temperature === 'fahrenheit'
                          ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      °F
                    </button>
                  </div>
                </div>

                {/* Measurement System */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">Measurement System</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose measurement system</p>
                  </div>
                  <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => handleUnitChange('measurement', 'metric')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        units.measurement === 'metric'
                          ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => handleUnitChange('measurement', 'imperial')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        units.measurement === 'imperial'
                          ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>👤</span>
                Account
              </h2>

              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-xl">
                      ✏️
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Edit Profile</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Update your personal information</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl">
                      📧
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Email</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data & Storage */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>💾</span>
                Data & Storage
              </h2>

              <div className="space-y-3">
                <button
                  onClick={clearCache}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-xl">
                      🗑️
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-white">Clear Cache</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Free up storage space</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                About
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <img src="/logo.png" alt="PlantCare AI" className="w-12 h-12" />
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white">PlantCare AI</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Made with 💚 for plant lovers
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    © 2024 PlantCare AI. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
