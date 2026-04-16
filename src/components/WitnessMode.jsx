import { useState, useEffect } from 'react';
import { generateEmergencyBrief, getFirstAidInstructions } from '../utils/aiDiagnosis';
import './WitnessMode.css';

const QUESTIONS = [
  { id: 'conscious', label: 'Is the person conscious?', icon: '👁️', desc: 'Responsive to touch or voice' },
  { id: 'breathing', label: 'Are they breathing?', icon: '💨', desc: 'Chest rising and falling' },
  { id: 'seizure', label: 'Are they shaking / having a seizure?', icon: '⚡', desc: 'Uncontrolled body movements' },
  { id: 'chestPain', label: 'Are they clutching their chest?', icon: '❤️', desc: 'Possible cardiac event' },
  { id: 'bleeding', label: 'Are they bleeding visibly?', icon: '🩸', desc: 'External blood loss visible' },
];

export default function WitnessMode({ onClose }) {
  const [step, setStep] = useState('questions'); // 'questions' | 'results'
  const [answers, setAnswers] = useState({
    conscious: true, breathing: true, seizure: false, chestPain: false, bleeding: false
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [gpsLocation, setGpsLocation] = useState('Locating...');
  const [brief, setBrief] = useState(null);
  const [firstAid, setFirstAid] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setGpsLocation(`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`),
        () => setGpsLocation('Location unavailable — share your address manually')
      );
    } else {
      setGpsLocation('GPS not supported on this browser');
    }
  }, []);

  const handleAnswer = (value) => {
    const qId = QUESTIONS[currentQ].id;
    const newAnswers = { ...answers, [qId]: value };
    setAnswers(newAnswers);
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      // Generate results
      const result = generateEmergencyBrief(newAnswers, gpsLocation);
      const aid = getFirstAidInstructions(newAnswers);
      setBrief(result);
      setFirstAid(aid);
      setStep('results');
    }
  };

  const copyBrief = () => {
    navigator.clipboard.writeText(brief.briefText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const reset = () => {
    setStep('questions');
    setCurrentQ(0);
    setAnswers({ conscious: true, breathing: true, seizure: false, chestPain: false, bleeding: false });
    setBrief(null);
    setFirstAid([]);
  };

  const urgencyColor = brief?.urgency === 'critical' ? '#ef4444' : brief?.urgency === 'high' ? '#f97316' : '#facc15';

  return (
    <div className="witness-overlay">
      <div className="witness-container fade-in">
        {/* Header */}
        <div className="witness-header">
          <div className="witness-title-row">
            <div className="witness-icon">🆘</div>
            <div>
              <h1 className="witness-title">WITNESS MODE</h1>
              <p className="witness-sub">Emergency First Responder Guide</p>
            </div>
            <button className="close-btn" onClick={onClose} id="witness-close-btn">✕</button>
          </div>

          {/* GPS */}
          <div className="gps-bar">
            <span className="gps-icon">📍</span>
            <span className="gps-text">{gpsLocation}</span>
          </div>
        </div>

        {/* Questions Step */}
        {step === 'questions' && (
          <div className="questions-section">
            {/* Progress */}
            <div className="q-progress">
              <div className="q-progress-bar" style={{ width: `${(currentQ / QUESTIONS.length) * 100}%` }}/>
            </div>
            <p className="q-count">Question {currentQ + 1} of {QUESTIONS.length}</p>

            {/* Current Question */}
            <div className="question-card fade-in" key={currentQ}>
              <div className="q-icon">{QUESTIONS[currentQ].icon}</div>
              <h2 className="q-text">{QUESTIONS[currentQ].label}</h2>
              <p className="q-desc">{QUESTIONS[currentQ].desc}</p>

              <div className="answer-buttons">
                <button
                  id="witness-yes-btn"
                  className="answer-btn yes"
                  onClick={() => handleAnswer(true)}
                >
                  ✅ YES
                </button>
                <button
                  id="witness-no-btn"
                  className="answer-btn no"
                  onClick={() => handleAnswer(false)}
                >
                  ❌ NO
                </button>
              </div>
            </div>

            {/* Previous answers */}
            {currentQ > 0 && (
              <div className="prev-answers">
                {QUESTIONS.slice(0, currentQ).map((q, i) => (
                  <div key={q.id} className="prev-answer-item">
                    <span>{q.icon} {q.label}</span>
                    <span className={answers[q.id] ? 'ans-yes' : 'ans-no'}>
                      {answers[q.id] ? 'YES' : 'NO'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && brief && (
          <div className="results-section">
            {/* Urgency Banner */}
            <div className="urgency-banner" style={{ borderColor: urgencyColor, background: `${urgencyColor}15` }}>
              <span className="urgency-label" style={{ color: urgencyColor }}>
                {brief.urgency === 'critical' ? '🚨 CRITICAL — CALL EMERGENCY NOW' :
                 brief.urgency === 'high' ? '⚠️ HIGH URGENCY — ACT IMMEDIATELY' :
                 '⚡ MODERATE — MONITOR CLOSELY'}
              </span>
              <div className="emergency-numbers">
                <span>📞 Emergency: <strong>911 / 112 / 108</strong></span>
              </div>
            </div>

            {/* Answers Summary */}
            <div className="answers-summary glass-card">
              <h3 className="summary-heading">Patient Status Summary</h3>
              <div className="answers-grid">
                {QUESTIONS.map(q => (
                  <div key={q.id} className="answer-summary-item">
                    <span>{q.icon}</span>
                    <span className="ans-label">{q.label}</span>
                    <span className={`ans-value ${answers[q.id] ? 'yes' : 'no'}`}>
                      {answers[q.id] ? 'YES' : 'NO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Brief */}
            <div className="emergency-brief glass-card">
              <div className="brief-header">
                <h3 className="brief-title">📋 Emergency Brief</h3>
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={copyBrief}
                  id="copy-brief-btn"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
              <pre className="brief-text">{brief.briefText}</pre>
            </div>

            {/* First Aid Instructions */}
            <div className="first-aid-section">
              <h3 className="first-aid-title">🏥 First Aid Instructions</h3>
              {firstAid.map((item, i) => (
                <div key={i} className={`first-aid-card glass-card severity-${item.severity}`}>
                  <div className="aid-card-header">
                    <h4 className="aid-title">{item.title}</h4>
                    <span className={`severity-badge ${item.severity}`}>
                      {item.severity === 'critical' ? '🚨 Critical' :
                       item.severity === 'high' ? '⚠️ Urgent' : '📌 Monitor'}
                    </span>
                  </div>
                  <ol className="aid-steps">
                    {item.steps.map((step, j) => (
                      <li key={j}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            {/* QR Scanner placeholder */}
            <div className="glass-card qr-section">
              <div className="qr-content">
                <div className="qr-icon">📷</div>
                <div>
                  <h4 className="qr-title">Scan Patient QR Code</h4>
                  <p className="qr-sub">Load patient's health profile from their BodyMind AI QR</p>
                </div>
                <button className="btn-secondary" id="qr-scan-btn"
                  onClick={() => alert('QR Scanner: In a native app, this would open the device camera. Save your profile QR from the Export Report section.')}>
                  📷 Open Scanner
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="results-actions">
              <button className="btn-secondary" onClick={reset} id="witness-restart-btn">
                🔄 Restart Assessment
              </button>
              <button className="btn-danger" onClick={copyBrief} id="witness-share-btn">
                📤 Share Emergency Brief
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
