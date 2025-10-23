
import { NextResponse } from 'next/server';
import { updateWithFeedback } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { predictionRecordId, doctorFeedback } = await request.json();
    
    if (!predictionRecordId || typeof doctorFeedback !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid feedback data' },
        { status: 400 }
      );
    }
    
    const result = await updateWithFeedback(predictionRecordId, doctorFeedback);
    
    return NextResponse.json({
      success: true,
      message: 'Feedback recorded successfully',
      isCorrect: result.isCorrect,
      currentAccuracy: result.accuracy.accuracy.toFixed(2),
      totalPredictions: result.accuracy.total_predictions,
      correctPredictions: result.accuracy.correct_predictions,
    });
    
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback', details: error.message },
      { status: 500 }
    );
  }
}
