import { NextResponse } from 'next/server';
import { calculateStats, predictProbability, generatePatientStats, calculateModelMetrics } from '@/lib/model';
import { getTrainingDataset, savePatientData, savePredictionRecord } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { patientData } = await request.json();
    
    if (!patientData) {
      return NextResponse.json(
        { error: 'Patient data is required' },
        { status: 400 }
      );
    }
    
    const trainingData = await getTrainingDataset();
    
    if (trainingData.length === 0) {
      return NextResponse.json(
        { error: 'No training data available in Supabase' },
        { status: 500 }
      );
    }
    
    const stats = calculateStats(trainingData);
    const probability = predictProbability(patientData, stats);
    const patientStats = generatePatientStats(patientData, stats);
    const metrics = calculateModelMetrics(trainingData, stats);
    
    const patientDataId = await savePatientData(patientData, probability);
    const predictionRecordId = await savePredictionRecord(patientDataId, probability);
    
    return NextResponse.json({
      success: true,
      probability: probability.toFixed(1),
      stats: patientStats,
      metrics,
      patientDataId,
      predictionRecordId,
      trainingDataCount: trainingData.length,
    });
    
  } catch (error) {
    console.error('Error in prediction:', error);
    return NextResponse.json(
      { error: 'Prediction failed', details: error.message },
      { status: 500 }
    );
  }
}
