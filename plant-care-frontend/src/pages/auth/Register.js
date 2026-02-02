import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: {
      city: '',
      state: '',
      climateZone: 'tropical'
    },
    balconyType: 'balcony',
    sunlightHours: 6
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError('');

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const nextStep = () => {
    if (currentStep === 1 && formData.name && formData.email && formData.password && formData.password.length >= 6) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const climateZones = [
    { value: 'tropical', label: 'Tropical', icon: '🌴', description: 'Hot & humid year-round' },
    { value: 'coastal', label: 'Coastal', icon: '🌊', description: 'Moderate with sea breeze' },
    { value: 'temperate', label: 'Temperate', icon: '🌳', description: 'Mild seasons' },
    { value: 'arid', label: 'Arid', icon: '🏜️', description: 'Hot & dry' },
    { value: 'mountain', label: 'Mountain', icon: '⛰️', description: 'Cool & crisp' },
  ];

  const growingSpaces = [
    { value: 'indoor', label: 'Indoor', icon: '🏠', description: 'Inside your home' },
    { value: 'balcony', label: 'Balcony', icon: '🪴', description: 'Apartment balcony' },
    { value: 'terrace', label: 'Terrace', icon: '🏢', description: 'Rooftop space' },
    { value: 'garden', label: 'Garden', icon: '🌳', description: 'Outdoor garden' },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 text-6xl opacity-10 animate-float hidden lg:block">🌿</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 animate-float-slow hidden lg:block">🌱</div>
        <div className="absolute top-1/2 left-10 text-4xl opacity-10 animate-float-delayed hidden lg:block">🍃</div>
      </div>

      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-md animate-fade-in-left">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <img src="/logo.png" alt="PlantCare AI" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                PlantCare AI
              </h1>
              <p className="text-gray-600">Your Intelligent Gardening Companion</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Start your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              smart gardening
            </span>{' '}
            journey
          </h2>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of plant lovers using AI-powered insights to grow healthier, happier plants.
          </p>

          {/* Features List */}
          <div className="space-y-4">
            {[
              { icon: '🤖', title: 'AI-Powered Care', desc: 'Personalized schedules based on your conditions' },
              { icon: '🔬', title: 'Disease Detection', desc: 'Instant diagnosis from plant photos' },
              { icon: '🌦️', title: 'Seasonal Tips', desc: 'India-specific recommendations' },
              { icon: '💧', title: 'Water Analysis', desc: 'Know if your water is plant-friendly' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-3/5 xl:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
        <div className="w-full max-w-xl animate-fade-in-right">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4 group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <img src="/logo.png" alt="PlantCare AI" className="w-full h-full object-contain" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              PlantCare AI
            </h1>
          </div>

          {/* Desktop Back Link */}
          <div className="hidden lg:block mb-6">
            <Link to="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium group">
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 1
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className={`font-medium text-sm hidden sm:inline ${currentStep >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                  Account
                </span>
              </div>
              <div className={`w-12 sm:w-20 h-1 rounded-full transition-all ${
                currentStep >= 2 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gray-200'
              }`}></div>
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep >= 2
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className={`font-medium text-sm hidden sm:inline ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                  Preferences
                </span>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/50">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-fade-in">
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

            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Info */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h2>
                    <p className="text-gray-600">Enter your details to get started</p>
                  </div>

                  {/* Name Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            formData.password.length === 0 ? 'w-0' :
                            formData.password.length < 6 ? 'w-1/4 bg-red-500' :
                            formData.password.length < 8 ? 'w-2/4 bg-yellow-500' :
                            formData.password.length < 12 ? 'w-3/4 bg-green-500' : 'w-full bg-green-600'
                          }`}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formData.password.length === 0 ? '' :
                         formData.password.length < 6 ? 'Too weak' :
                         formData.password.length < 8 ? 'Fair' :
                         formData.password.length < 12 ? 'Good' : 'Strong'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.name || !formData.email || formData.password.length < 6}
                    className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Step 2: Preferences */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Personalize Your Experience</h2>
                    <p className="text-gray-600">Help us provide better recommendations</p>
                  </div>

                  {/* Location Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        placeholder="Maharashtra"
                      />
                    </div>
                  </div>

                  {/* Climate Zone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Climate Zone</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {climateZones.map((zone) => (
                        <button
                          key={zone.value}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'location.climateZone', value: zone.value } })}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            formData.location.climateZone === zone.value
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-xl mb-1">{zone.icon}</div>
                          <div className="font-medium text-sm text-gray-900">{zone.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Growing Space */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Growing Space</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {growingSpaces.map((space) => (
                        <button
                          key={space.value}
                          type="button"
                          onClick={() => handleChange({ target: { name: 'balconyType', value: space.value } })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.balconyType === space.value
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{space.icon}</div>
                          <div className="font-medium text-sm text-gray-900">{space.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sunlight Hours */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Daily Sunlight Hours
                    </label>
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">0h</span>
                        <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-bold">
                          {formData.sunlightHours} hours
                        </div>
                        <span className="text-sm text-gray-600">12h</span>
                      </div>
                      <input
                        type="range"
                        name="sunlightHours"
                        value={formData.sunlightHours}
                        onChange={handleChange}
                        min="0"
                        max="12"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Shade</span>
                        <span>Partial Sun</span>
                        <span>Full Sun</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      <span>Back</span>
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
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '🤖', text: 'AI-Powered' },
              { icon: '🎉', text: '100% Free' },
              { icon: '🔒', text: 'Secure' },
            ].map((item, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/50">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs font-medium text-gray-600">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
