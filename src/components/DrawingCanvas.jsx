import React, { useRef, useState, useEffect } from 'react';

export default function DrawingCanvas({ visible }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('pen'); // 'pen' or 'eraser'
  const [brushSize, setBrushSize] = useState(3);
  const [color, setColor] = useState('#ff6b2b');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to parent container
    const resizeCanvas = () => {
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width * 2; // High DPI
      canvas.height = height * 2;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(2, 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      contextRef.current = ctx;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    contextRef.current.strokeStyle = mode === 'pen' ? color : 'rgba(0,0,0,1)';
    contextRef.current.globalCompositeOperation = mode === 'pen' ? 'source-over' : 'destination-out';
    contextRef.current.lineWidth = brushSize;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className={`drawing-canvas-container ${visible ? 'visible' : 'hidden'}`} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 10
    }}>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onMouseLeave={finishDrawing}
        ref={canvasRef}
        style={{ cursor: mode === 'pen' ? 'crosshair' : 'eraser' }}
      />
      
      {visible && (
        <div className="drawing-toolbar glass-card" style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px'
        }}>
          <button 
            className={`tool-btn ${mode === 'pen' ? 'active' : ''}`}
            onClick={() => setMode('pen')}
            title="Pen"
          >
            ✏️
          </button>
          <button 
            className={`tool-btn ${mode === 'eraser' ? 'active' : ''}`}
            onClick={() => setMode('eraser')}
            title="Eraser"
          >
            🧽
          </button>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)}
            style={{ width: '30px', height: '30px', border: 'none', background: 'none' }}
          />
          <button 
            className="tool-btn" 
            onClick={clearCanvas}
            title="Clear"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}
