import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ totalPlants: 0, healthyPlants: 0, needsAttention: 0 });

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    state: '',
    climateZone: '',
    balconyType: '',
    sunlightHours: 0,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Climate zones
  const climateZones = [
    { value: 'coastal', label: 'Coastal', icon: '🌊', description: 'Humid, moderate temperatures' },
    { value: 'tropical', label: 'Tropical', icon: '🌴', description: 'Hot and humid year-round' },
    { value: 'temperate', label: 'Temperate', icon: '🌤️', description: 'Moderate climate with seasons' },
    { value: 'arid', label: 'Arid/Desert', icon: '🏜️', description: 'Hot and dry conditions' },
    { value: 'mountain', label: 'Mountain', icon: '🏔️', description: 'Cool with altitude variations' }
  ];

  // Growing locations
  const growingLocations = [
    { value: 'indoor', label: 'Indoor', icon: '🏠', description: 'Inside your home' },
    { value: 'balcony', label: 'Balcony', icon: '🏢', description: 'Apartment balcony space' },
    { value: 'terrace', label: 'Terrace', icon: '🌇', description: 'Rooftop or terrace garden' },
    { value: 'garden', label: 'Garden', icon: '🌳', description: 'Outdoor garden space' }
  ];

  // Indian states
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh'
  ];

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/plants');
      const plants = response.data.data || [];
      setStats({
        totalPlants: plants.length,
        healthyPlants: plants.filter(p => p.status === 'healthy').length,
        needsAttention: plants.filter(p => p.status === 'needs-attention' || p.status === 'diseased').length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        city: user.location?.city || '',
        state: user.location?.state || '',
        climateZone: user.location?.climateZone || '',
        balconyType: user.balconyType || '',
        sunlightHours: user.sunlightHours || 0,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
    fetchStats();
  }, [user, fetchStats]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords if trying to change
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
    }

    setSaving(true);

    try {
      const updateData = {
        name: formData.name,
        location: {
          city: formData.city,
          state: formData.state,
          climateZone: formData.climateZone
        },
        balconyType: formData.balconyType,
        sunlightHours: parseInt(formData.sunlightHours) || 0
      };

      // Include password if changing
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await api.put('/auth/profile', updateData);

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        // Update auth context
        if (updateUser) {
          updateUser(response.data.data);
        }
        setIsEditing(false);
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-green-700">{success}</p>
            </div>
          )}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fadeIn">
              <span className="text-red-500 text-xl">!</span>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Cover Image */}
                <div className="h-24 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

                {/* Avatar & Info */}
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">
                      {getInitials(user?.name)}
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>

                    {user?.location?.city && (
                      <div className="flex items-center justify-center gap-1 mt-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{user.location.city}, {user.location.state}</span>
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-3">
                      Member since {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t border-gray-100 px-6 py-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.totalPlants}</p>
                      <p className="text-xs text-gray-500">Plants</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{stats.healthyPlants}</p>
                      <p className="text-xs text-gray-500">Healthy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{stats.needsAttention}</p>
                      <p className="text-xs text-gray-500">Attention</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="border-t border-gray-100 p-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full py-2.5 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🌿</span>
                    View My Plants
                  </button>
                </div>
              </div>

              {/* Growing Conditions Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🌱</span>
                  Growing Conditions
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Climate Zone</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {climateZones.find(c => c.value === user?.location?.climateZone)?.label || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Growing Location</span>
                    <span className="font-medium text-gray-800 capitalize">
                      {growingLocations.find(l => l.value === user?.balconyType)?.label || 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Sunlight Hours</span>
                    <span className="font-medium text-gray-800">
                      {user?.sunlightHours || 0} hours/day
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Edit Profile' : 'Profile Details'}
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Basic Info */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Basic Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            isEditing
                              ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                              : 'border-gray-200 bg-gray-50'
                          } transition-all outline-none`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Location
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="e.g., Mumbai"
                          className={`w-full px-4 py-3 rounded-xl border ${
                            isEditing
                              ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                              : 'border-gray-200 bg-gray-50'
                          } transition-all outline-none`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 rounded-xl border ${
                            isEditing
                              ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                              : 'border-gray-200 bg-gray-50'
                          } transition-all outline-none`}
                        >
                          <option value="">Select State</option>
                          {indianStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Climate Zone */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Climate Zone
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {climateZones.map((zone) => (
                        <button
                          key={zone.value}
                          type="button"
                          onClick={() => isEditing && setFormData(prev => ({ ...prev, climateZone: zone.value }))}
                          disabled={!isEditing}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            formData.climateZone === zone.value
                              ? 'border-green-500 bg-green-50'
                              : isEditing
                              ? 'border-gray-200 hover:border-green-300'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{zone.icon}</div>
                          <p className="text-sm font-medium text-gray-800">{zone.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Growing Location */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Growing Location
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {growingLocations.map((location) => (
                        <button
                          key={location.value}
                          type="button"
                          onClick={() => isEditing && setFormData(prev => ({ ...prev, balconyType: location.value }))}
                          disabled={!isEditing}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            formData.balconyType === location.value
                              ? 'border-green-500 bg-green-50'
                              : isEditing
                              ? 'border-gray-200 hover:border-green-300'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{location.icon}</div>
                          <p className="text-sm font-medium text-gray-800">{location.label}</p>
                          <p className="text-xs text-gray-500 mt-1">{location.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sunlight Hours */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Daily Sunlight Hours
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Available sunlight</span>
                        <span className="font-bold text-green-600 text-lg">{formData.sunlightHours} hours</span>
                      </div>
                      <input
                        type="range"
                        name="sunlightHours"
                        min="0"
                        max="12"
                        value={formData.sunlightHours}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                          isEditing ? 'bg-green-200' : 'bg-gray-300'
                        }`}
                        style={{
                          background: isEditing
                            ? `linear-gradient(to right, #22c55e 0%, #22c55e ${(formData.sunlightHours / 12) * 100}%, #e5e7eb ${(formData.sunlightHours / 12) * 100}%, #e5e7eb 100%)`
                            : undefined
                        }}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0h (Shade)</span>
                        <span>6h (Partial)</span>
                        <span>12h (Full Sun)</span>
                      </div>
                    </div>
                  </div>

                  {/* Change Password */}
                  {isEditing && (
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Change Password (Optional)
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setError('');
                          // Reset form data
                          if (user) {
                            setFormData({
                              name: user.name || '',
                              email: user.email || '',
                              city: user.location?.city || '',
                              state: user.location?.state || '',
                              climateZone: user.location?.climateZone || '',
                              balconyType: user.balconyType || '',
                              sunlightHours: user.sunlightHours || 0,
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }
                        }}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 border-2 border-red-100">
                <h3 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Danger Zone
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  onClick={() => alert('Account deletion feature coming soon. Please contact support.')}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </Layout>
  );
};

export default Profile;
