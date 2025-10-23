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

export async function updateWithFeedback(predictionRec
