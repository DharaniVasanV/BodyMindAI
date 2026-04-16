// localStorage helpers
const PROFILE_KEY = 'bodymind_profile';
const SYMPTOMS_KEY = 'bodymind_symptoms';
const MIND_KEY = 'bodymind_mind_entries';

export const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const loadProfile = () => {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveSymptom = (entry) => {
  try {
    const existing = loadSymptoms();
    existing.unshift({ ...entry, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem(SYMPTOMS_KEY, JSON.stringify(existing.slice(0, 200)));
  } catch(e) { console.error(e); }
};

export const loadSymptoms = () => {
  try {
    const data = localStorage.getItem(SYMPTOMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

export const saveMindEntry = (entry) => {
  try {
    const existing = loadMindEntries();
    existing.unshift({ ...entry, id: Date.now(), date: new Date().toISOString() });
    localStorage.setItem(MIND_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch(e) { console.error(e); }
};

export const loadMindEntries = () => {
  try {
    const data = localStorage.getItem(MIND_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};

export const getWeeklySummary = () => {
  const symptoms = loadSymptoms();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weekSymptoms = symptoms.filter(s => new Date(s.date) >= oneWeekAgo);
  
  if (weekSymptoms.length === 0) return null;
  
  // Most frequent body part
  const partCounts = {};
  weekSymptoms.forEach(s => {
    partCounts[s.bodyPart] = (partCounts[s.bodyPart] || 0) + 1;
  });
  const mostFrequent = Object.entries(partCounts).sort((a, b) => b[1] - a[1])[0];
  
  // Average pain
  const avgPain = (weekSymptoms.reduce((acc, s) => acc + (s.painIntensity || 0), 0) / weekSymptoms.length).toFixed(1);
  
  return {
    totalEntries: weekSymptoms.length,
    mostFrequentPart: mostFrequent ? mostFrequent[0] : 'N/A',
    mostFrequentCount: mostFrequent ? mostFrequent[1] : 0,
    avgPain,
    trend: avgPain > 6 ? 'worsening' : avgPain > 3 ? 'moderate' : 'improving'
  };
};
