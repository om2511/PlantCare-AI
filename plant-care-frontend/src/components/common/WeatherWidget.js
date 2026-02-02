import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const WeatherWidget = ({ compact = false }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchWeather();
  }, [user]);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get city from user profile or use default
      const city = user?.location?.city || 'Mumbai';

      // Using Open-Meteo API (free, no API key required)
      // First get coordinates for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found');
      }

      const { latitude, longitude, name } = geoData.results[0];

      // Get weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      setWeather({
        city: name,
        temperature: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: Math.round(weatherData.current.wind_speed_10m),
        weatherCode: weatherData.current.weather_code,
        maxTemp: Math.round(weatherData.daily.temperature_2m_max[0]),
        minTemp: Math.round(weatherData.daily.temperature_2m_min[0]),
        rainChance: weatherData.daily.precipitation_probability_max[0]
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to load weather');
    } finally {
      setLoading(false);
    }
  };

  // Weather code to icon and description mapping
  const getWeatherInfo = (code) => {
    const weatherMap = {
      0: { icon: '☀️', desc: 'Clear sky', tip: 'Great day for outdoor plants!' },
      1: { icon: '🌤️', desc: 'Mainly clear', tip: 'Good conditions for plant care' },
      2: { icon: '⛅', desc: 'Partly cloudy', tip: 'Ideal for most plants' },
      3: { icon: '☁️', desc: 'Overcast', tip: 'Lower light today' },
      45: { icon: '🌫️', desc: 'Foggy', tip: 'High humidity - check for fungus' },
      48: { icon: '🌫️', desc: 'Foggy', tip: 'High humidity - check for fungus' },
      51: { icon: '🌧️', desc: 'Light drizzle', tip: 'Skip watering outdoor plants' },
      53: { icon: '🌧️', desc: 'Drizzle', tip: 'Skip watering outdoor plants' },
      55: { icon: '🌧️', desc: 'Heavy drizzle', tip: 'Check for waterlogging' },
      61: { icon: '🌧️', desc: 'Light rain', tip: 'Skip watering outdoor plants' },
      63: { icon: '🌧️', desc: 'Rain', tip: 'Move delicate plants indoors' },
      65: { icon: '🌧️', desc: 'Heavy rain', tip: 'Protect plants from heavy rain' },
      71: { icon: '🌨️', desc: 'Light snow', tip: 'Protect plants from cold' },
      73: { icon: '🌨️', desc: 'Snow', tip: 'Move plants indoors' },
      75: { icon: '🌨️', desc: 'Heavy snow', tip: 'Keep plants warm' },
      77: { icon: '🌨️', desc: 'Snow grains', tip: 'Protect from frost' },
      80: { icon: '🌦️', desc: 'Light showers', tip: 'May skip watering' },
      81: { icon: '🌦️', desc: 'Showers', tip: 'Check drainage' },
      82: { icon: '⛈️', desc: 'Heavy showers', tip: 'Protect sensitive plants' },
      95: { icon: '⛈️', desc: 'Thunderstorm', tip: 'Keep plants safe indoors' },
      96: { icon: '⛈️', desc: 'Thunderstorm', tip: 'Avoid outdoor care' },
      99: { icon: '⛈️', desc: 'Severe storm', tip: 'Stay safe, check plants later' }
    };
    return weatherMap[code] || { icon: '🌡️', desc: 'Weather', tip: 'Check conditions before watering' };
  };

  // Get plant care tip based on weather
  const getPlantCareTip = () => {
    if (!weather) return '';

    if (weather.temperature > 35) {
      return 'Hot day! Water plants early morning or evening. Provide shade for sensitive plants.';
    }
    if (weather.temperature > 30) {
      return 'Warm weather - check soil moisture frequently. Mulch helps retain water.';
    }
    if (weather.temperature < 15) {
      return 'Cool weather - reduce watering frequency. Move tropical plants indoors.';
    }
    if (weather.humidity > 80) {
      return 'High humidity - reduce watering and watch for fungal issues.';
    }
    if (weather.humidity < 40) {
      return 'Low humidity - mist your plants or use a humidity tray.';
    }
    if (weather.rainChance > 70) {
      return 'Rain expected - skip watering outdoor plants today.';
    }

    return getWeatherInfo(weather.weatherCode).tip;
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl ${compact ? 'p-4' : 'p-6'} text-white animate-pulse`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-6 bg-white/30 rounded w-24 mb-2"></div>
            <div className="h-4 bg-white/30 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl ${compact ? 'p-4' : 'p-6'} text-white`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌡️</span>
          <div>
            <p className="font-medium">{error}</p>
            <button onClick={fetchWeather} className="text-sm underline hover:no-underline">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const weatherInfo = getWeatherInfo(weather?.weatherCode);

  if (compact) {
    return (
      <div className="bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{weatherInfo.icon}</span>
            <div>
              <p className="text-2xl font-bold">{weather?.temperature}°C</p>
              <p className="text-sm text-white/80">{weather?.city}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p>💧 {weather?.humidity}%</p>
            <p>🌧️ {weather?.rainChance}%</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{weatherInfo.icon}</span>
          <div>
            <p className="text-4xl font-bold">{weather?.temperature}°C</p>
            <p className="text-white/80">{weatherInfo.desc}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium">{weather?.city}</p>
          <p className="text-sm text-white/70">
            H: {weather?.maxTemp}° L: {weather?.minTemp}°
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
          <p className="text-2xl">💧</p>
          <p className="text-lg font-bold">{weather?.humidity}%</p>
          <p className="text-xs text-white/70">Humidity</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
          <p className="text-2xl">💨</p>
          <p className="text-lg font-bold">{weather?.windSpeed}</p>
          <p className="text-xs text-white/70">km/h Wind</p>
        </div>
        <div className="bg-white/20 rounded-xl p-3 text-center backdrop-blur-sm">
          <p className="text-2xl">🌧️</p>
          <p className="text-lg font-bold">{weather?.rainChance}%</p>
          <p className="text-xs text-white/70">Rain Chance</p>
        </div>
      </div>

      {/* Plant Care Tip */}
      <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
        <p className="text-sm font-medium flex items-center gap-2">
          <span>🌱</span>
          Plant Care Tip
        </p>
        <p className="text-white/90 text-sm mt-1">{getPlantCareTip()}</p>
      </div>
    </div>
  );
};

export default WeatherWidget;
