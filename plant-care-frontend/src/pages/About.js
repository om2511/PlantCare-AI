import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/layout/PublicPageLayout';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About PlantCare AI</title>
        <meta
          name="description"
          content="Learn what PlantCare AI does, who it is for, and how it helps gardeners with care schedules, reminders, and disease guidance."
        />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/about" />
      </Helmet>

      <PublicPageLayout
        title="About PlantCare AI"
        subtitle="Practical plant care support built for everyday gardeners."
        icon="🌱"
      >
        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">What PlantCare AI Does</h2>
            <p className="leading-relaxed">
              PlantCare AI helps you manage plant care tasks with schedules, reminders, and guidance in one place.
              It is designed to make day-to-day plant care easier to track and follow.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Core Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: '💧', title: 'Care Schedules', desc: 'Track watering and other routine care dates.' },
                { icon: '🔔', title: 'Reminders', desc: 'Get alerts when tasks are due.' },
                { icon: '🧪', title: 'Disease Guidance', desc: 'Analyze plant images and review suggestions.' },
                { icon: '🌦️', title: 'Seasonal Tips', desc: 'See context-aware care recommendations.' }
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Important Note</h2>
            <p className="leading-relaxed">
              The platform provides informational guidance. For severe plant disease, crop loss risk, or high-value
              plants, confirm decisions with a local horticulture expert.
            </p>
          </section>

          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Start?</h3>
            <p className="text-green-100 mb-5">Create an account and set up your first plant profile.</p>
            <Link
              to="/register"
              className="inline-block bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50"
            >
              Create Free Account
            </Link>
          </section>
        </div>
      </PublicPageLayout>
    </>
  );
};

export default About;
