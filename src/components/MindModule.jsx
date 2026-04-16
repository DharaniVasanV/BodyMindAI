import { useState } from 'react';
import { getMentalHealthInsight, getBrainHighlights } from '../utils/aiDiagnosis';
import { saveMindEntry } from '../utils/storage';
import './MindModule.css';

export default function MindModule() {
  const [mood, setMood] = useState(6);
  const [sleep, setSleep] = useState(6);
  const [stress, setStress] = useState(4);
  const [concentrate, setConcentrate] = useState('good');
  const [socialWithdrawal, setSocialWithdrawal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [insight, setInsight] = useState(null);
  const [highlights, setHighlights] = useState(null);

  const handleSubmit = () => {
    const result = getMentalHealthInsight(mood, sleep, stress, concentrate, socialWithdrawal);
    const brainH = getBrainHighlights(mood, sleep, stress, concentrate);
    setInsight(result);
    setHighlights(brainH);
    setSubmitted(true);
    saveMindEntry({ mood, sleep, stress, concentrate, socialWithdrawal, insights: result.insights });
  };

  const reset = () => {
    setSubmitted(false);
    setInsight(null);
    setHighlights(null);
    setMood(6); setSleep(6); setStress(4);
    setConcentrate('good'); setSocialWithdrawal(false);
  };

  const moodEmoji = ['😭','😢','😞','😟','😐','🙂','😊','😄','🤩','🌟','🌟'][mood];
  const sleepEmoji = ['😴','😪','🥱','😑','😶','🌙','💤','⭐','✨','🌟','🌟'][sleep];
  const stressEmoji = ['😌','🧘','😊','🙂','😐','😰','😩','😤','🔥','💥','💥'][stress];

  return (
    <div className="mind-module">
      {/* Brain Diagram */}
      <div className="glass-card brain-section">
        <h2 className="section-title">🧠 Brain Activity Map</h2>
        <p className="section-sub">
          {submitted ? 'Regions highlighted based on your current mental state' : 'Complete the assessment to see your brain activity'}
        </p>
        <div className="brain-diagram">
          <svg viewBox="0 0 300 220" className="brain-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="brainGrad" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#1a3f70" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#040d1a" stopOpacity="0.2"/>
              </radialGradient>
              <filter id="brainGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            
            {/* Brain outline */}
            <ellipse cx="150" cy="110" rx="120" ry="90" fill="url(#brainGrad)" stroke="#2a5490" strokeWidth="1.5"/>
            
            {/* Brain folds - static decorative */}
            <path d="M70 90 Q90 70 110 85 Q130 100 150 80 Q170 60 190 75 Q210 90 230 80" 
              fill="none" stroke="#1a3f70" strokeWidth="2" opacity="0.6"/>
            <path d="M60 120 Q85 105 110 115 Q135 125 160 110 Q185 95 210 108 Q235 121 245 115" 
              fill="none" stroke="#1a3f70" strokeWidth="2" opacity="0.6"/>
            <path d="M75 150 Q100 138 125 148 Q150 158 175 145 Q200 132 220 142" 
              fill="none" stroke="#1a3f70" strokeWidth="2" opacity="0.6"/>

            {/* Amygdala (stress/fear center) */}
            <ellipse cx="110" cy="145" rx="25" ry="18" 
              fill={highlights?.amygdala ? 'rgba(239,68,68,0.7)' : 'rgba(239,68,68,0.1)'}
              stroke={highlights?.amygdala ? '#ef4444' : '#374151'}
              strokeWidth={highlights?.amygdala ? 2 : 1}
              filter={highlights?.amygdala ? 'url(#brainGlow)' : undefined}
            >
              {highlights?.amygdala && (
                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
              )}
            </ellipse>
            <text x="110" y="149" textAnchor="middle" fill="white" fontSize="8" fontWeight="600">Amygdala</text>

            {/* Prefrontal Cortex (rational thinking) */}
            <ellipse cx="150" cy="65" rx="55" ry="28"
              fill={highlights?.prefrontalCortex ? 'rgba(148,163,184,0.3)' : 'rgba(34,211,238,0.2)'}
              stroke={highlights?.prefrontalCortex ? '#94a3b8' : '#22d3ee'}
              strokeWidth={highlights?.prefrontalCortex ? 1.5 : 2}
              opacity={highlights?.prefrontalCortex ? 0.4 : 0.8}
            />
            <text x="150" y="62" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="600">Prefrontal Cortex</text>
            <text x="150" y="73" textAnchor="middle" fill="white" fontSize="7" opacity="0.7">Rational Thinking</text>

            {/* Hippocampus (memory) */}
            <ellipse cx="200" cy="140" rx="28" ry="18"
              fill={highlights?.hippocampus ? 'rgba(250,204,21,0.4)' : 'rgba(74,222,128,0.15)'}
              stroke={highlights?.hippocampus ? '#facc15' : '#4ade80'}
              strokeWidth="1.5"
            >
              {highlights?.hippocampus && (
                <animate attributeName="stroke-dasharray" values="0 100;5 5;0 100" dur="2s" repeatCount="indefinite"/>
              )}
            </ellipse>
            <text x="200" y="144" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="600">Hippocampus</text>

            {/* Hypothalamus (stress hormones) */}
            <ellipse cx="150" cy="155" rx="22" ry="14"
              fill={highlights?.hypothalamus ? 'rgba(168,85,247,0.6)' : 'rgba(168,85,247,0.15)'}
              stroke={highlights?.hypothalamus ? '#a855f7' : '#6b21a8'}
              strokeWidth="1.5"
              filter={highlights?.hypothalamus ? 'url(#brainGlow)' : undefined}
            />
            <text x="150" y="159" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">Hypothalamus</text>

            {/* Labels */}
            {submitted && (
              <>
                {highlights?.amygdala && (
                  <text x="110" y="175" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">⚡ HIGH ACTIVITY</text>
                )}
                {highlights?.prefrontalCortex && (
                  <text x="150" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="700">● DIMMED</text>
                )}
              </>
            )}
          </svg>

          {/* Legend */}
          <div className="brain-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{background:'#22d3ee'}}/>
              <span>Prefrontal Cortex — Focus & Decision Making</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{background:'#ef4444'}}/>
              <span>Amygdala — Stress & Anxiety Response</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{background:'#4ade80'}}/>
              <span>Hippocampus — Memory & Learning</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{background:'#a855f7'}}/>
              <span>Hypothalamus — Stress Hormones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Form */}
      {!submitted ? (
        <div className="glass-card assessment-form">
          <h2 className="section-title">📊 Mental Health Assessment</h2>
          <p className="section-sub">How are you doing today?</p>

          {/* Mood */}
          <div className="mind-slider-group">
            <div className="mind-slider-header">
              <label>Mood Level</label>
              <div className="mind-score">
                <span className="score-emoji">{moodEmoji}</span>
                <span className="score-num" style={{color: mood < 4 ? '#ef4444' : mood < 7 ? '#facc15' : '#4ade80'}}>{mood}/10</span>
              </div>
            </div>
            <input type="range" min="1" max="10" value={mood} id="mood-slider"
              onChange={e => setMood(Number(e.target.value))}
              style={{'--val': `${(mood-1)/9*100}%`}}
            />
            <div className="slider-labels">
              <span>Very Low</span><span>Excellent</span>
            </div>
          </div>

          {/* Sleep */}
          <div className="mind-slider-group">
            <div className="mind-slider-header">
              <label>Sleep Quality</label>
              <div className="mind-score">
                <span className="score-emoji">{sleepEmoji}</span>
                <span className="score-num" style={{color: sleep < 4 ? '#ef4444' : sleep < 7 ? '#facc15' : '#4ade80'}}>{sleep}/10</span>
              </div>
            </div>
            <input type="range" min="1" max="10" value={sleep} id="sleep-slider"
              onChange={e => setSleep(Number(e.target.value))}
              style={{'--val': `${(sleep-1)/9*100}%`}}
            />
            <div className="slider-labels">
              <span>Very Poor</span><span>Excellent</span>
            </div>
          </div>

          {/* Stress */}
          <div className="mind-slider-group">
            <div className="mind-slider-header">
              <label>Stress Level</label>
              <div className="mind-score">
                <span className="score-emoji">{stressEmoji}</span>
                <span className="score-num" style={{color: stress > 7 ? '#ef4444' : stress > 4 ? '#facc15' : '#4ade80'}}>{stress}/10</span>
              </div>
            </div>
            <input type="range" min="1" max="10" value={stress} id="stress-slider"
              onChange={e => setStress(Number(e.target.value))}
              style={{'--val': `${(stress-1)/9*100}%`}}
            />
            <div className="slider-labels">
              <span>Relaxed</span><span>Overwhelmed</span>
            </div>
          </div>

          {/* Concentration */}
          <div className="mind-section">
            <label>Concentration Level</label>
            <div className="concentrate-buttons">
              {[
                {id:'good', label:'Good', icon:'🎯', color:'#4ade80'},
                {id:'average', label:'Average', icon:'🤔', color:'#facc15'},
                {id:'poor', label:'Poor', icon:'😵', color:'#ef4444'},
              ].map(opt => (
                <button
                  key={opt.id}
                  className={`concentrate-btn ${concentrate === opt.id ? 'active' : ''}`}
                  style={concentrate === opt.id ? {borderColor: opt.color, background: `${opt.color}15`, color: opt.color} : {}}
                  onClick={() => setConcentrate(opt.id)}
                  id={`concentrate-${opt.id}`}
                >
                  <span className="concentrate-icon">{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Social Withdrawal */}
          <div className="mind-section">
            <div className="withdrawal-row">
              <div>
                <label style={{marginBottom:0}}>Social Withdrawal</label>
                <p style={{fontSize:'12px',color:'var(--text-muted)',marginTop:'2px'}}>
                  Are you avoiding social interactions?
                </p>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <span style={{fontSize:'13px',color: socialWithdrawal ? '#ef4444' : '#4ade80', fontWeight: 600}}>
                  {socialWithdrawal ? 'Yes' : 'No'}
                </span>
                <label className="toggle-switch">
                  <input type="checkbox" checked={socialWithdrawal} id="social-withdrawal"
                    onChange={e => setSocialWithdrawal(e.target.checked)}
                  />
                  <span className="toggle-slider"/>
                </label>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={handleSubmit} style={{width:'100%'}} id="mind-submit-btn">
            🧠 Analyze My Mental State
          </button>
        </div>
      ) : (
        /* Results */
        <div className="mind-results fade-in">
          {/* Scores summary */}
          <div className="glass-card scores-grid">
            <h3 className="scores-title">Today's Mental Health Scores</h3>
            <div className="score-cards">
              {[
                {label:'Mood', value:mood, max:10, color: mood<4?'#ef4444':mood<7?'#facc15':'#4ade80'},
                {label:'Sleep', value:sleep, max:10, color: sleep<4?'#ef4444':sleep<7?'#facc15':'#4ade80'},
                {label:'Stress', value:stress, max:10, color: stress>7?'#ef4444':stress>4?'#facc15':'#4ade80', inverted:true},
                {label:'Focus', value:concentrate==='good'?9:concentrate==='average'?5:2, max:10, color: concentrate==='good'?'#4ade80':concentrate==='average'?'#facc15':'#ef4444'},
              ].map(sc => (
                <div key={sc.label} className="score-card">
                  <div className="score-label">{sc.label}</div>
                  <div className="score-ring-wrap">
                    <svg viewBox="0 0 60 60" width="60" height="60">
                      <circle cx="30" cy="30" r="24" fill="none" stroke="#0a1f3d" strokeWidth="6"/>
                      <circle cx="30" cy="30" r="24" fill="none" stroke={sc.color} strokeWidth="6"
                        strokeDasharray={`${(sc.value/sc.max)*150.8} 150.8`}
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                        style={{transition:'stroke-dasharray 1s ease'}}
                      />
                      <text x="30" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="800">
                        {sc.value}
                      </text>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          {insight?.insights.map((ins, i) => (
            <div key={i} className={`insight-card glass-card ${ins.flag}`}>
              <div className="insight-icon">{ins.icon}</div>
              <div className="insight-body">
                <h3 className="insight-title">{ins.title}</h3>
                <p className="insight-detail">{ins.detail}</p>
                {ins.helpline && (
                  <div className="helpline-box">
                    <p className="helpline-title">📞 Crisis Helplines</p>
                    <p className="helpline-num">🇮🇳 India: {ins.helpline.india}</p>
                    <p className="helpline-num">🌍 Global: {ins.helpline.global}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button className="btn-secondary" onClick={reset} style={{width:'100%'}} id="mind-retake-btn">
            🔄 Retake Assessment
          </button>
        </div>
      )}
    </div>
  );
}
