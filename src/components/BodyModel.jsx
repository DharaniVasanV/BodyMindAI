import { useState } from 'react';
import './BodyModel.css';

const BODY_PARTS = [
  { id: 'head', label: 'Head', cx: 150, cy: 52, rx: 32, ry: 36, type: 'ellipse' },
  { id: 'neck', label: 'Neck', x: 137, y: 86, w: 26, h: 22, type: 'rect' },
  { id: 'chest', label: 'Chest', x: 108, y: 108, w: 84, h: 54, type: 'rect' },
  { id: 'stomach', label: 'Stomach', x: 112, y: 162, w: 76, h: 38, type: 'rect' },
  { id: 'lower-abdomen', label: 'Lower Abdomen', x: 116, y: 200, w: 68, h: 42, type: 'rect' },
  { id: 'left-shoulder', label: 'Left Shoulder', cx: 95, cy: 122, rx: 20, ry: 18, type: 'ellipse' },
  { id: 'right-shoulder', label: 'Right Shoulder', cx: 205, cy: 122, rx: 20, ry: 18, type: 'ellipse' },
  { id: 'left-arm', label: 'Left Arm', x: 68, y: 140, w: 28, h: 90, type: 'rect', rx: 12 },
  { id: 'right-arm', label: 'Right Arm', x: 204, y: 140, w: 28, h: 90, type: 'rect', rx: 12 },
  { id: 'left-leg', label: 'Left Leg', x: 113, y: 260, w: 36, h: 130, type: 'rect', rx: 10 },
  { id: 'right-leg', label: 'Right Leg', x: 151, y: 260, w: 36, h: 130, type: 'rect', rx: 10 },
];

const BACK_PARTS = [
  { id: 'head', label: 'Head', cx: 150, cy: 52, rx: 32, ry: 36, type: 'ellipse' },
  { id: 'neck', label: 'Neck', x: 137, y: 86, w: 26, h: 22, type: 'rect' },
  { id: 'back', label: 'Back', x: 108, y: 108, w: 84, h: 54, type: 'rect' },
  { id: 'lower-back', label: 'Lower Back', x: 112, y: 162, w: 76, h: 76, type: 'rect' },
  { id: 'left-shoulder', label: 'Left Shoulder', cx: 95, cy: 122, rx: 20, ry: 18, type: 'ellipse' },
  { id: 'right-shoulder', label: 'Right Shoulder', cx: 205, cy: 122, rx: 20, ry: 18, type: 'ellipse' },
  { id: 'left-arm', label: 'Left Arm', x: 68, y: 140, w: 28, h: 90, type: 'rect', rx: 12 },
  { id: 'right-arm', label: 'Right Arm', x: 204, y: 140, w: 28, h: 90, type: 'rect', rx: 12 },
  { id: 'left-leg', label: 'Left Leg', x: 113, y: 254, w: 36, h: 136, type: 'rect', rx: 10 },
  { id: 'right-leg', label: 'Right Leg', x: 151, y: 254, w: 36, h: 136, type: 'rect', rx: 10 },
];

const LAYER_COLORS = {
  skin: { fill: '#f4a574', stroke: '#e08050', highlight: 'rgba(255,107,43,0.6)' },
  muscle: { fill: '#c0392b', stroke: '#922b21', highlight: 'rgba(220,50,40,0.7)' },
  organ: { fill: '#8e44ad', stroke: '#6c3483', highlight: 'rgba(155,89,182,0.7)' },
  skeletal: { fill: '#bdc3c7', stroke: '#95a5a6', highlight: 'rgba(189,195,199,0.7)' },
};

