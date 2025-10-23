export const biomarkerInfo = {
  ptau181: { name: 'p-tau 181', unit: 'pg/mL', category: 'CSF', healthyRange: [15, 25], adRange: [60, 120] },
  ptau231: { name: 'p-tau 231', unit: 'pg/mL', category: 'CSF', healthyRange: [8, 15], adRange: [40, 80] },
  ptau217: { name: 'p-tau 217', unit: 'pg/mL', category: 'CSF', healthyRange: [0.4, 0.8], adRange: [2.0, 4.0] },
  ab4240: { name: 'Aβ42/40 ratio', unit: 'ratio', category: 'CSF', healthyRange: [0.08, 0.12], adRange: [0.03, 0.05] },
  ttau: { name: 'T-tau', unit: 'pg/mL', category: 'CSF', healthyRange: [200, 350], adRange: [500, 800] },
  ab42: { name: 'Aβ42', unit: 'pg/mL', category: 'CSF', healthyRange: [700, 1000], adRange: [300, 500] },
  nfl: { name: 'NFL', unit: 'pg/mL', category: 'CSF', healthyRange: [300, 600], adRange: [1000, 2000] },
  ykl40: { name: 'YKL-40', unit: 'ng/mL', category: 'CSF', healthyRange: [100, 150], adRange: [200, 350] },
  
  lactoferrin: { name: 'Lactoferrin', unit: 'μg/mL', category: 'Saliva', healthyRange: [10, 20], adRange: [30, 45] },
  ache: { name: 'AChE', unit: 'U/mL', category: 'Saliva', healthyRange: [0.5, 1.5], adRange: [2.5, 4.5] },
  pche: { name: 'PChE', unit: 'U/mL', category: 'Saliva', healthyRange: [1.0, 2.5], adRange: [4.0, 7.0] },
  
  serpina3: { name: 'SERPINA3', unit: 'ng/mL', category: 'Tears', healthyRange: [2.0, 3.5], adRange: [5.0, 7.5] },
  
  formic: { name: 'Formic acid', unit: 'μmol/L', category: 'Urine', healthyRange: [3, 8], adRange: [10, 16] },
  ad7cntp: { name: 'AD7c-NTP', unit: 'U/mL', category: 'Urine', healthyRange: [0.5, 1.5], adRange: [3.0, 6.0] },
  
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
  
  mir545: { name: 'miR-545-3p', unit: 'fold change', category: 'Molecular', healthyRange: [0.8, 1.2], adRange: [2.0, 4.0] },
  mir7g: { name: 'miR-7g-5p', unit: 'fold change', category: 'Molecular', healthyRange: [0.8, 1.2], adRange: [0.3, 0.6] },
  mir15b: { name: 'miR-15b-5p', unit: 'fold change', category: 'Molecular', healthyRange: [0.8, 1.2], adRange: [2.5, 4.5] },
  neurograin: { name: 'Neurograin', unit: 'ng/mL', category: 'Molecular', healthyRange: [5, 12], adRange: [20, 35] },
  evproteins: { name: 'EV proteins', unit: 'AU', category: 'Molecular', healthyRange: [100, 200], adRange: [350, 550] },
};

export const modelCoefficients = {
  ptau217: 0.08, ptau181: 0.07, ptau231: 0.06,
  ab4240: -0.09, ab42: -0.07, ttau: 0.06, nfl: 0.05, ykl40: 0.04,
  gfap: 0.05, uchl1: 0.04, strem2: 0.04, apod: 0.03, asynuclein: 0.03,
  il1: 0.03, il6: 0.03, tnfa: 0.03,
  ceramide: 0.03, dha: -0.02, linolenic: -0.02, cholesterol: 0.02, apoc3: 0.02,
  lactoferrin: 0.03, serpina3: 0.03, formic: 0.02,
  ache: 0.02, pche: 0.02, ad7cntp: 0.03,
  mir545: 0.03, mir7g: -0.03, mir15b: 0.03,
  neurograin: 0.03, evproteins: 0.03, substancep: 0.02
};
