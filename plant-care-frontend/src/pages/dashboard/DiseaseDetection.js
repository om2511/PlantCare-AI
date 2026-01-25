import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/layout/Layout';

const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [plantId, setPlantId] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
    }
  };

  const handleAnalyze = async () => {
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
        'http://localhost:5000/api/disease/analyze',
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

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'moderate':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🔬 AI Disease Detection</h1>
          <p className="text-gray-600 mt-2">
            Upload a photo of your plant and get instant AI diagnosis
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Image</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant ID (Optional)
                </label>
                <input
                  type="text"
                  value={plantId}
                  onChange={(e) => setPlantId(e.target.value)}
                  placeholder="Enter plant ID to link diagnosis"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  If you provide plant ID, the diagnosis will be saved to that plant
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Photo *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {preview ? (
                      <div>
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg mb-4"
                        />
                        <p className="text-sm text-primary font-semibold">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-6xl mb-4">📸</div>
                        <p className="text-gray-600">
                          Click to upload plant image
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Supported: JPG, PNG, WEBP
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzing}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Analyzing with AI...
                  </span>
                ) : (
                  '🔬 Analyze with AI'
                )}
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-semibold mb-2">💡 Tips for best results:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Take photo in good lighting</li>
                  <li>Focus on affected areas (leaves, stems)</li>
                  <li>Avoid blurry images</li>
                  <li>Include multiple symptoms if possible</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">AI Diagnosis</h2>

            {!result ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🤖</div>
                <p>Upload and analyze an image to see results</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Health Status */}
                <div className={`p-4 border rounded-lg ${result.analysis.isHealthy ? 'bg-green-50 border-green-200' : getSeverityColor(result.analysis.severity)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">
                        {result.analysis.isHealthy ? '✅ Healthy Plant' : `⚠️ ${result.analysis.disease}`}
                      </h3>
                      {!result.analysis.isHealthy && (
                        <p className="text-sm capitalize mt-1">
                          Severity: {result.analysis.severity}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-semibold">
                      {result.analysis.confidence}% confident
                    </span>
                  </div>
                </div>

                {/* Symptoms */}
                {result.analysis.symptoms && result.analysis.symptoms.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Symptoms Detected:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.analysis.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Causes */}
                {result.analysis.causes && result.analysis.causes.length > 0 && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Possible Causes:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.analysis.causes.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Treatment */}
                {result.analysis.treatment && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Treatment Plan:</h4>
                    
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-sm font-semibold text-red-800">Immediate Action:</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {result.analysis.treatment.immediate}
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm font-semibold text-blue-800">Short-term (1-2 weeks):</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {result.analysis.treatment.shortTerm}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm font-semibold text-green-800">Long-term Prevention:</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {result.analysis.treatment.longTerm}
                      </p>
                    </div>

                    {result.analysis.treatment.organicOptions && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm font-semibold text-green-800">🌿 Organic Options:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                          {result.analysis.treatment.organicOptions.map((option, index) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.analysis.treatment.chemicalOptions && (
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                        <p className="text-sm font-semibold text-purple-800">🧪 Chemical Options:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-1">
                          {result.analysis.treatment.chemicalOptions.map((option, index) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Prevention */}
                {result.analysis.prevention && result.analysis.prevention.length > 0 && (
                  <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">Prevention Tips:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {result.analysis.prevention.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setResult(null);
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Analyze Another
                  </button>
                  {result.plantUpdated && (
                    <button
                      onClick={() => navigate(`/plants/${plantId}`)}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-secondary"
                    >
                      View Plant
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiseaseDetection;