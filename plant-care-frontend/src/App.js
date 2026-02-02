import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AddPlant from './pages/dashboard/AddPlant';
import PlantDetails from './pages/dashboard/PlantDetails';
import Suggestions from './pages/dashboard/Suggestions';
import DiseaseDetection from './pages/dashboard/DiseaseDetection';
import WaterQuality from './pages/dashboard/WaterQuality';
import Profile from './pages/dashboard/Profile';
import CareReminders from './pages/dashboard/CareReminders';
import Analytics from './pages/dashboard/Analytics';
import Settings from './pages/dashboard/Settings';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-plant"
              element={
                <ProtectedRoute>
                  <AddPlant />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plants/:id"
              element={
                <ProtectedRoute>
                  <PlantDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/suggestions"
              element={
                <ProtectedRoute>
                  <Suggestions />
                </ProtectedRoute>
              }
            />

            <Route
              path="/disease-detection"
              element={
                <ProtectedRoute>
                  <DiseaseDetection />
                </ProtectedRoute>
              }
            />

            <Route
              path="/water-quality"
              element={
                <ProtectedRoute>
                  <WaterQuality />
                </ProtectedRoute>
              }
            />

            <Route
              path="/care-reminders"
              element={
                <ProtectedRoute>
                  <CareReminders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