function renderPart(part, isActive, layer, onClick, isDrawing, drawMode) {
  const colors = LAYER_COLORS[layer];
  const fill = isActive ? colors.highlight : `${colors.fill}33`;
  const stroke = isActive ? '#ff6b2b' : colors.stroke;
  const strokeWidth = isActive ? 2.5 : 1;

  const commonProps = {
    fill,
    stroke,
    strokeWidth,
    style: { cursor: drawMode ? 'crosshair' : 'pointer', transition: 'all 0.2s' },
    onClick: () => !drawMode && onClick(part),
    className: `body-part ${isActive ? 'active' : ''}`,
  };

  if (part.type === 'ellipse') {
    return (
      <g key={part.id}>
        <ellipse cx={part.cx} cy={part.cy} rx={part.rx} ry={part.ry} {...commonProps} />
        {isActive && (
          <ellipse cx={part.cx} cy={part.cy} rx={part.rx + 4} ry={part.ry + 4}
            fill="none" stroke="#ff6b2b" strokeWidth="2" strokeDasharray="4,3" opacity="0.7">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite"/>
          </ellipse>
        )}
      </g>
    );
  }
  return (
    <g key={part.id}>
      <rect x={part.x} y={part.y} width={part.w} height={part.h} rx={part.rx || 6} {...commonProps} />
      {isActive && (
        <rect x={part.x - 3} y={part.y - 3} width={part.w + 6} height={part.h + 6} rx={(part.rx || 6) + 3}
          fill="none" stroke="#ff6b2b" strokeWidth="2" strokeDasharray="4,3" opacity="0.7">
          <animate attributeName="stroke-dashoffset" values="0;-20" dur="1s" repeatCount="indefinite"/>
        </rect>
      )}
    </g>
  );
}

export default function BodyModel({ activePart, onPartClick, layer, view, drawMode, drawPaths }) {
  const parts = view === 'front' ? BODY_PARTS : BACK_PARTS;
  const colors = LAYER_COLORS[layer];

  return (
    <div className="body-model-wrap">
      <svg
        viewBox="0 0 300 420"
        className="body-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient for body */}
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={colors.fill} stopOpacity="0.2"/>
            <stop offset="100%" stopColor={colors.fill} stopOpacity="0.05"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Body silhouette */}
        <ellipse cx="150" cy="52" rx="32" ry="36" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
        <rect x="137" y="86" width="26" height="22" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
        
        {/* Torso */}
        {view === 'front' ? (
          <>
            <rect x="108" y="108" width="84" height="94" rx="12" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
            <rect x="116" y="200" width="68" height="42" rx="8" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
          </>
        ) : (
          <rect x="108" y="108" width="84" height="130" rx="12" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
        )}
        
        {/* Arms */}
        <rect x="68" y="108" width="40" height="130" rx="14" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
        <rect x="192" y="108" width="40" height="130" rx="14" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
        
        {/* Legs */}
        <rect x="110" y="242" width="40" height="148" rx="12" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>
        <rect x="150" y="242" width="40" height="148" rx="12" fill="url(#bodyGrad)" stroke={`${colors.stroke}44`} strokeWidth="1"/>

        {/* Clickable Regions */}
        {parts.map(part => renderPart(
          part,
          activePart === part.id,
          layer,
          onPartClick,
          drawMode,
          drawMode
        ))}

        {/* Part Labels on hover (via CSS) */}
        {parts.map(part => (
          <text
            key={`label-${part.id}`}
            x={part.cx || (part.x + part.w / 2)}
            y={(part.cy || (part.y + part.h / 2)) + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.9)"
            fontSize="7"
            fontFamily="Inter"
            fontWeight="600"
            pointerEvents="none"
            opacity={activePart === part.id ? 1 : 0.5}
          >
            {part.label}
          </text>
        ))}

        {/* Draw paths */}
        {drawPaths && drawPaths.map((path, i) => (
          <path key={i} d={path} fill="rgba(255,107,43,0.3)" stroke="#ff6b2b" strokeWidth="2" strokeLinejoin="round"/>
        ))}

        {/* Active highlight pulse */}
        {activePart && (() => {
          const part = parts.find(p => p.id === activePart);
          if (!part) return null;
          const cx = part.cx || (part.x + part.w / 2);
          const cy = part.cy || (part.y + part.h / 2);
          return (
            <circle cx={cx} cy={cy} r="8" fill="#ff6b2b" filter="url(#glow)">
              <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          );
        })()}
      </svg>
    </div>
  );
}
