-- ============================================
-- ALZHEIMER'S PREDICTOR DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Table 1: Patient Datasets
CREATE TABLE IF NOT EXISTS patient_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(255),
    
    -- All 33 biomarkers
    ptau181 DECIMAL(10, 2),
    ptau231 DECIMAL(10, 2),
    ptau217 DECIMAL(10, 2),
    ab4240 DECIMAL(10, 4),
    ttau DECIMAL(10, 2),
    ab42 DECIMAL(10, 2),
    nfl DECIMAL(10, 2),
    ykl40 DECIMAL(10, 2),
    lactoferrin DECIMAL(10, 2),
    ache DECIMAL(10, 2),
    pche DECIMAL(10, 2),
    serpina3 DECIMAL(10, 2),
    formic DECIMAL(10, 2),
    ad7cntp DECIMAL(10, 2),
    gfap DECIMAL(10, 2),
    uchl1 DECIMAL(10, 2),
    strem2 DECIMAL(10, 2),
    apod DECIMAL(10, 2),
    asynuclein DECIMAL(10, 2),
    il1 DECIMAL(10, 2),
    il6 DECIMAL(10, 2),
    tnfa DECIMAL(10, 2),
    ceramide DECIMAL(10, 2),
    dha DECIMAL(10, 2),
    linolenic DECIMAL(10, 2),
    cholesterol DECIMAL(10, 2),
    apoc3 DECIMAL(10, 2),
    substancep DECIMAL(10, 2),
    mir545 DECIMAL(10, 2),
    mir7g DECIMAL(10, 2),
    mir15b DECIMAL(10, 2),
    neurograin DECIMAL(10, 2),
    evproteins DECIMAL(10, 2),
    
    label INTEGER CHECK (label IN (0, 1)),
    predicted_probability DECIMAL(5, 2),
    actual_diagnosis BOOLEAN,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 2: Prediction Records
CREATE TABLE IF NOT EXISTS prediction_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_data_id UUID REFERENCES patient_datasets(id) ON DELETE CASCADE,
    predicted_probability DECIMAL(5, 2),
    predicted_label INTEGER CHECK (predicted_label IN (0, 1)),
    doctor_feedback BOOLEAN,
    feedback_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table 3: Model Accuracy
CREATE TABLE IF NOT EXISTS model_accuracy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    total_predictions INTEGER DEFAULT 0,
    correct_predictions INTEGER DEFAULT 0,
    incorrect_predictions INTEGER DEFAULT 0,
    accuracy DECIMAL(5, 2) DEFAULT 0.00,
    true_positives INTEGER DEFAULT 0,
    true_negatives INTEGER DEFAULT 0,
    false_positives INTEGER DEFAULT 0,
    false_negatives INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize model accuracy
INSERT INTO model_accuracy (id) 
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patient_datasets_label ON patient_datasets(label);
CREATE INDEX IF NOT EXISTS idx_patient_datasets_created ON patient_datasets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prediction_records_patient ON prediction_records(patient_data_id);

-- Row Level Security
ALTER TABLE patient_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_accuracy ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for service role" ON patient_datasets FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON prediction_records FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON model_accuracy FOR ALL USING (true);

-- Generate 50 healthy patients
INSERT INTO patient_datasets (
    ptau181, ptau231, ptau217, ab4240, ttau, ab42, nfl, ykl40,
    lactoferrin, ache, pche, serpina3, formic, ad7cntp,
    gfap, uchl1, strem2, apod, asynuclein, il1, il6, tnfa,
    ceramide, dha, linolenic, cholesterol, apoc3, substancep,
    mir545, mir7g, mir15b, neurograin, evproteins, label
)
SELECT 
    15 + random() * 10, 8 + random() * 7, 0.4 + random() * 0.4,
    0.08 + random() * 0.04, 200 + random() * 150, 700 + random() * 300,
    300 + random() * 300, 100 + random() * 50, 10 + random() * 10,
    0.5 + random() * 1.0, 1.0 + random() * 1.5, 2.0 + random() * 1.5,
    3 + random() * 5, 0.5 + random() * 1.0, 50 + random() * 70,
    10 + random() * 15, 2 + random() * 3, 5 + random() * 5,
    0.5 + random() * 1.0, 0.5 + random() * 1.5, 1.0 + random() * 2.0,
    1.5 + random() * 2.5, 2.0 + random() * 2.0, 4.0 + random() * 3.0,
    0.5 + random() * 1.0, 150 + random() * 50, 8 + random() * 7,
    50 + random() * 50, 0.8 + random() * 0.4, 0.8 + random() * 0.4,
    0.8 + random() * 0.4, 5 + random() * 7, 100 + random() * 100, 0
FROM generate_series(1, 50);

-- Generate 50 Alzheimer's patients
INSERT INTO patient_datasets (
    ptau181, ptau231, ptau217, ab4240, ttau, ab42, nfl, ykl40,
    lactoferrin, ache, pche, serpina3, formic, ad7cntp,
    gfap, uchl1, strem2, apod, asynuclein, il1, il6, tnfa,
    ceramide, dha, linolenic, cholesterol, apoc3, substancep,
    mir545, mir7g, mir15b, neurograin, evproteins, label
)
SELECT 
    60 + random() * 60, 40 + random() * 40, 2.0 + random() * 2.0,
    0.03 + random() * 0.02, 500 + random() * 300, 300 + random() * 200,
    1000 + random() * 1000, 200 + random() * 150, 30 + random() * 15,
    2.5 + random() * 2.0, 4.0 + random() * 3.0, 5.0 + random() * 2.5,
    10 + random() * 6, 3.0 + random() * 3.0, 200 + random() * 200,
    40 + random() * 40, 8 + random() * 7, 15 + random() * 10,
    2.5 + random() * 2.0, 4.0 + random() * 4.0, 6.0 + random() * 6.0,
    8.0 + random() * 7.0, 6.0 + random() * 4.0, 1.5 + random() * 1.5,
    0.2 + random() * 0.4, 220 + random() * 60, 18 + random() * 10,
    150 + random() * 100, 2.0 + random() * 2.0, 0.3 + random() * 0.3,
    2.5 + random() * 2.0, 20 + random() * 15, 350 + random() * 200, 1
FROM generate_series(1, 50);

SELECT 'Database initialized with 100 sample patients!' as message;
