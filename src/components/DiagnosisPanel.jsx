import './DiagnosisPanel.css';

const confidenceColor = (conf) => {
  if (conf >= 70) return '#4ade80';
  if (conf >= 50) return '#facc15';
  return '#f87171';
};

export default function DiagnosisPanel({ diagnosis, bodyPart }) {
  return (
    <div className="diagnosis-panel fade-in">
      <div className="diagnosis-header">
        <div className="ai-badge">
          <span>🤖</span>
          <span>AI Analysis Results</span>
        </div>
        <span className="disclaimer">*Informational only — not a medical prescription</span>
      </div>

      <div className="causes-list">
        {diagnosis.map((item, idx) => (
          <div key={idx} className={`cause-card ${idx === 0 ? 'primary' : ''}`}>
            <div className="cause-rank">#{idx + 1}</div>
            <div className="cause-content">
              {/* Cause title & confidence */}
              <div className="cause-top">
                <h3 className="cause-title">{item.cause}</h3>
                <div className="confidence-wrap">
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${item.confidence}%`, background: confidenceColor(item.confidence) }}
                    />
                  </div>
                  <span className="confidence-text" style={{ color: confidenceColor(item.confidence) }}>
                    {item.confidence}%
                  </span>
                </div>
              </div>

              {/* Affected organs */}
              <div className="info-row">
                <span className="info-label">🫁 Affected:</span>
                <div className="tags">
                  {item.organs.map((o, i) => (
                    <span key={i} className="tag">{o}</span>
                  ))}
                </div>
              </div>

              {/* Spread */}
              <div className="info-row">
                <span className="info-label">📡 Spread:</span>
                <p className="info-text">{item.spread}</p>
              </div>

              {/* Medications */}
              <div className="info-row">
                <span className="info-label">💊 Medications:</span>
                <div className="tags">
                  {item.medications.map((m, i) => (
                    <span key={i} className="tag tag-med">{m}</span>
                  ))}
                </div>
              </div>

              {/* Recovery */}
              <div className="info-row">
                <span className="info-label">🔄 Recovery Steps:</span>
                <ul className="recovery-list">
                  {item.recovery.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="disclaimer-box">
        ⚕️ This AI analysis is based on general patterns and your health profile. Always consult a qualified healthcare professional for medical advice.
      </div>
    </div>
  );
}
