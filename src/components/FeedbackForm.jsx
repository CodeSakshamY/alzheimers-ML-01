'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function FeedbackForm({ predictionRecordId, probability, onFeedbackSubmitted }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackResult, setFeedbackResult] = useState(null);

  const handleFeedback = async (doctorFeedback) => {
    if (submitted) return;
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionRecordId,
          doctorFeedback,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      const data = await response.json();
      setFeedbackResult(data);
      setSubmitted(true);
      
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(data);
      }
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && feedbackResult) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-green-300">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">Feedback Recorded</h3>
            <p className="text-sm text-gray-600">Thank you for helping improve our model!</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Prediction was:</span>
            <span className={`font-bold ${feedbackResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {feedbackResult.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Current Model Accuracy:</span>
            <span className="font-bold text-indigo-600">{feedbackResult.currentAccuracy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total Predictions:</span>
            <span className="font-semibold">{feedbackResult.totalPredictions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Correct Predictions:</span>
            <span className="font-semibold text-green-600">{feedbackResult.correctPredictions}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-lg p-6 border-2 border-amber-300">
      <div className="flex items-start gap-3 mb-4">
        <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Doctor's Diagnosis Feedback</h3>
          <p className="text-sm text-gray-700 mb-4">
            Our model predicted a <strong>{probability}%</strong> probability of Alzheimer's Disease
            {parseFloat(probability) > 50 ? ' (High Risk)' : ' (Low Risk)'}.
          </p>
          <p className="text-sm text-gray-700 mb-4">
            After clinical examination, was the patient <strong>actually diagnosed</strong> with Alzheimer's Disease?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleFeedback(true)}
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          TRUE - Confirmed AD
        </button>
        
        <button
          onClick={() => handleFeedback(false)}
          disabled={submitting}
          className="flex items-center justify-center gap-2 bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <XCircle className="w-5 h-5" />
          FALSE - Not AD
        </button>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Your feedback helps improve the model's accuracy. This data is stored securely in Supabase and used for future predictions.
        </p>
      </div>
    </div>
  );
}
