import { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import BodyModule from './components/BodyModule';
import MindModule from './components/MindModule';
import SymptomHistory from './components/SymptomHistory';
import WitnessMode from './components/WitnessMode';
import DoctorReport from './components/DoctorReport';
import { loadProfile } from './utils/storage';
import './App.css';

const TABS = [
  { id: 'body', label: 'Body', icon: '🦴' },
  { id: 'mind', label: 'Mind', icon: '🧠' },
  { id: 'history', label: 'History', icon: '📅' },
];

export default function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('body');
  const [showWitness, setShowWitness] = useState(false);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile(saved);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-wrap">
          <div className="loader-ring"/>
          <div className="loader-icon">🩺</div>
        </div>
        <p style={{color:'var(--text-muted)',marginTop:'20px',fontSize:'14px'}}>Loading BodyMind AI...</p>
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={(p) => setProfile(p)} />;
  }

  const resetProfile = () => {
    localStorage.clear();
    setProfile(null);
    window.location.reload();
  };

  return (
    <div className="app">
      {/* ───── Header ───── */}
      <header className="app-header">
        <div className="header-left">
          <div className="header-logo">
            <svg viewBox="0 0 36 36" fill="none" width="32" height="32">
              <circle cx="18" cy="18" r="16" fill="rgba(255,107,43,0.15)" stroke="#ff6b2b" strokeWidth="1.5"/>
              <path d="M18 8 C18 8 12 12 12 18 C12 23 18 28 18 28 C18 28 24 23 24 18 C24 12 18 8 18 8Z"
                fill="rgba(255,107,43,0.3)" stroke="#ff6b2b" strokeWidth="1.2"/>
              <circle cx="18" cy="17" r="3" fill="#ff6b2b"/>
            </svg>
            <div className="header-brand">
              <span className="brand-main">BodyMind</span>
              <span className="brand-ai"> AI</span>
            </div>
          </div>
        </div>

        <div className="header-center">
          <div className="header-profile">
            <div className="profile-avatar">
              {profile.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="profile-info">
              <span className="profile-name">{profile.name}</span>
              <span className="profile-meta">
                {profile.age && `Age ${profile.age}`}
                {profile.gender && ` · ${profile.gender}`}
                {profile.bloodGroup && ` · ${profile.bloodGroup}`}
              </span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="header-btn report-btn" onClick={() => setShowReport(true)} id="export-report-btn">
            <span>📋</span>
            <span>Export Report</span>
          </button>
          <button
            className="header-btn settings-btn"
            onClick={() => {
              if (window.confirm('Reset profile and start over? All data will be cleared.')) {
                resetProfile();
              }
            }}
            id="reset-profile-btn"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* ───── Witness Mode Button ───── */}
      <div className="witness-banner">
        <div className="witness-banner-text">
          <span className="witness-pulse-dot"/>
          Emergency responder mode for bystanders
        </div>
        <button
          className="witness-trigger-btn"
          onClick={() => setShowWitness(true)}
          id="witness-mode-btn"
        >
          🆘 WITNESS MODE
        </button>
      </div>

      {/* ───── Tab Navigation ───── */}
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            id={`tab-${tab.id}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {activeTab === tab.id && <div className="tab-indicator"/>}
          </button>
        ))}
      </nav>

      {/* ───── Tab Content ───── */}
      <main className="app-main">
        {activeTab === 'body' && (
          <div className="tab-content fade-in">
            <BodyModule userProfile={profile} />
          </div>
        )}
        {activeTab === 'mind' && (
          <div className="tab-content fade-in">
            <MindModule />
          </div>
        )}
        {activeTab === 'history' && (
          <div className="tab-content fade-in">
            <SymptomHistory />
          </div>
        )}
      </main>

      {/* ───── Overlays ───── */}
      {showWitness && <WitnessMode onClose={() => setShowWitness(false)} />}
      {showReport && <DoctorReport onClose={() => setShowReport(false)} />}

      {/* ───── Footer ───── */}
      <footer className="app-footer">
        <p>⚕️ BodyMind AI is for informational purposes only. Not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
