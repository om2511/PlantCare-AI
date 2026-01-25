import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import AddPlant from './pages/dashboard/AddPlant';
import PlantDetails from './pages/dashboard/PlantDetails';
import Suggestions from './pages/dashboard/Suggestions';
import DiseaseDetection from './pages/dashboard/DiseaseDetection';
import Home from './pages/Home';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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

          <Route path="/" element={<Home />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;