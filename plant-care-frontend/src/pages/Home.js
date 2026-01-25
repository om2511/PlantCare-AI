import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <div className="text-6xl mb-6">🌱</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Plant Care AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your intelligent gardening companion powered by AI. Get personalized care schedules, 
            disease detection, and expert recommendations for your plants.
          </p>
          
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary transition shadow-lg"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-secondary transition shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon="🤖"
            title="AI Care Schedules"
            description="Get personalized watering, fertilizing, and pruning schedules based on your location and climate."
          />
          <FeatureCard
            icon="🔬"
            title="Disease Detection"
            description="Upload plant photos and get instant AI-powered diagnosis with treatment recommendations."
          />
          <FeatureCard
            icon="🌦️"
            title="Seasonal Tips"
            description="India-specific care tips for monsoon, summer, and winter seasons."
          />
          <FeatureCard
            icon="💧"
            title="Water Quality"
            description="Check if tap, RO, or rainwater is suitable for your specific plants."
          />
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">30+</div>
            <div className="text-gray-600">Indian Plants Database</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <div className="text-gray-600">Free to Use</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-primary mb-2">AI</div>
            <div className="text-gray-600">Powered Recommendations</div>
          </div>
        </div>

        {/* CTA */}
        {!isAuthenticated && (
          <div className="mt-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to grow healthier plants?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join Plant Care AI today and get personalized AI recommendations for your garden
            </p>
            <Link
              to="/register"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block shadow-lg"
            >
              Start Your Garden →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;