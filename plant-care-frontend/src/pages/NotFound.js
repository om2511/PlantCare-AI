import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Animated Plant */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce">🌱</div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-full opacity-50 animate-pulse"></div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Looks like this plant hasn't sprouted yet. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <span>🌿</span>
            View Dashboard
          </Link>
        </div>

        {/* Fun Plant Facts */}
        <div className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">While you're here, did you know?</p>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            🌿 Plants can recognize their siblings and will share nutrients with them through their roots!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
