import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function getTrainingDataset() {
  const { data, error } = await supabaseAdmin
    .from('patient_datasets')
    .select('*')
    .in('label', [0, 1]);

  if (error) {
    console.error('Error fetching training data:', error);
    throw error;
  }

  return data.map(row => {
    const { id, patient_id, label, predicted_probability, actual_diagnosis, created_at, updated_at, ...biomarkers } = row;
    return { ...biomarkers, label };
  });
}

export async function savePatientData(biomarkers, predictedProbability) {
  const { data, error } = await supabaseAdmin
    .from('patient_datasets')
    .insert([{
      ...biomarkers,
      predicted_probability: predictedProbability,
      label: predictedProbability > 50 ? 1 : 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving patient data:', error);
    throw error;
  }

  return data.id;
}

export async function savePredictionRecord(patientDataId, predictedProbability) {
  const { data, error } = await supabaseAdmin
    .from('prediction_records')
    .insert([{
      patient_data_id: patientDataId,
      predicted_probability: predictedProbability,
      predicted_label: predictedProbability > 50 ? 1 : 0,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error saving prediction record:', error);
    throw error;
  }

  return data.id;
}

export async function updateWithFeedback(predictionRecordId, doctorFeedback) {
  const { data: record, error: recordError } = await supabaseAdmin
    .from('prediction_records')
    .update({
      doctor_feedback: doctorFeedback,
      feedback_date: new Date().toISOString(),
    })
    .eq('id', predictionRecordId)
    .select()
    .single();

  if (recordError) throw recordError;

  const { data: patientData, error: patientError } = await supabaseAdmin
    .from('patient_datasets')
    .select('*')
    .eq('id', record.patient_data_id)
    .single();

  if (patientError) throw patientError;

  const predictedAD = record.predicted_label === 1;
  const isCorrect = doctorFeedback === predictedAD;

  const { data: accuracy, error: accError } = await supabaseAdmin
    .from('model_accuracy')
    .select('*')
    .limit(1)
    .single();

  if (accError && accError.code !== 'PGRST116') throw accError;

  const totalPredictions = (accuracy?.total_predictions || 0) + 1;
  const correctPredictions = (accuracy?.correct_predictions || 0) + (isCorrect ? 1 : 0);
  const incorrectPredictions = (accuracy?.incorrect_predictions || 0) + (isCorrect ? 0 : 1);
  
  let truePositives = accuracy?.true_positives || 0;
  let trueNegatives = accuracy?.true_negatives || 0;
  let falsePositives = accuracy?.false_positives || 0;
  let falseNegatives = accuracy?.false_negatives || 0;

  if (isCorrect) {
    if (doctorFeedback && predictedAD) truePositives++;
    else if (!doctorFeedback && !predictedAD) trueNegatives++;
  } else {
    if (doctorFeedback && !predictedAD) falseNegatives++;
    else if (!doctorFeedback && predictedAD) falsePositives++;
  }

  const newAccuracy = (correctPredictions / totalPredictions) * 100;

  const { data: updatedAccuracy, error: updateError } = await supabaseAdmin
    .from('model_accuracy')
    .upsert({
      id: '00000000-0000-0000-0000-000000000001',
      total_predictions: totalPredictions,
      correct_predictions: correctPredictions,
      incorrect_predictions: incorrectPredictions,
      accuracy: newAccuracy,
      true_positives: truePositives,
      true_negatives: trueNegatives,
      false_positives: falsePositives,
      false_negatives: falseNegatives,
      last_updated: new Date().toISOString(),
    })
    .select()
    .single();

  if (updateError) throw updateError;

  await supabaseAdmin
    .from('patient_datasets')
    .update({
      actual_diagnosis: doctorFeedback,
      label: doctorFeedback ? 1 : 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', record.patient_data_id);

  return { accuracy: updatedAccuracy, isCorrect };
}

export async function getModelAccuracy() {
  const { data, error } = await supabaseAdmin
    .from('model_accuracy')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching model accuracy:', error);
    throw error;
  }

  return data || {
    total_predictions: 0,
    correct_predictions: 0,
    incorrect_predictions: 0,
    accuracy: 0,
    true_positives: 0,
    true_negatives: 0,
    false_positives: 0,
    false_negatives: 0,
  };
}
