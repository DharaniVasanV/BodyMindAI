import { useState } from 'react';
import { saveProfile } from '../utils/storage';
import './Onboarding.css';

const steps = [
  { id: 'basics', title: 'Basic Information', icon: '👤' },
  { id: 'health', title: 'Health Profile', icon: '🏥' },
  { id: 'history', title: 'Medical History', icon: '📋' },
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    bodyType: '',
    bloodGroup: '',
    allergies: '',
    preExistingConditions: '',
    currentMedications: '',
    familyHistory: '',
    menstrualTracking: false,
    lastPeriodDate: '',
    cycleLength: '28',
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const errs = {};
    if (step === 0) {
      if (!form.name.trim()) errs.name = 'Name is required';
      if (!form.age || form.age < 1 || form.age > 120) errs.age = 'Enter a valid age';
      if (!form.gender) errs.gender = 'Please select gender';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < steps.length - 1) setStep(s => s + 1);
    else finish();
  };

  const finish = () => {
    const profile = { ...form, createdAt: new Date().toISOString() };
    saveProfile(profile);
    onComplete(profile);
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-container fade-in">
        {/* Header */}
        <div className="onboarding-header">
          <div className="logo-wrap">
            <div className="logo-icon">
              <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
                <circle cx="24" cy="24" r="22" fill="rgba(255,107,43,0.15)" stroke="#ff6b2b" strokeWidth="2"/>
                <path d="M24 12 C24 12 16 16 16 24 C16 30 24 36 24 36 C24 36 32 30 32 24 C32 16 24 12 24 12Z" fill="rgba(255,107,43,0.3)" stroke="#ff6b2b" strokeWidth="1.5"/>
                <circle cx="24" cy="22" r="4" fill="#ff6b2b"/>
                <path d="M20 28 L28 28" stroke="#ff6b2b" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="brand-name">BodyMind <span>AI</span></h1>
              <p className="brand-sub">Your Personal Health Intelligence</p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="step-progress">
          {steps.map((s, i) => (
            <div key={s.id} className={`step-dot-wrap ${i <= step ? 'active' : ''}`}>
              <div className={`step-dot ${i < step ? 'done' : i === step ? 'current' : ''}`}>
                {i < step ? '✓' : s.icon}
              </div>
              <span className="step-label">{s.title}</span>
              {i < steps.length - 1 && <div className={`step-line ${i < step ? 'active' : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="step-content">
          {step === 0 && (
            <div className="form-grid fade-in">
              <h2 className="step-title">Tell us about yourself</h2>
              <p className="step-desc">This helps us personalize your health analysis</p>
              
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={form.name} 
                  onChange={e => update('name', e.target.value)}
                  id="onboard-name"
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input 
                    type="number" 
                    placeholder="Your age" 
                    value={form.age} 
                    onChange={e => update('age', e.target.value)}
                    id="onboard-age"
                    min="1" max="120"
                  />
                  {errors.age && <span className="error-msg">{errors.age}</span>}
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)} id="onboard-blood">
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <div className="gender-buttons">
                  {['Male', 'Female', 'Other'].map(g => (
                    <button 
                      key={g} 
                      type="button"
                      className={`gender-btn ${form.gender === g ? 'selected' : ''}`}
                      onClick={() => update('gender', g)}
                      id={`gender-${g.toLowerCase()}`}
                    >
                      {g === 'Male' ? '♂' : g === 'Female' ? '♀' : '⚧'} {g}
                    </button>
                  ))}
                </div>
                {errors.gender && <span className="error-msg">{errors.gender}</span>}
              </div>

              <div className="form-group">
                <label>Body Type</label>
                <div className="body-type-buttons">
                  {['Slim', 'Athletic', 'Average', 'Heavy'].map(t => (
                    <button 
                      key={t} 
                      type="button"
                      className={`type-btn ${form.bodyType === t ? 'selected' : ''}`}
                      onClick={() => update('bodyType', t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-grid fade-in">
              <h2 className="step-title">Health Profile</h2>
              <p className="step-desc">Help us understand your current health status</p>

              <div className="form-group">
                <label>Known Allergies</label>
                <textarea 
                  placeholder="e.g. Penicillin, Peanuts, Latex, None" 
                  value={form.allergies} 
                  onChange={e => update('allergies', e.target.value)}
                  rows={3}
                  id="onboard-allergies"
                />
              </div>

              <div className="form-group">
                <label>Pre-existing Medical Conditions</label>
                <textarea 
                  placeholder="e.g. Diabetes Type 2, Hypertension, Asthma, None" 
                  value={form.preExistingConditions} 
                  onChange={e => update('preExistingConditions', e.target.value)}
                  rows={3}
                  id="onboard-conditions"
                />
              </div>

              <div className="form-group">
                <label>Current Medications</label>
                <textarea 
                  placeholder="e.g. Metformin 500mg, Lisinopril 10mg, None" 
                  value={form.currentMedications} 
                  onChange={e => update('currentMedications', e.target.value)}
                  rows={3}
                  id="onboard-medications"
                />
              </div>

              {form.gender === 'Female' && (
                <div className="form-group menstrual-section">
                  <div className="menstrual-header">
                    <div>
                      <label style={{marginBottom: 0}}>Menstrual Cycle Tracking</label>
                      <p style={{fontSize:'12px',color:'var(--text-muted)'}}>Optional: Enable for cycle-aware health insights</p>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={form.menstrualTracking} 
                        onChange={e => update('menstrualTracking', e.target.checked)}
                        id="onboard-menstrual"
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  {form.menstrualTracking && (
                    <div className="form-row" style={{marginTop:'12px'}}>
                      <div className="form-group">
                        <label>Last Period Date</label>
                        <input type="date" value={form.lastPeriodDate} onChange={e => update('lastPeriodDate', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Cycle Length (days)</label>
                        <select value={form.cycleLength} onChange={e => update('cycleLength', e.target.value)}>
                          {[21,22,23,24,25,26,27,28,29,30,31,32,33,34,35].map(d=>(
                            <option key={d} value={d}>{d} days</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="form-grid fade-in">
              <h2 className="step-title">Family Medical History</h2>
              <p className="step-desc">Hereditary conditions help us flag risks early</p>

              <div className="form-group">
                <label>Family Medical History</label>
                <textarea 
                  placeholder="e.g. Father: Heart disease. Mother: Diabetes. Grandmother: Breast cancer. None known." 
                  value={form.familyHistory} 
                  onChange={e => update('familyHistory', e.target.value)}
                  rows={5}
                  id="onboard-family"
                />
              </div>

              <div className="privacy-note glass-card">
                <div className="privacy-icon">🔒</div>
                <div>
                  <p className="privacy-title">Your Data is Private</p>
                  <p className="privacy-desc">All health data is stored locally on your device only. Nothing is sent to external servers.</p>
                </div>
              </div>

              <div className="profile-summary">
                <h3>Profile Summary</h3>
                <div className="summary-items">
                  <div className="summary-item"><span>Name</span><strong>{form.name || '—'}</strong></div>
                  <div className="summary-item"><span>Age</span><strong>{form.age || '—'}</strong></div>
                  <div className="summary-item"><span>Gender</span><strong>{form.gender || '—'}</strong></div>
                  <div className="summary-item"><span>Blood Group</span><strong>{form.bloodGroup || '—'}</strong></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="onboarding-nav">
          {step > 0 && (
            <button className="btn-secondary" onClick={() => setStep(s => s-1)}>← Back</button>
          )}
          <button className="btn-primary" onClick={next} id="onboard-next-btn">
            {step === steps.length - 1 ? '🚀 Get Started' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
}
