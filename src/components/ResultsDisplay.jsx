'use client';

import { useState } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { biomarkerInfo } from '@/config/biomarkers';
import FeedbackForm from './FeedbackForm';

export default function ResultsDisplay({ results }) {
  const { probability, stats, metrics, predictionRecordId } = results;
  const [showFeedback, setShowFeedback] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const prepareChartDataByCategory = () => {
    const categories = {};

    Object.entries(biomarkerInfo).forEach(([key, info]) => {
      if (!stats[key]) return;
      
      if (!categories[info.category]) {
        categories[info.category] = [];
      }

      categories[info.category].push({
        name: info.name,
        patient: parseFloat(stats[key].value),
        healthyMean: parseFloat(stats[key].healthyMean),
        adMean: parseFloat(stats[key].adMean),
      });
    });

    return categories;
  };

  const chartData = prepareChartDataByCategory();

  const handleFeedbackSubmitted = (data) => {
    setFeedbackSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div
        className={`rounded-lg shadow-lg p-8 ${
          parseFloat(probability) > 50
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400'
            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <AlertCircle
              className={`w-12 h-12 ${
                parseFloat(probability) > 50 ? 'text-red-600' : 'text-green-600'
              }`}
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                Alzheimer Disease Probability
              </h3>
              <p className="text-sm text-gray-600">
                Multi-biomarker logistic regression analysis
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-6xl font-bold ${
                parseFloat(probability) > 50 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {probability}%
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {parseFloat(probability) > 75
                ? 'High Risk'
                : parseFloat(probability) > 50
                ? 'Moderate Risk'
                : parseFloat(probability) > 25
                ? 'Low Risk'
                : 'Very Low Risk'}
            </p>
          </div>
        </div>
      </div>

      {showFeedback && predictionRecordId && !feedbackSubmitted && (
        <FeedbackForm
          predictionRecordId={predictionRecordId}
          probability={probability}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">{metrics.rocAuc}</div>
          <div className="text-sm text-gray-600 mt-1">ROC-AUC</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{metrics.accuracy}%</div>
          <div className="text-sm text-gray-600 mt-1">Accuracy</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{metrics.sensitivity}%</div>
          <div className="text-sm text-gray-600 mt-1">Sensitivity</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{metrics.specificity}%</div>
          <div className="text-sm text-gray-600 mt-1">Specificity</div>
        </div>
      </div>

      {Object.entries(chartData).map(([category, data]) => (
        <div key={category} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            {category} Biomarkers Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="healthyMean" fill="#10b981" name="Healthy Mean" />
              <Bar dataKey="patient" fill="#6366f1" name="Patient" />
              <Bar dataKey="adMean" fill="#ef4444" name="AD Mean" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}

      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Detailed Biomarker Analysis
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-3 py-2 text-left">Biomarker</th>
              <th className="px-3 py-2 text-right">Patient</th>
              <th className="px-3 py-2 text-right">Healthy Mean</th>
              <th className="px-3 py-2 text-right">AD Mean</th>
              <th className="px-3 py-2 text-right">Z-Score</th>
              <th className="px-3 py-2 text-left">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(biomarkerInfo).map(([key, info], idx) => {
              if (!stats[key]) return null;
              return (
                <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-3 py-2 font-medium">{info.name}</td>
                  <td className="px-3 py-2 text-right">{stats[key].value}</td>
                  <td className="px-3 py-2 text-right">{stats[key].healthyMean}</td>
                  <td className="px-3 py-2 text-right">{stats[key].adMean}</td>
                  <td className="px-3 py-2 text-right font-bold">{stats[key].zScore}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        stats[key].interpretation.includes('normal')
                          ? 'bg-green-100 text-green-800'
                          : stats[key].interpretation.includes('Mild')
                          ? 'bg-yellow-100 text-yellow-800'
                          : stats[key].interpretation.includes('Moderate')
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {stats[key].interpretation}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confusion Matrix</h3>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-green-100 p-6 rounded-lg text-center border-2 border-green-300">
            <div className="text-4xl font-bold text-green-700">
              {metrics.confusionMatrix.tn}
            </div>
            <div className="text-sm text-gray-700 mt-2">True Negative</div>
          </div>
          <div className="bg-red-100 p-6 rounded-lg text-center border-2 border-red-300">
            <div className="text-4xl font-bold text-red-700">
              {metrics.confusionMatrix.fp}
            </div>
            <div className="text-sm text-gray-700 mt-2">False Positive</div>
          </div>
          <div className="bg-red-100 p-6 rounded-lg text-center border-2 border-red-300">
            <div className="text-4xl font-bold text-red-700">
              {metrics.confusionMatrix.fn}
            </div>
            <div className="text-sm text-gray-700 mt-2">False Negative</div>
          </div>
          <div className="bg-green-100 p-6 rounded-lg text-center border-2 border-green-300">
            <div className="text-4xl font-bold text-green-700">
              {metrics.confusionMatrix.tp}
            </div>
            <div className="text-sm text-gray-700 mt-2">True Positive</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-3xl font-bold">
          Patient Probability of Alzheimer = {probability}%
        </p>
        <p className="text-sm mt-2 opacity-90">
          Based on Supabase database analysis of 33 biomarkers
        </p>
      </div>
    </div>
  );
}
