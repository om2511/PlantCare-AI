import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import { plantAPI } from '../../utils/api';

const DiseaseDetection = () => {
  const [detectionMode, setDetectionMode] = useState('image'); // 'image' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [plantId, setPlantId] = useState('');
  const [plants, setPlants] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Text mode states
  const [plantName, setPlantName] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await plantAPI.getPlants();
      if (response.data.success) {
        setPlants(response.data.data);
      }
    } catch (err) {
      console.log('Failed to fetch plants');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');

      const formData = new FormData();
      formData.append('image', selectedFile);
      if (plantId) {
        formData.append('plantId', plantId);
      }

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/disease/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
      }

      setAnalyzing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze image');
      setAnalyzing(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!symptoms.trim()) {
      setError('Please describe the symptoms');
      return;
    }

    try {
      setAnalyzing(true);
      setError('');

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/disease/analyze-text`,
        {
          plantName: plantName || 'Unknown plant',
          symptoms,
          plantId: plantId || null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setResult(response.data.data);
      }

      setAnalyzing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms');
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    setPlantName('');
    setSymptoms('');
    setPlantId('');
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'mild':
        return { color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', icon: '⚠️' };
      case 'moderate':
        return { color: 'from-orange-500 to-amber-600', bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', icon: '🔶' };
      case 'severe':
        return { color: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', icon: '🔴' };
      default:
        return { color: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800', icon: '✅' };
    }
  };

  const commonSymptoms = [
    'Yellow leaves',
    'Brown spots on leaves',
    'Wilting',
    'White powder on leaves',
    'Holes in leaves',
    'Curling leaves',
    'Stunted growth',
    'Root rot',
    'Leaf drop',
    'Black spots'
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-purple-700 font-medium text-sm mb-4">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            AI-Powered Diagnosis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Plant Disease Detection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get instant AI diagnosis for your plant's health issues. Upload an image or describe the symptoms for accurate disease identification and treatment recommendations.
          </p>
        </div>

        {/* Detection Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1.5 rounded-2xl inline-flex">
            <button
              onClick={() => { setDetectionMode('image'); resetForm(); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                detectionMode === 'image'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-xl">📸</span>
              <span>Image Scan</span>
            </button>
            <button
              onClick={() => { setDetectionMode('text'); resetForm(); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                detectionMode === 'text'
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-xl">✍️</span>
              <span>Describe Symptoms</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  {detectionMode === 'image' ? '📸' : '✍️'}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {detectionMode === 'image' ? 'Upload Plant Image' : 'Describe Symptoms'}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {detectionMode === 'image'
                      ? 'Take a clear photo of the affected area'
                      : 'Tell us what you observe in your plant'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Plant Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Plant <span className="text-xs font-normal text-gray-500">(Optional - to save diagnosis)</span>
                </label>
                <select
                  value={plantId}
                  onChange={(e) => setPlantId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                >
                  <option value="">Choose a plant from your garden</option>
                  {plants.map((plant) => (
                    <option key={plant._id} value={plant._id}>
                      {plant.nickname} ({plant.species})
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload Mode */}
              {detectionMode === 'image' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plant Photo <span className="text-red-500">*</span>
                  </label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      preview
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {preview ? (
                        <div className="space-y-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-xl shadow-lg"
                          />
                          <p className="text-sm text-purple-600 font-semibold flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <div className="py-8">
                          <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">📷</span>
                          </div>
                          <p className="text-gray-700 font-semibold mb-1">
                            Drop your image here or click to browse
                          </p>
                          <p className="text-sm text-gray-500">
                            Supports: JPG, PNG, WEBP (Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {/* Text Mode */}
              {detectionMode === 'text' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Plant Name <span className="text-xs font-normal text-gray-500">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400">🌱</span>
                      </div>
                      <input
                        type="text"
                        value={plantName}
                        onChange={(e) => setPlantName(e.target.value)}
                        placeholder="e.g., Tomato, Rose, Tulsi"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Describe Symptoms <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows="4"
                      placeholder="Describe what you see... e.g., Yellow spots on leaves, wilting stems, white powder on surface"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                    />
                  </div>

                  {/* Quick Symptom Tags */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Add Symptoms</label>
                    <div className="flex flex-wrap gap-2">
                      {commonSymptoms.map((symptom, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 rounded-full text-sm font-medium transition-all"
                        >
                          + {symptom}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Analyze Button */}
              <button
                onClick={detectionMode === 'image' ? handleAnalyzeImage : handleAnalyzeText}
                disabled={(detectionMode === 'image' && !selectedFile) || (detectionMode === 'text' && !symptoms.trim()) || analyzing}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>AI is Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🔬</span>
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>

              {/* Tips */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <span>💡</span> Tips for accurate results
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {detectionMode === 'image' ? (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Take photos in good, natural lighting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Focus on affected areas (leaves, stems, roots)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Avoid blurry images for better diagnosis</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Be specific about symptoms and their location</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Mention when symptoms first appeared</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Include any recent changes in care routine</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI Diagnosis</h2>
                  <p className="text-white/80 text-sm">Powered by advanced AI models</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!result ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    {detectionMode === 'image'
                      ? 'Upload a photo of your plant and click analyze to get instant AI diagnosis'
                      : 'Describe your plant symptoms and our AI will identify potential issues'}
                  </p>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in">
                  {/* Health Status Card */}
                  {(() => {
                    const config = result.analysis.isHealthy
                      ? getSeverityConfig(null)
                      : getSeverityConfig(result.analysis.severity);
                    return (
                      <div className={`p-5 rounded-2xl border-2 ${config.bg} ${config.border}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                              {config.icon}
                            </div>
                            <div>
                              <h3 className={`text-xl font-bold ${config.text}`}>
                                {result.analysis.isHealthy ? 'Healthy Plant' : result.analysis.disease}
                              </h3>
                              {result.analysis.plantType && (
                                <p className="text-sm text-gray-600">Plant: {result.analysis.plantType}</p>
                              )}
                              {!result.analysis.isHealthy && (
                                <p className={`text-sm font-medium capitalize ${config.text}`}>
                                  Severity: {result.analysis.severity}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${config.bg} ${config.text} border ${config.border}`}>
                            {result.analysis.confidence}% confident
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Symptoms */}
                  {result.analysis.symptoms && result.analysis.symptoms.length > 0 && (
                    <ResultCard
                      icon="👁️"
                      title="Symptoms Detected"
                      gradient="from-amber-500 to-orange-500"
                      bgColor="bg-amber-50"
                      borderColor="border-amber-200"
                    >
                      <ul className="space-y-2">
                        {result.analysis.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}

                  {/* Causes */}
                  {result.analysis.causes && result.analysis.causes.length > 0 && (
                    <ResultCard
                      icon="❓"
                      title="Possible Causes"
                      gradient="from-orange-500 to-red-500"
                      bgColor="bg-orange-50"
                      borderColor="border-orange-200"
                    >
                      <ul className="space-y-2">
                        {result.analysis.causes.map((cause, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-orange-500 mt-0.5">•</span>
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}

                  {/* Treatment Plan */}
                  {result.analysis.treatment && (
                    <div className="space-y-3">
                      <h4 className="font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-xl">💊</span>
                        Treatment Plan
                      </h4>

                      <div className="grid grid-cols-1 gap-3">
                        <TreatmentStep
                          icon="⚡"
                          label="Immediate Action"
                          content={result.analysis.treatment.immediate}
                          color="red"
                        />
                        <TreatmentStep
                          icon="📅"
                          label="Short-term (1-2 weeks)"
                          content={result.analysis.treatment.shortTerm}
                          color="blue"
                        />
                        <TreatmentStep
                          icon="🛡️"
                          label="Long-term Prevention"
                          content={result.analysis.treatment.longTerm}
                          color="green"
                        />
                      </div>

                      {/* Treatment Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {result.analysis.treatment.organicOptions && result.analysis.treatment.organicOptions.length > 0 && (
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                            <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <span>🌿</span> Organic Options
                            </h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {result.analysis.treatment.organicOptions.map((option, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">•</span>
                                  <span>{option}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.analysis.treatment.chemicalOptions && result.analysis.treatment.chemicalOptions.length > 0 && (
                          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                              <span>🧪</span> Chemical Options
                            </h5>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {result.analysis.treatment.chemicalOptions.map((option, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-0.5">•</span>
                                  <span>{option}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Prevention Tips */}
                  {result.analysis.prevention && result.analysis.prevention.length > 0 && (
                    <ResultCard
                      icon="🛡️"
                      title="Prevention Tips"
                      gradient="from-indigo-500 to-purple-500"
                      bgColor="bg-indigo-50"
                      borderColor="border-indigo-200"
                    >
                      <ul className="space-y-2">
                        {result.analysis.prevention.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-indigo-500 mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </ResultCard>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Analyze Another
                    </button>
                    {result.plantUpdated && plantId && (
                      <button
                        onClick={() => navigate(`/plants/${plantId}`)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <span>🌱</span>
                        View Plant
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <InfoCard
            icon="🔬"
            title="AI-Powered Analysis"
            description="Our advanced AI analyzes your plant's symptoms to identify diseases accurately."
            gradient="from-purple-500 to-pink-500"
          />
          <InfoCard
            icon="💊"
            title="Treatment Plans"
            description="Get detailed treatment recommendations including organic and chemical options."
            gradient="from-blue-500 to-cyan-500"
          />
          <InfoCard
            icon="🛡️"
            title="Prevention Tips"
            description="Learn how to prevent future plant diseases with expert guidance."
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Back to Dashboard */}
        <div className="text-center pt-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

// Result Card Component
const ResultCard = ({ icon, title, gradient, bgColor, borderColor, children }) => (
  <div className={`p-4 rounded-xl border ${bgColor} ${borderColor}`}>
    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
      <div className={`w-8 h-8 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-sm shadow-md`}>
        {icon}
      </div>
      {title}
    </h4>
    {children}
  </div>
);

// Treatment Step Component
const TreatmentStep = ({ icon, label, content, color }) => {
  const colors = {
    red: 'bg-red-50 border-red-200 text-red-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`p-3 rounded-xl border ${colors[color]}`}>
      <p className="text-sm font-semibold flex items-center gap-2 mb-1">
        <span>{icon}</span>
        {label}
      </p>
      <p className="text-sm text-gray-700">{content}</p>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ icon, title, description, gradient }) => (
  <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg mb-3`}>
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

export default DiseaseDetection;
