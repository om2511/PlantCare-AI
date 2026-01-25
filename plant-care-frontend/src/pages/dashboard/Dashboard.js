import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plantAPI } from '../../utils/api';
import Layout from '../../components/layout/Layout';

const Dashboard = () => {
  const [plants, setPlants] = useState([]);
  const [plantsNeedingCare, setPlantsNeedingCare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all plants
      const plantsRes = await plantAPI.getPlants();
      if (plantsRes.data.success) {
        setPlants(plantsRes.data.data);
      }

      // Fetch plants needing care
      const careRes = await plantAPI.getPlantsNeedingCare();
      if (careRes.data.success) {
        setPlantsNeedingCare(careRes.data.data);
      }

      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load plants');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading your plants...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Garden</h1>
            <p className="text-gray-600 mt-1">
              You have {plants.length} plant{plants.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/add-plant"
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            + Add New Plant
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Plants Needing Care Today */}
        {plantsNeedingCare.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-4">
              ⚠️ {plantsNeedingCare.length} Plant{plantsNeedingCare.length !== 1 ? 's' : ''} Need{plantsNeedingCare.length === 1 ? 's' : ''} Care Today
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plantsNeedingCare.map((plant) => (
                <Link
                  key={plant._id}
                  to={`/plants/${plant._id}`}
                  className="bg-white p-4 rounded-lg border border-yellow-300 hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-gray-800">{plant.nickname}</h3>
                  <p className="text-sm text-gray-600">{plant.species}</p>
                  <div className="mt-2 text-xs text-yellow-700">
                    {new Date(plant.careSchedule.nextWateringDue) <= new Date() && (
                      <p>💧 Needs watering</p>
                    )}
                    {plant.careSchedule.nextFertilizingDue && 
                     new Date(plant.careSchedule.nextFertilizingDue) <= new Date() && (
                      <p>🌿 Needs fertilizing</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Plants */}
        {plants.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No plants yet</h2>
            <p className="text-gray-600 mb-6">Start your garden by adding your first plant!</p>
            <Link
              to="/add-plant"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Add Your First Plant
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Plants</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => (
                <PlantCard key={plant._id} plant={plant} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Plant Card Component
const PlantCard = ({ plant }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'diseased':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const daysUntilWatering = Math.ceil(
    (new Date(plant.careSchedule.nextWateringDue) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      to={`/plants/${plant._id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
    >
      <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
        {plant.images && plant.images.length > 0 ? (
          <img
            src={plant.images[0].url}
            alt={plant.nickname}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">🌿</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{plant.nickname}</h3>
            <p className="text-sm text-gray-600">{plant.species}</p>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(plant.status)}`}>
            {plant.status}
          </span>
        </div>

        <div className="space-y-1 text-sm text-gray-600">
          <p>📍 {plant.location}</p>
          <p>☀️ {plant.sunlightReceived}h sunlight</p>
          <p className={daysUntilWatering <= 0 ? 'text-red-600 font-semibold' : ''}>
            💧 Water {daysUntilWatering <= 0 ? 'today' : `in ${daysUntilWatering} days`}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Added {new Date(plant.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;