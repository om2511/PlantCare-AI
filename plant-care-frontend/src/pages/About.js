import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - PlantCare AI | AI-Powered Plant Care for India</title>
        <meta name="description" content="Learn about PlantCare AI - India's first AI-powered plant care platform. Our mission is to make gardening accessible and successful for everyone with intelligent care recommendations." />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/about" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
              <span className="text-4xl">🌱</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">PlantCare AI</span>
            </h1>
            <p className="text-xl text-gray-600">
              Making gardening accessible and successful for everyone through AI
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                PlantCare AI was created with a simple yet powerful mission: to empower every Indian gardener—from beginners to experts—with intelligent, personalized plant care guidance. We believe that growing your own food and nurturing plants should be accessible to everyone, regardless of their experience level.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🇮🇳</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Made for India</h3>
                    <p className="text-gray-600">
                      Unlike generic gardening apps, PlantCare AI is specifically designed for Indian climate zones, seasonal patterns (monsoon, summer, winter), and popular Indian plant species. We understand the unique challenges of gardening in India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Intelligence</h3>
                    <p className="text-gray-600">
                      Our advanced AI analyzes multiple factors including your location, climate, soil conditions, and plant species to provide highly personalized care schedules and recommendations. The disease detection feature uses state-of-the-art machine learning to identify plant health issues from photos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Free</h3>
                    <p className="text-gray-600">
                      We believe everyone should have access to quality gardening guidance. That's why PlantCare AI is 100% free forever with no hidden costs, premium tiers, or subscription fees. All features are available to all users.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Database</h3>
                    <p className="text-gray-600">
                      Our extensive plant database includes 30+ popular Indian plant species with detailed care information for vegetables, flowers, herbs, indoor plants, and more. Each entry contains cultivation tips, common problems, and seasonal care guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: '🔬', title: 'Disease Detection', desc: 'AI-powered photo analysis for instant diagnosis' },
                  { icon: '💧', title: 'Smart Schedules', desc: 'Personalized watering and fertilizing reminders' },
                  { icon: '🌦️', title: 'Seasonal Tips', desc: 'Climate-aware recommendations for Indian seasons' },
                  { icon: '📊', title: 'Growth Analytics', desc: 'Track your plants\' progress over time' },
                  { icon: '🔔', title: 'Care Reminders', desc: 'Never miss important maintenance tasks' },
                  { icon: '💡', title: 'Expert Advice', desc: 'AI-generated insights for optimal plant health' },
                ].map((feature, index) => (
                  <div key={index} className="bg-gradient-to-br from-gray-50 to-green-50 rounded-xl p-4">
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                We are committed to continuously improving PlantCare AI by:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Expanding our plant database with more Indian species</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Improving AI accuracy based on user feedback and growing data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Adding regional language support for wider accessibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Building a community of passionate gardeners across India</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-xl">✓</span>
                  <span>Maintaining privacy and security of your gardening data</span>
                </li>
              </ul>
            </section>

            <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">Join Thousands of Happy Gardeners</h2>
              <p className="text-green-50 mb-6">
                Start your smart gardening journey today and watch your garden thrive!
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
              >
                Get Started Free
              </Link>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
