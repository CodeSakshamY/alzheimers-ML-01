'use client';

import { useState, useEffect } from 'react';
import { Brain, Activity, TrendingUp, BarChart3 } from 'lucide-react';
import BiomarkerInput from '@/components/BiomarkerInput';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function Home() {
  const [activeTab, setActiveTab] = useState('input');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelStats, setModelStats] = useState(null);

  useEffect(() => {
    fetchModelStats();
  }, []);

  const fetchModelStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setModelStats(data);
      }
    } catch (error) {
      console.error('Error fetching model stats:', error);
    }
  };

  const handlePrediction = async (patientData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData })
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setResults(data);
      setActiveTab('results');
      
      fetchModelStats();
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to generate prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Advanced Alzheimer's Disease Predictor
                </h1>
                <p className="text-gray-600">
                  Supabase-powered ML system with real-time accuracy tracking
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">33</div>
                <div className="text-xs text-gray-600">Biomarkers</div>
              </div>
              {modelStats && (
                <div className="text-center border-l-2 border-gray-300 pl-4">
                  <div className="text-2xl font-bold text-green-600">
                    {modelStats.accuracy}%
                  </div>
                  <div className="text-xs text-gray-600">Model Accuracy</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {modelStats && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-lg p-4 mb-6 border-2 border-green-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">Live Model Statistics (Supabase)</span>
              </div>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Total:</span>
                  <span className="ml-2 font-bold text-indigo-600">{modelStats.totalPredictions}</span>
                </div>
                <div>
                  <span className="text-gray-600">Correct:</span>
                  <span className="ml-2 font-bold text-green-600">{modelStats.correctPredictions}</span>
                </div>
                <div>
                  <span className="text-gray-600">Incorrect:</span>
                  <span className="ml-2 font-bold text-red-600">{modelStats.incorrectPredictions}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'input'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Activity className="inline w-5 h-5 mr-2" />
              Patient Input
            </button>
            <button
              onClick={() => results && setActiveTab('results')}
              disabled={!results}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'results'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Results & Feedback
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'input' && (
              <BiomarkerInput onPredict={handlePrediction} loading={loading} />
            )}
            
            {activeTab === 'results' && results && (
              <ResultsDisplay results={results} />
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            About This Supabase-Powered System
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              This system uses Supabase PostgreSQL to store and continuously improve predictions:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>Patient Data Storage:</strong> Every prediction is saved to build a larger dataset</li>
              <li><strong>Doctor Feedback Loop:</strong> Clinical verification improves model accuracy</li>
              <li><strong>Real-time Accuracy:</strong> Track model performance as feedback is collected</li>
              <li><strong>33 Biomarkers:</strong> CSF, Blood, Saliva, Tears, Urine, Molecular markers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
