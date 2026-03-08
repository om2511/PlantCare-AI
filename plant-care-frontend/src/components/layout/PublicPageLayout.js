import React from 'react';
import { Link } from 'react-router-dom';

const PublicPageLayout = ({ title, subtitle, icon, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold">
            <img src="/logo.png" alt="PlantCare AI" className="w-8 h-8 object-contain" />
            <span>PlantCare AI</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm sm:text-base">
            <Link to="/about" className="text-gray-600 hover:text-green-700">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-700">Contact</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-green-700">Privacy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-green-700">Terms</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 text-3xl text-white shadow-lg">
            {icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10">
          {children}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} PlantCare AI</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-green-400">Privacy</Link>
            <Link to="/terms" className="hover:text-green-400">Terms</Link>
            <Link to="/contact" className="hover:text-green-400">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPageLayout;
