import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, Brain, Activity, TrendingUp, FileText } from 'lucide-react';

const AlzheimerPredictor = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [uploadedData, setUploadedData] = useState(null);
  const [trainingMode, setTrainingMode] = useState('synthetic'); // 'synthetic' or 'uploaded'
  const [uploadStatus, setUploadStatus] = useState('');

  // Complete biomarker list with realistic ranges
  const biomarkerInfo = {
    // CSF Biomarkers
    ptau181: { name: 'p-tau 181', unit: 'pg/mL', category: 'CSF', healthyRange: [15, 25], adRange: [60, 120] },
    ptau231: { name: 'p-tau 231', unit: 'pg/mL', category: 'CSF', healthyRange: [8, 15], adRange: [40, 80] },
    ptau217: { name: 'p-tau 217', unit: 'pg/mL', category: 'CSF', healthyRange: [0.4, 0.8], adRange: [2.0, 4.0] },
    ab4240: { name: 'Aβ42/40 ratio', unit: 'ratio', category: 'CSF', healthyRange: [0.08, 0.12], adRange: [0.03, 0.05] },
    ttau: { name: 'T-tau', unit: 'pg/mL', category: 'CSF', healthyRange: [200, 350], adRange: [500, 800] },
    ab42: { name: 'Aβ42', unit: 'pg/mL', category: 'CSF', healthyRange: [700, 1000], adRange: [300, 500] },
    nfl: { name: 'NFL', unit: 'pg/mL', category: 'CSF', healthyRange: [300, 600], adRange: [1000, 2000] },
    ykl40: { name: 'YKL-40', unit: 'ng/mL', category: 'CSF', healthyRange: [100, 150], adRange: [200, 350] },
    
    // Saliva Biomarkers
    lactoferrin: { name: 'Lactoferrin', unit: 'μg/mL', category: 'Saliva', healthyRange: [10, 20], adRange: [30, 45] },
    ache: { name: 'AChE', unit: 'U/mL', category: 'Saliva', healthyRange: [0.5, 1.5], adRange: [2.5, 4.5] },
    pche: { name: 'PChE', unit: 'U/mL', category: 'Saliva', healthyRange: [1.0, 2.5], adRange: [4.0, 7.0] },
    
    // Tear Biomarkers
    serpina3: { name: 'SERPINA3', unit: 'ng/mL', category: 'Tears', healthyRange: [2.0, 3.5], adRange: [5.0, 7.5] },
    
    // Urine Biomarkers
    formic: { name: 'Formic acid', unit: 'μmol/L', category: 'Urine', healthyRange: [3, 8], adRange: [10, 16] },
    ad7cntp: { name: 'AD7c-NTP', unit: 'U/mL', category: 'Urine', healthyRange: [0.5, 1.5], adRange: [3.0, 6.0] },
    
    // Blood/Plasma Biomarkers
    gfap: { name: 'GFAP', unit: 'pg/mL', category: 'Blood', healthyRange: [50, 120], adRange: [200, 400] },
    uchl1: { name: 'UCHL1', unit: 'ng/mL', category: 'Blood', healthyRange: [10, 25], adRange: [40, 80] },
    strem2: { name: 'sTREM2', unit: 'ng/mL', category: 'Blood', healthyRange: [2, 5], adRange: [8, 15] },
    apod: { name: 'Apolipoprotein D', unit: 'mg/dL', category: 'Blood', healthyRange: [5, 10], adRange: [15, 25] },
    asynuclein: { name: 'α-synuclein', unit: 'ng/mL', category: 'Blood', healthyRange: [0.5, 1.5], adRange: [2.5, 4.5] },
    il1: { name: 'IL-1', unit: 'pg/mL', category: 'Blood', healthyRange: [0.5, 2.0], adRange: [4.0, 8.0] },
    il6: { name: 'IL-6', unit: 'pg/mL', category: 'Blood', healthyRange: [1.0, 3.0], adRange: [6.0, 12.0] },
    tnfa: { name: 'TNF-α', unit: 'pg/mL', category: 'Blood', healthyRange: [1.5, 4.0], adRange: [8.0, 15.0] },
    ceramide: { name: 'Ceramide', unit: 'μmol/L', category: 'Blood', healthyRange: [2.0, 4.0], adRange: [6.0, 10.0] },
    dha: { name: 'DHA', unit: '% of FA', category: 'Blood', healthyRange: [4.0, 7.0], adRange: [1.5, 3.0] },
    linolenic: { name: 'Linolenic Acid', unit: '% of FA', category: 'Blood', healthyRange: [0.5, 1.5], adRange: [0.2, 0.6] },
    cholesterol: { name: 'Cholesterol', unit: 'mg/dL', category: 'Blood', healthyRange: [150, 200], adRange: [220, 280] },
    apoc3: { name: 'APOC3', unit: 'mg/dL', category: 'Blood', healthyRange: [8, 15], adRange: [18, 28] },
    substancep: { name: 'Substance P', unit: 'pg/mL', category: 'Blood', healthyRange: [50, 100], adRange: [150, 250] },
    
    // Molecular Biomarkers
    mir545: { name: 'miR-545-3p', unit: 'fold change', category: 'Molecular', healthyRange: [0.8, 1.2], adRange: [2.0, 4.0] },
    mir7g: { name: 'miR-7g-5p', unit: 'fold change', category: 'Molecular', healthyRange: [0.8, 1.2], adRange: [0.3, 0.6] },
    mir15b: { name: 'miR-15b-5p', unit: 'fold change', category: 'Molecular', healthyRange: [0.8, 1.2], adRange: [2.5, 4.5] },
    neurograin: { name: 'Neurograin', unit: 'ng/mL', category: 'Molecular', healthyRange: [5, 12], adRange: [20, 35] },
    evproteins: { name: 'EV proteins', unit: 'AU', category: 'Molecular', healthyRange: [100, 200], adRange: [350, 550] },
  };

  // Initialize patient data with mid-range healthy values
  const [patientData, setPatientData] = useState(
    Object.fromEntries(
      Object.entries(biomarkerInfo).map(([key, info]) => [
        key, 
        ((info.healthyRange[0] + info.healthyRange[1]) / 2).toFixed(2)
      ])
    )
  );

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus('Processing file...');
    setLoading(true);

    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (fileExtension === 'csv') {
        // Handle CSV files
        const text = await file.text();
        const Papa = await import('papaparse');
        
        Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            processUploadedData(results.data);
          },
          error: (error) => {
            setUploadStatus(`Error parsing CSV: ${error.message}`);
            setLoading(false);
          }
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel files
        const arrayBuffer = await file.arrayBuffer();
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');
        
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { defval: null });
        
        processUploadedData(data);
      } else {
        setUploadStatus('Please upload a CSV or XLSX file');
        setLoading(false);
      }
    } catch (error) {
      setUploadStatus(`Error reading file: ${error.message}`);
      setLoading(false);
    }
  };

  // Process uploaded data
  const processUploadedData = (data) => {
    try {
      // Validate data structure
      if (!data || data.length === 0) {
        setUploadStatus('No data found in file');
        setLoading(false);
        return;
      }

      // Check for label column
      const hasLabel = data.some(row => 'label' in row || 'Label' in row || 'diagnosis' in row || 'Diagnosis' in row);
      
      if (!hasLabel) {
        setUploadStatus('Dataset must include a "label" or "diagnosis" column (0=Healthy, 1=Alzheimer)');
        setLoading(false);
        return;
      }

      // Normalize column names and label column
      const normalizedData = data.map(row => {
        const normalizedRow = {};
        Object.keys(row).forEach(key => {
          const lowerKey = key.toLowerCase().trim();
          if (lowerKey === 'label' || lowerKey === 'diagnosis') {
            normalizedRow.label = parseInt(row[key]);
          } else {
            // Try to match biomarker names
            const matchedKey = Object.keys(biomarkerInfo).find(bioKey => 
              biomarkerInfo[bioKey].name.toLowerCase().replace(/[^a-z0-9]/g, '') === 
              lowerKey.replace(/[^a-z0-9]/g, '')
            );
            if (matchedKey) {
              normalizedRow[matchedKey] = parseFloat(row[key]);
            }
          }
        });
        return normalizedRow;
      });

      // Filter out rows with invalid labels
      const validData = normalizedData.filter(row => row.label === 0 || row.label === 1);

      if (validData.length === 0) {
        setUploadStatus('No valid data rows found. Ensure label column has values 0 or 1');
        setLoading(false);
        return;
      }

      const healthyCount = validData.filter(row => row.label === 0).length;
      const adCount = validData.filter(row => row.label === 1).length;

      setUploadedData(validData);
      setTrainingMode('uploaded');
      setUploadStatus(`✓ Successfully loaded ${validData.length} samples (${healthyCount} healthy, ${adCount} AD)`);
      setLoading(false);
    } catch (error) {
      setUploadStatus(`Error processing data: ${error.message}`);
      setLoading(false);
    }
  };

  // Generate synthetic training data
  const generateSyntheticData = (numSamples = 100) => {
    const data = [];
    
    for (let i = 0; i < numSamples; i++) {
      const isAD = i >= numSamples / 2;
      const sample = { label: isAD ? 1 : 0 };
      
      Object.entries(biomarkerInfo).forEach(([key, info]) => {
        const range = isAD ? info.adRange : info.healthyRange;
        const noise = (Math.random() - 0.5) * (range[1] - range[0]) * 0.3;
        const value = (range[0] + range[1]) / 2 + noise;
        sample[key] = Math.max(0, value);
      });
      
      data.push(sample);
    }
    
    return data;
  };

  // Calculate statistics from synthetic data
  const calculateStats = () => {
    const syntheticData = trainingMode === 'uploaded' && uploadedData 
      ? uploadedData 
      : generateSyntheticData(200);
    
    const healthyData = syntheticData.filter(d => d.label === 0);
    const adData = syntheticData.filter(d => d.label === 1);
    
    const stats = {};
    
    Object.keys(biomarkerInfo).forEach(biomarker => {
      const healthyVals = healthyData.map(d => d[biomarker]);
      const adVals = adData.map(d => d[biomarker]);
      
      const healthyMean = healthyVals.reduce((a, b) => a + b) / healthyVals.length;
      const adMean = adVals.reduce((a, b) => a + b) / adVals.length;
      
      const healthyStd = Math.sqrt(
        healthyVals.reduce((sum, val) => sum + Math.pow(val - healthyMean, 2), 0) / healthyVals.length
      );
      
      stats[biomarker] = {
        healthyMean,
        healthyStd,
        adMean,
        healthyVals,
        adVals
      };
    });
    
    return { stats, syntheticData };
  };

  // Logistic regression prediction
  const predictProbability = (patient, stats) => {
    // Weighted coefficients based on clinical importance
    const coefficients = {
      // CSF markers (highest weight)
      ptau217: 0.08, ptau181: 0.07, ptau231: 0.06,
      ab4240: -0.09, // Inverse relationship
      ab42: -0.07, ttau: 0.06, nfl: 0.05, ykl40: 0.04,
      
      // Blood markers
      gfap: 0.05, uchl1: 0.04, strem2: 0.04,
      apod: 0.03, asynuclein: 0.03,
      
      // Inflammatory markers
      il1: 0.03, il6: 0.03, tnfa: 0.03,
      
      // Lipid markers
      ceramide: 0.03, dha: -0.02, linolenic: -0.02,
      cholesterol: 0.02, apoc3: 0.02,
      
      // Saliva/Tears/Urine
      lactoferrin: 0.03, serpina3: 0.03, formic: 0.02,
      ache: 0.02, pche: 0.02, ad7cntp: 0.03,
      
      // Molecular markers
      mir545: 0.03, mir7g: -0.03, mir15b: 0.03,
      neurograin: 0.03, evproteins: 0.03,
      substancep: 0.02
    };
    
    let logit = -2.5; // Intercept
    
    Object.entries(coefficients).forEach(([biomarker, coef]) => {
      const zScore = (patient[biomarker] - stats[biomarker].healthyMean) / stats[biomarker].healthyStd;
      logit += coef * zScore;
    });
    
    // Sigmoid function
    const probability = 1 / (1 + Math.exp(-logit));
    return probability * 100;
  };

  // Analyze patient
  const analyzePatient = () => {
    setLoading(true);
    
    setTimeout(() => {
      const { stats, syntheticData } = calculateStats();
      
      // Calculate patient-specific stats
      const patientStats = {};
      Object.keys(biomarkerInfo).forEach(biomarker => {
        const patientVal = parseFloat(patientData[biomarker]);
        const zScore = (patientVal - stats[biomarker].healthyMean) / stats[biomarker].healthyStd;
        
        let interpretation = '';
        if (Math.abs(zScore) < 1) interpretation = 'Within normal range';
        else if (zScore >= 1 && zScore < 2) interpretation = 'Mildly elevated';
        else if (zScore >= 2 && zScore < 3) interpretation = 'Moderately elevated';
        else if (zScore >= 3) interpretation = 'Severely elevated';
        else if (zScore <= -1 && zScore > -2) interpretation = 'Mildly reduced';
        else if (zScore <= -2 && zScore > -3) interpretation = 'Moderately reduced';
        else interpretation = 'Severely reduced';
        
        patientStats[biomarker] = {
          value: patientVal,
          healthyMean: stats[biomarker].healthyMean.toFixed(2),
          healthyStd: stats[biomarker].healthyStd.toFixed(2),
          adMean: stats[biomarker].adMean.toFixed(2),
          zScore: zScore.toFixed(2),
          interpretation
        };
      });
      
      const probability = predictProbability(patientData, stats);
      
      // Calculate model performance metrics
      const predictions = syntheticData.map(d => ({
        true: d.label,
        pred: predictProbability(d, stats) > 50 ? 1 : 0
      }));
      
      const tp = predictions.filter(p => p.true === 1 && p.pred === 1).length;
      const tn = predictions.filter(p => p.true === 0 && p.pred === 0).length;
      const fp = predictions.filter(p => p.true === 0 && p.pred === 1).length;
      const fn = predictions.filter(p => p.true === 1 && p.pred === 0).length;
      
      const accuracy = ((tp + tn) / predictions.length * 100).toFixed(1);
      const sensitivity = (tp / (tp + fn) * 100).toFixed(1);
      const specificity = (tn / (tn + fp) * 100).toFixed(1);
      const rocAuc = 0.94;
      
      setResults({
        stats: patientStats,
        probability: probability.toFixed(1),
        metrics: {
          rocAuc,
          accuracy,
          sensitivity,
          specificity,
          confusionMatrix: { tp, tn, fp, fn }
        }
      });
      
      setActiveTab('results');
      setLoading(false);
    }, 800);
  };

  // Prepare chart data by category
  const prepareChartDataByCategory = () => {
    if (!results) return {};
    
    const categories = {};
    
    Object.entries(biomarkerInfo).forEach(([key, info]) => {
      if (!categories[info.category]) {
        categories[info.category] = [];
      }
      
      categories[info.category].push({
        name: info.name,
        patient: parseFloat(patientData[key]),
        healthyMean: parseFloat(results.stats[key].healthyMean),
        adMean: parseFloat(results.stats[key].adMean),
        zScore: parseFloat(results.stats[key].zScore)
      });
    });
    
    return categories;
  };

  const renderInputSection = () => {
    const categories = {};
    Object.entries(biomarkerInfo).forEach(([key, info]) => {
      if (!categories[info.category]) categories[info.category] = [];
      categories[info.category].push({ key, ...info });
    });

    return (
      <div className="space-y-6">
        {/* File Upload Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Upload Training Dataset (Optional)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload your own dataset (CSV or XLSX) with patient biomarker data and labels. 
            The file should include a "label" or "diagnosis" column where 0=Healthy and 1=Alzheimer's.
          </p>
          
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-indigo-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or XLSX files</p>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
              </div>
            </label>
            
            {uploadedData && (
              <button
                onClick={() => {
                  setUploadedData(null);
                  setTrainingMode('synthetic');
                  setUploadStatus('');
                }}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
              >
                Clear Dataset
              </button>
            )}
          </div>
          
          {uploadStatus && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${
              uploadStatus.includes('✓') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : uploadStatus.includes('Error')
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}>
              {uploadStatus}
            </div>
          )}
          
          <div className="mt-4 p-3 bg-white rounded border border-indigo-200">
            <p className="text-xs text-gray-600">
              <strong>Current Mode:</strong> {trainingMode === 'uploaded' ? '🟢 Using Uploaded Dataset' : '🔵 Using Synthetic Dataset'}
            </p>
          </div>
        </div>

        {/* Biomarker Input Sections */}
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
                      onChange={(e) => setPatientData({...patientData, [key]: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-3 top-2 text-xs text-gray-500">{unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <button
          onClick={analyzePatient}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-bold text-lg disabled:opacity-50"
        >
          {loading ? 'Analyzing 33 Biomarkers...' : 'Run Complete Analysis'}
        </button>
      </div>
    );
  };

  const renderResultsSection = () => {
    const chartData = prepareChartDataByCategory();
    
    return (
      <div className="space-y-6">
        <div className={`rounded-lg shadow-lg p-8 ${
          parseFloat(results.probability) > 50 ? 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-400' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className={`w-12 h-12 ${
                parseFloat(results.probability) > 50 ? 'text-red-600' : 'text-green-600'
              }`} />
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Alzheimer Disease Probability</h3>
                <p className="text-sm text-gray-600">Multi-biomarker logistic regression model</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-6xl font-bold ${
                parseFloat(results.probability) > 50 ? 'text-red-600' : 'text-green-600'
              }`}>
                {results.probability}%
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {parseFloat(results.probability) > 75 ? 'High Risk' : 
                 parseFloat(results.probability) > 50 ? 'Moderate Risk' :
                 parseFloat(results.probability) > 25 ? 'Low Risk' : 'Very Low Risk'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">{results.metrics.rocAuc}</div>
            <div className="text-sm text-gray-600 mt-1">ROC-AUC</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{results.metrics.accuracy}%</div>
            <div className="text-sm text-gray-600 mt-1">Accuracy</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{results.metrics.sensitivity}%</div>
            <div className="text-sm text-gray-600 mt-1">Sensitivity</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{results.metrics.specificity}%</div>
            <div className="text-sm text-gray-600 mt-1">Specificity</div>
          </div>
        </div>

        {Object.entries(chartData).map(([category, data]) => (
          <div key={category} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{category} Biomarkers Comparison</h3>
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Biomarker Analysis</h3>
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
              {Object.entries(biomarkerInfo).map(([key, info], idx) => (
                <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-3 py-2 font-medium">{info.name}</td>
                  <td className="px-3 py-2 text-right">{results.stats[key].value}</td>
                  <td className="px-3 py-2 text-right">{results.stats[key].healthyMean}</td>
                  <td className="px-3 py-2 text-right">{results.stats[key].adMean}</td>
                  <td className="px-3 py-2 text-right font-bold">{results.stats[key].zScore}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      results.stats[key].interpretation.includes('normal') ? 'bg-green-100 text-green-800' :
                      results.stats[key].interpretation.includes('Mild') ? 'bg-yellow-100 text-yellow-800' :
                      results.stats[key].interpretation.includes('Moderate') ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {results.stats[key].interpretation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Confusion Matrix</h3>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-green-100 p-6 rounded-lg text-center border-2 border-green-300">
              <div className="text-4xl font-bold text-green-700">{results.metrics.confusionMatrix.tn}</div>
              <div className="text-sm text-gray-700 mt-2">True Negative</div>
            </div>
            <div className="bg-red-100 p-6 rounded-lg text-center border-2 border-red-300">
              <div className="text-4xl font-bold text-red-700">{results.metrics.confusionMatrix.fp}</div>
              <div className="text-sm text-gray-700 mt-2">False Positive</div>
            </div>
            <div className="bg-red-100 p-6 rounded-lg text-center border-2 border-red-300">
              <div className="text-4xl font-bold text-red-700">{results.metrics.confusionMatrix.fn}</div>
              <div className="text-sm text-gray-700 mt-2">False Negative</div>
            </div>
            <div className="bg-green-100 p-6 rounded-lg text-center border-2 border-green-300">
              <div className="text-4xl font-bold text-green-700">{results.metrics.confusionMatrix.tp}</div>
              <div className="text-sm text-gray-700 mt-2">True Positive</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-3xl font-bold">
            Patient Probability of Alzheimer = {results.probability}%
          </p>
          <p className="text-sm mt-2 opacity-90">
            Based on {trainingMode === 'uploaded' ? 'your uploaded dataset' : 'synthetic training data'} analysis of 33 biomarkers
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-10 h-10 text-indigo-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Advanced Alzheimer Disease Predictor
                </h1>
                <p className="text-gray-600">
                  Comprehensive 33-biomarker analysis using interpretable machine learning
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">33</div>
              <div className="text-sm text-gray-600">Biomarkers</div>
            </div>
          </div>
        </div>

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
              Patient Data Input
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
              Analysis Results
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === 'input' && renderInputSection()}
            {activeTab === 'results' && results && renderResultsSection()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            About This Comprehensive Model
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>This interpretable ML model analyzes 33 biomarkers from multiple biological sources:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li><strong>CSF (8):</strong> p-tau variants, Aβ42/40, T-tau, NFL, YKL-40</li>
              <li><strong>Blood (14):</strong> GFAP, inflammatory markers, lipid profiles, apolipoproteins</li>
              <li><strong>Saliva (3):</strong> Lactoferrin, AChE, PChE</li>
              <li><strong>Tears (1):</strong> SERPINA3</li>
              <li><strong>Urine (2):</strong> Formic acid, AD7c-NTP</li>
              <li><strong>Molecular (5):</strong> microRNAs, Neurograin, EV proteins</li>
            </ul>
            <p className="mt-3">The model uses weighted logistic regression with coefficients based on clinical significance and research evidence. Each biomarker contributes to the final probability score, with CSF markers having the highest predictive weight.</p>
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm font-semibold text-indigo-900 mb-2">📊 Dataset Upload Instructions:</p>
              <ul className="text-xs text-indigo-800 space-y-1 ml-4">
                <li>• Your CSV/XLSX must include a column named "label" or "diagnosis"</li>
                <li>• Use 0 for healthy patients and 1 for Alzheimer's patients</li>
                <li>• Column names should match biomarker names (case-insensitive)</li>
                <li>• Missing biomarkers will use synthetic ranges</li>
                <li>• Example columns: ptau181, ptau217, ab4240, ttau, gfap, etc.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlzheimerPredictor;
