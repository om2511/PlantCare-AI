import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({});

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Use requestAnimationFrame to ensure DOM is fully painted before observing
    // This fixes the issue where elements already in viewport don't trigger on initial load
    const rafId = requestAnimationFrame(() => {
      const elements = document.querySelectorAll('[data-animate]');

      // Manually check and set visibility for elements already in viewport
      const initialVisible = {};
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport && el.id) {
          initialVisible[el.id] = true;
        }
        observer.observe(el);
      });

      // Set initial visibility state for elements already visible
      if (Object.keys(initialVisible).length > 0) {
        setIsVisible((prev) => ({ ...prev, ...initialVisible }));
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

          {/* Floating Plants Decoration */}
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🌿</div>
          <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float-slow">🌱</div>
          <div className="absolute bottom-40 left-20 text-4xl opacity-20 animate-float-delayed">🍃</div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-float">🌺</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 animate-fade-in-down">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700">AI-Powered Plant Care Platform</span>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-8 animate-scale-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse-slow"></div>
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  <img src="/logo.png" alt="PlantCare AI" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 animate-fade-in-up">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                PlantCare
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
                {' '}AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-gray-700 font-medium mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your Intelligent Gardening Companion
            </p>

            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Transform your gardening experience with AI-powered insights, personalized care schedules,
              instant disease detection, and expert recommendations tailored for Indian climate and plants.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group relative px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative">Go to Dashboard</span>
                  <svg className="w-6 h-6 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative px-10 py-5 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative">Get Started Free</span>
                    <svg className="w-6 h-6 relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="group px-10 py-5 bg-white/80 backdrop-blur-sm border-2 border-green-600 text-green-700 rounded-2xl font-bold text-lg hover:bg-green-50 hover:border-green-700 transition-all duration-300 shadow-lg"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: '✓', text: '100% Free Forever' },
                { icon: '🔒', text: 'Privacy Protected' },
                { icon: '🤖', text: 'AI-Powered Insights' },
                { icon: '🇮🇳', text: 'Made for India' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-green-500 font-bold">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
          <div className="w-8 h-12 border-2 border-green-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-green-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" data-animate className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              POWERFUL FEATURES
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Grow Better
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive plant care tools powered by cutting-edge AI technology,
              designed specifically for Indian gardeners and climate conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🤖',
                gradient: 'from-blue-500 to-cyan-500',
                title: 'Smart AI Schedules',
                description: 'Get personalized watering, fertilizing, and pruning schedules based on your location, climate zone, and plant species.',
              },
              {
                icon: '🔬',
                gradient: 'from-purple-500 to-pink-500',
                title: 'Disease Detection',
                description: 'Upload plant photos for instant AI-powered diagnosis with detailed treatment recommendations and prevention tips.',
              },
              {
                icon: '🌦️',
                gradient: 'from-orange-500 to-amber-500',
                title: 'Seasonal Intelligence',
                description: 'India-specific care tips optimized for monsoon, summer, and winter seasons with climate-aware recommendations.',
              },
              {
                icon: '💧',
                gradient: 'from-green-500 to-teal-500',
                title: 'Water Quality Check',
                description: 'Analyze if tap, RO, or rainwater is suitable for your specific plants with detailed mineral guidance.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible.features ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" data-animate className="py-24 bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center mb-16 ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              SIMPLE PROCESS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your smart gardening journey in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                number: '01',
                icon: '📝',
                title: 'Create Your Profile',
                description: 'Sign up and tell us about your location, climate zone, and growing space. This helps us personalize recommendations just for you.',
              },
              {
                number: '02',
                icon: '🌱',
                title: 'Add Your Plants',
                description: 'Build your digital garden by adding plants. Our extensive database includes 30+ popular Indian plant species with detailed care info.',
              },
              {
                number: '03',
                icon: '✨',
                title: 'Get AI Insights',
                description: 'Receive personalized care schedules, disease detection, seasonal tips, and expert recommendations powered by advanced AI.',
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`relative ${isVisible['how-it-works'] ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/4 -right-6 lg:-right-8 w-12 lg:w-16 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400"></div>
                )}
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{step.icon}</div>
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" data-animate className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-[2.5rem] p-12 lg:p-16 shadow-2xl relative overflow-hidden ${isVisible.stats ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNMCAyMGgyMHYtMjBoMjB2MjBoLTIwdjIwaC0yMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-20"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white relative">
              {[
                { value: '30+', label: 'Plant Species', sublabel: 'Indian varieties' },
                { value: '24/7', label: 'AI Assistance', sublabel: 'Always available' },
                { value: '100%', label: 'Free Forever', sublabel: 'No hidden fees' },
                { value: '5min', label: 'Setup Time', sublabel: 'Quick & easy' },
              ].map((stat, index) => (
                <div key={index} className="space-y-2 group">
                  <div className="text-5xl lg:text-6xl font-black group-hover:scale-110 transition-transform">{stat.value}</div>
                  <div className="text-xl font-semibold opacity-95">{stat.label}</div>
                  <div className="text-sm opacity-75">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plant Categories Section */}
      <section id="plants" data-animate className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isVisible.plants ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              SUPPORTED PLANTS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Plants We Support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From vegetables to flowers, herbs to trees - we've got comprehensive care guides for them all
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { emoji: '🥬', name: 'Vegetables', count: '10+ types' },
              { emoji: '🌸', name: 'Flowers', count: '8+ types' },
              { emoji: '🌿', name: 'Herbs', count: '6+ types' },
              { emoji: '🪴', name: 'Indoor', count: '5+ types' },
              { emoji: '🌵', name: 'Succulents', count: '4+ types' },
              { emoji: '🌳', name: 'Trees', count: '5+ types' },
            ].map((category, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 ${
                  isVisible.plants ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-5xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                  {category.emoji}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" data-animate className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isVisible.testimonials ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              What Plant Lovers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                location: 'Mumbai, Maharashtra',
                avatar: '👩',
                rating: 5,
                text: 'PlantCare AI has transformed my balcony garden! The personalized schedules and disease detection features are amazing. My tomatoes have never been healthier!',
              },
              {
                name: 'Rahul Verma',
                location: 'Delhi NCR',
                avatar: '👨',
                rating: 5,
                text: 'As a beginner gardener, this app is a lifesaver. The AI recommendations are spot-on for Delhi climate. Love the seasonal tips during monsoon!',
              },
              {
                name: 'Anita Patel',
                location: 'Bangalore, Karnataka',
                avatar: '👩‍🦱',
                rating: 5,
                text: 'The water quality analysis feature helped me understand why my plants were struggling. Switched to rainwater collection and saw immediate improvement!',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isVisible.testimonials ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" data-animate className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 ${isVisible.faq ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Is PlantCare AI really free?',
                a: 'Yes! PlantCare AI is completely free to use with no hidden charges or premium plans. All features including AI disease detection, care schedules, and water quality analysis are available to everyone.',
              },
              {
                q: 'How accurate is the AI disease detection?',
                a: 'Our AI uses advanced machine learning models trained on thousands of plant images. While it provides reliable guidance for common diseases, we always recommend consulting a local expert for severe cases.',
              },
              {
                q: 'Does it work for Indian climate conditions?',
                a: 'Absolutely! PlantCare AI is specifically designed for Indian climate zones - tropical, coastal, temperate, arid, and mountain regions. Our recommendations account for monsoon, summer, and winter seasons.',
              },
              {
                q: 'What plants are supported?',
                a: 'We support 30+ popular Indian plant species including vegetables (tomato, chili, spinach), flowers (rose, marigold), herbs (tulsi, mint), indoor plants, succulents, and fruit trees.',
              },
              {
                q: 'Do I need any gardening experience?',
                a: 'Not at all! PlantCare AI is designed for complete beginners as well as experienced gardeners. Our AI simplifies complex plant care into easy-to-follow recommendations.',
              },
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} index={index} isVisible={isVisible.faq} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
              Ready to Transform Your Garden?
            </h2>
            <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of plant lovers and start your journey to healthier, happier plants today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-white text-green-600 px-12 py-6 rounded-2xl font-black text-xl hover:bg-gray-100 transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              <span>Start Growing Smarter</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-8 text-white/80 text-lg">
              🎉 Free forever. No credit card required.
            </p>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <img src="/logo.png" alt="PlantCare AI" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-bold">PlantCare AI</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Making plant care intelligent, accessible, and enjoyable for everyone.
                Powered by AI, designed for Indian gardens.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/login" className="hover:text-green-400 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-green-400 transition-colors">Register</Link></li>
                <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><a href="#faq" className="hover:text-green-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="space-y-3 text-gray-400">
                <li>AI Care Schedules</li>
                <li>Disease Detection</li>
                <li>Seasonal Tips</li>
                <li>Water Quality</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PlantCare AI. All rights reserved. Made with 💚 for Indian Gardeners</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer, index, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg' : ''} ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-lg">{question}</span>
        <svg
          className={`w-6 h-6 text-green-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
        <p className="px-6 pb-5 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

export default Home;
