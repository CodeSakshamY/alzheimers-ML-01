import { NextResponse } from 'next/server';
import { getModelAccuracy } from '@/lib/supabase';

export async function GET() {
  try {
    const accuracy = await getModelAccuracy();
    
    return NextResponse.json({
      accuracy: accuracy.accuracy?.toFixed(2) || '0.00',
      totalPredictions: accuracy.total_predictions || 0,
      correctPredictions: accuracy.correct_predictions || 0,
      incorrectPredictions: accuracy.incorrect_predictions || 0,
      breakdown: {
        truePositives: accuracy.true_positives || 0,
        trueNegatives: accuracy.true_negatives || 0,
        falsePositives: accuracy.false_positives || 0,
        falseNegatives: accuracy.false_negatives || 0,
      },
      lastUpdated: accuracy.last_updated,
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error.message },
      { status: 500 }
    );
  }
}
