'use client';

import { useState } from 'react';
import { biomarkerInfo } from '@/config/biomarkers';
import { Database } from 'lucide-react';

export default function BiomarkerInput({ onPredict, loading }) {
  const [patientData, setPatientData] = useState(
    Object.fromEntries(
      Object.entries(biomarkerInfo).map(([key, info]) => [
        key,
        ((info.healthyRange[0] + info.healthyRange[1]) / 2).toFixed(2)
      ])
    )
  );

  const categories = {};
  Object.entries(biomarkerInfo).forEach(([key, info]) => {
    if (!categories[info.category]) categories[info.category] = [];
    categories[info.category].push({ key, ...info });
  });

  const handlePredict = () => {
    onPredict(patientData);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-3">
          <Database className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Supabase Training Dataset</h3>
            <p className="text-sm text-gray-600">
              Using patient data stored in Supabase PostgreSQL for predictions
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-indigo-200">
          <p className="text-xs text-gray-600">
            <strong>Status:</strong> <span className="text-green-600">● Connected to Supabase</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            All predictions and feedback are automatically saved to improve model accuracy
          </p>
        </div>
      </div>

      {Object.entries(categories).map(([category, biomarkers]) => (
        <div key={category} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
            {category} Biomarkers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {biomarkers.map(({ key, name, unit }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {name}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={patientData[key]}
                    onChange={(e) =>
                      setPatientData({ ...patientData, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-gray-500">
                    {unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handlePredict}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Analyzing 33 Biomarkers...
          </>
        ) : (
          'Run Complete Analysis'
        )}
      </button>
    </div>
  );
}
