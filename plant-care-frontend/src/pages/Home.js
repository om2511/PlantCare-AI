import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 relative">
          <div className="text-center">
            <div className="flex justify-center mb-8 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <img src="/logo.png" alt="PlantCare AI" className="h-28 w-28 sm:h-32 sm:w-32 relative z-10 drop-shadow-2xl" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-6 leading-tight">
              PlantCare AI
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto font-medium">
              Your Intelligent Gardening Companion
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the future of plant care with AI-powered insights, personalized schedules, 
              disease detection, and expert recommendations tailored for Indian climate and plants.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <span>Go to Dashboard</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
                  >
                    <span>Get Started Free</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-200 w-full sm:w-auto text-center"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>AI-Powered Care</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Grow Better</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive plant care tools powered by cutting-edge AI technology, designed specifically for Indian gardeners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon="🤖"
            gradient="from-blue-500 to-cyan-500"
            title="Smart AI Schedules"
            description="Get personalized watering, fertilizing, and pruning schedules based on your specific location, climate zone, and plant species."
          />
          <FeatureCard
            icon="🔬"
            gradient="from-purple-500 to-pink-500"
            title="Disease Detection"
            description="Upload plant photos for instant AI-powered diagnosis with detailed treatment recommendations and prevention tips."
          />
          <FeatureCard
            icon="🌦️"
            gradient="from-orange-500 to-red-500"
            title="Seasonal Intelligence"
            description="India-specific care tips optimized for monsoon, summer, and winter seasons with climate-aware recommendations."
          />
          <FeatureCard
            icon="💧"
            gradient="from-green-500 to-teal-500"
            title="Water Quality Check"
            description="Analyze if tap, RO, or rainwater is suitable for your specific plants with detailed mineral content guidance."
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-gray-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start your smart gardening journey in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <StepCard
              number="01"
              title="Create Your Profile"
              description="Sign up and tell us about your location, climate zone, and growing space. This helps us personalize recommendations just for you."
              icon="📝"
            />
            <StepCard
              number="02"
              title="Add Your Plants"
              description="Build your digital garden by adding plants. Our extensive database includes 30+ popular Indian plant species."
              icon="🌱"
            />
            <StepCard
              number="03"
              title="Get AI Insights"
              description="Receive personalized care schedules, disease detection, seasonal tips, and expert recommendations powered by AI."
              icon="✨"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-12 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-bold">30+</div>
              <div className="text-xl opacity-90">Indian Plant Species</div>
              <p className="text-sm opacity-75">Comprehensive database</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-bold">24/7</div>
              <div className="text-xl opacity-90">AI Assistance</div>
              <p className="text-sm opacity-75">Always available</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl lg:text-6xl font-bold">100%</div>
              <div className="text-xl opacity-90">Free to Use</div>
              <p className="text-sm opacity-75">No hidden charges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">PlantCare AI?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Transform your gardening experience with intelligent, data-driven plant care solutions.
            </p>
            <div className="space-y-6">
              <BenefitItem
                title="Climate-Aware Recommendations"
                description="Tailored advice for Indian weather patterns and seasonal changes"
              />
              <BenefitItem
                title="Easy Disease Management"
                description="Early detection and treatment plans to keep your plants healthy"
              />
              <BenefitItem
                title="Save Time & Resources"
                description="Automated schedules and reminders so you never miss care tasks"
              />
              <BenefitItem
                title="Expert Knowledge, Simplified"
                description="Complex horticultural science made easy for everyone"
              />
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 shadow-xl">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🌿</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Personalized Care Plans</div>
                      <div className="text-sm text-gray-600">Custom schedules for every plant</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">📊</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Track Growth & Health</div>
                      <div className="text-sm text-gray-600">Monitor your plants over time</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">🔔</div>
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">Smart Reminders</div>
                      <div className="text-sm text-gray-600">Never forget care tasks again</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Garden?
            </h2>
            <p className="text-xl text-white opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of plant lovers and start your journey to healthier, happier plants with AI-powered insights
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 bg-white text-green-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-200 shadow-2xl"
            >
              <span>Start Growing Smarter Today</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-6 text-white text-sm opacity-75">
              🎉 Limited Time: Get access to all premium features for free!
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img src="/logo.png" alt="PlantCare AI" className="h-12 w-12 opacity-90" />
            </div>
            <p className="text-gray-400 mb-4">
              Making plant care intelligent, accessible, and enjoyable for everyone
            </p>
            <p className="text-gray-500 text-sm">
              © 2026 PlantCare AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, gradient, title, description }) => (
  <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl`}></div>
  </div>
);

const StepCard = ({ number, title, description, icon }) => (
  <div className="relative">
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full">
      <div className="text-6xl mb-4 opacity-80">{icon}</div>
      <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
        {number}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const BenefitItem = ({ title, description }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mt-1">
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default Home;