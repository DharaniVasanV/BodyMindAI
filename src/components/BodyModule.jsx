import { useState, useRef } from 'react';
import ThreeBodyModel from './ThreeBodyModel';
import DrawingCanvas from './DrawingCanvas';
import DiagnosisPanel from './DiagnosisPanel';
import { getAIDiagnosis } from '../utils/aiDiagnosis';
import { saveSymptom } from '../utils/storage';
import './BodyModule.css';

const LAYERS = ['skin', 'muscle', 'organ', 'skeletal'];
const VIEWS = ['front', 'back'];
const LAYER_ICONS = { skin: '🧬', muscle: '💪', organ: '🫀', skeletal: '🦴' };

export default function BodyModule({ userProfile }) {
  const [activePart, setActivePart] = useState(null);
  const [view, setView] = useState('front');
  const [layer, setLayer] = useState('skin');
  const [showPanel, setShowPanel] = useState(false);
  const [painIntensity, setPainIntensity] = useState(5);
  const [duration, setDuration] = useState('today');
  const [diagnosis, setDiagnosis] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const handlePartClick = (part) => {
    setActivePart(part.id);
    setPainIntensity(5);
    setDuration('today');
    setDiagnosis(null);
    setShowPanel(true);
    setShowEmergency(false);
  };

  const runDiagnosis = () => {
    const results = getAIDiagnosis(activePart, painIntensity, duration, userProfile);
    setDiagnosis(results);

    // Emergency check: age > 50 + chest + pain > 7
    if (activePart === 'chest' && painIntensity > 7 && userProfile?.age > 50) {
      setShowEmergency(true);
    }

    // Save to history
    saveSymptom({
      bodyPart: activePart,
      painIntensity,
      duration,
      aiDiagnosis: results[0]?.cause || 'Unknown',
      view
    });
  };

  const closePanel = () => {
    setShowPanel(false);
    setActivePart(null);
    setDiagnosis(null);
    setShowEmergency(false);
  };

  return (
    <div className="body-module">
      {/* Controls bar */}
      <div className="controls-bar glass-card">
        {/* View Toggle */}
        <div className="control-group">
          <span className="control-label">Anatomical Perspective</span>
          <div className="toggle-buttons">
            {VIEWS.map(v => (
              <button 
                key={v} 
                className={`toggle-btn ${view === v ? 'active' : ''}`}
                onClick={() => setView(v)}
                id={`view-${v}`}
              >
                {v === 'front' ? '🫀 Front' : '🔙 Back'}
              </button>
            ))}
          </div>
        </div>

        {/* Layer Toggle */}
        <div className="control-group">
          <span className="control-label">System Selection</span>
          <div className="toggle-buttons">
            {LAYERS.map(l => (
              <button 
                key={l} 
                className={`toggle-btn ${layer === l ? 'active' : ''}`}
                onClick={() => setLayer(l)}
                id={`layer-${l}`}
              >
                {LAYER_ICONS[l]} {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* Drawing Toggle */}
        <div className="control-group">
          <span className="control-label">Medical Illustration</span>
          <button 
            className={`toggle-btn ${isDrawingMode ? 'draw-active' : ''}`}
            onClick={() => setIsDrawingMode(!isDrawingMode)}
            id="drawing-mode-toggle"
          >
            {isDrawingMode ? '✍️ Exit Illustration' : '🖌️ Add Notes'}
          </button>
        </div>
      </div>

      {/* Main body area */}
      <div className="body-area">
        {/* Instructions */}
        <div className="body-instructions">
          <p>👆 Interact with the 3D model to inspect and diagnose symptoms</p>
        </div>

        {/* 3D Body Container */}
        <div className="body-container three-container" style={{ position: 'relative' }}>
          <ThreeBodyModel 
            activePart={activePart}
            onPartClick={handlePartClick}
            layer={layer}
            view={view}
            interactionEnabled={!isDrawingMode}
          />
          <DrawingCanvas visible={isDrawingMode} />
        </div>


        {/* Part label */}
        {activePart && (
          <div className="active-part-label fade-in">
            <span className="badge badge-orange">
              ● {activePart.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </span>
          </div>
        )}

        {/* Body part quick selector */}
        <div className="quick-parts glass-card">
          <p className="quick-parts-title">Quick Select</p>
          <div className="quick-parts-grid">
            {(view === 'front' 
              ? ['head','neck','chest','left-shoulder','right-shoulder','left-arm','right-arm','stomach','lower-abdomen','left-leg','right-leg']
              : ['head','neck','back','lower-back','left-shoulder','right-shoulder','left-arm','right-arm','left-leg','right-leg']
            ).map(part => (
              <button 
                key={part}
                className={`quick-btn ${activePart === part ? 'active' : ''}`}
                onClick={() => handlePartClick({id: part})}
                id={`quick-${part}`}
              >
                {part.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Symptom Panel */}
      {showPanel && (
        <div className="modal-overlay" onClick={closePanel}>
          <div className="modal-content symptom-modal" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="panel-header">
              <div>
                <h2 className="panel-title">
                  🔍 {activePart?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Analysis
                </h2>
                <p className="panel-sub">Tell us more about your symptoms</p>
              </div>
              <button className="close-btn" onClick={closePanel} id="close-panel-btn">✕</button>
            </div>

            {/* Emergency Alert */}
            {showEmergency && (
              <div className="emergency-alert" style={{margin:'16px 24px 0'}}>
                <p style={{fontSize:'18px',fontWeight:'800',color:'#ef4444',marginBottom:'8px'}}>
                  🚨 SEEK EMERGENCY CARE IMMEDIATELY
                </p>
                <p style={{color:'#fca5a5',fontSize:'14px'}}>
                  Based on your age and chest pain intensity, this may be a cardiac emergency.
                  Call emergency services: <strong>911 / 112 / 108</strong> now.
                </p>
              </div>
            )}

            <div className="panel-body">
              {/* Pain Intensity */}
              <div className="panel-section">
                <label>Pain Intensity</label>
                <div className="slider-wrap">
                  <div className="pain-labels">
                    <span>None</span>
                    <span className="pain-score" style={{
                      color: painIntensity <= 3 ? '#4ade80' : painIntensity <= 6 ? '#facc15' : '#ef4444'
                    }}>{painIntensity}/10</span>
                    <span>Severe</span>
                  </div>
                  <input 
                    type="range" min="0" max="10" step="1"
                    value={painIntensity}
                    onChange={e => setPainIntensity(Number(e.target.value))}
                    style={{'--val': `${painIntensity * 10}%`}}
                    id="pain-slider"
                  />
                  <div className="pain-emojis">
                    {['😌','🙂','😐','😟','😣','😫','😡','🤕','😱','💀','💀'].map((em,i) => (
                      <span key={i} style={{opacity: painIntensity === i ? 1 : 0.3, fontSize: painIntensity === i ? '18px' : '12px', transition:'all 0.2s'}} role="img">{em}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="panel-section">
                <label>How long have you had this pain?</label>
                <div className="duration-buttons">
                  {[
                    {id:'today', label:'Today'},
                    {id:'2-3days', label:'2-3 Days'},
                    {id:'this-week', label:'This Week'},
                    {id:'more-week', label:'More Than a Week'},
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      className={`duration-btn ${duration === opt.id ? 'active' : ''}`}
                      onClick={() => setDuration(opt.id)}
                      id={`duration-${opt.id}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnose Button */}
              {!diagnosis && (
                <button className="btn-primary diagnose-btn" onClick={runDiagnosis} id="get-diagnosis-btn">
                  🤖 Get AI Diagnosis
                </button>
              )}

              {/* Diagnosis Results */}
              {diagnosis && (
                <DiagnosisPanel diagnosis={diagnosis} bodyPart={activePart} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
