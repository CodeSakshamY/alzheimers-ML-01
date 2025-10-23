import { biomarkerInfo } from '@/config/biomarkers';

export function generateSyntheticData(numSamples = 100) {
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
}
