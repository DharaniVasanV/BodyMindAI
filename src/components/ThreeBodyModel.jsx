import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, PerspectiveCamera, Center, Stage } from '@react-three/drei';
import * as THREE from 'three';

// Map layers to file paths
const MODEL_PATHS = {
  skin: '/models/human/scene.gltf',
  muscle: '/models/myology/scene.gltf',
  organ: '/models/splanchnology/scene.gltf',
  skeletal: '/models/human_skeleton/scene.gltf',
};

// Component to render a specific layer with selection logic
function ModelLayer({ layer, onPartClick, activePart }) {
  const { scene } = useGLTF(MODEL_PATHS[layer]);
  const [hovered, setHovered] = useState(null);

  const getPartId = (meshName) => {
    const name = meshName.toLowerCase().replace(/_/g, ' ');
    if (name.includes('head') || name.includes('skull') || name.includes('brain') || name.includes('crane')) return 'head';
    if (name.includes('neck') || name.includes('cervical') || name.includes('throat')) return 'neck';
    if (name.includes('chest') || name.includes('thorax') || name.includes('ribs') || name.includes('sternum') || name.includes('lung') || name.includes('heart') || name.includes('pectoral')) return 'chest';
    if (name.includes('stomach') || name.includes('liver') || name.includes('gastric') || name.includes('digestive')) return 'stomach';
    if (name.includes('abdomen') || name.includes('intestine') || name.includes('colon') || name.includes('pelvis')) return 'lower-abdomen';
    if (name.includes('shoulder') || name.includes('scapula') || name.includes('clavicle')) {
      if (name.includes('left') || name.includes('_l')) return 'left-shoulder';
      if (name.includes('right') || name.includes('_r')) return 'right-shoulder';
      return 'left-shoulder';
    }
    if (name.includes('arm') || name.includes('humerus') || name.includes('bicep') || name.includes('hand') || name.includes('radius') || name.includes('ulna')) {
      if (name.includes('left') || name.includes('_l')) return 'left-arm';
      if (name.includes('right') || name.includes('_r')) return 'right-arm';
      return 'left-arm';
    }
    if (name.includes('leg') || name.includes('femur') || name.includes('calf') || name.includes('thigh') || name.includes('foot') || name.includes('tibia') || name.includes('fibula')) {
      if (name.includes('left') || name.includes('_l')) return 'left-leg';
      if (name.includes('right') || name.includes('_r')) return 'right-leg';
      return 'left-leg';
    }
    if (name.includes('back') || name.includes('spine') || name.includes('vertebra')) {
      if (name.includes('lumbar') || name.includes('sacrum') || name.includes('lower')) return 'lower-back';
      return 'back';
    }
    if (name.includes('torso') || name.includes('body') || name.includes('trunk')) return 'stomach';
    return null;
  };

  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        // Hide skeletal parts in organ layer specifically
        if (layer === 'organ') {
          const matName = object.material?.name?.toLowerCase() || '';
          const meshName = object.name.toLowerCase();
          if (matName.includes('bone') || matName.includes('skele') || meshName.includes('bone')) {
            object.visible = false;
          } else {
            object.visible = true;
          }
        } else {
          object.visible = true;
        }

        if (layer === 'skin' && !object.material.map) {
          object.material.color = new THREE.Color('#d2b48c');
        }
        
        const partId = getPartId(object.name);
        const isActive = activePart === partId;
        const isHovered = hovered === object.name;
        
        if (isActive) {
          object.material.emissive = new THREE.Color('#ff6b2b');
          object.material.emissiveIntensity = 0.5;
        } else if (isHovered) {
          object.material.emissive = new THREE.Color('#ffaa80');
          object.material.emissiveIntensity = 0.2;
        } else {
          object.material.emissive = new THREE.Color(0, 0, 0);
          object.material.emissiveIntensity = 0;
        }
      }
    });
  }, [scene, activePart, hovered, layer]);

  // Manual scale fine-tuning to normalize assets from different sources
  const getScale = () => {
    switch(layer) {
      case 'skin': return 0.015;    // Align with skeleton
      case 'skeletal': return 12.0; // Optimized scale for full-body centering
      case 'organ': return 1.15;    // Align with torso
      case 'muscle': return 1.15;   // Align with torso
      default: return 1.0;
    }
  };

  return (
    <Center>
      <primitive 
        object={scene} 
        scale={getScale()}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(e.object.name); }}
        onPointerOut={() => setHovered(null)}
        onClick={(e) => {
          e.stopPropagation();
          const partId = getPartId(e.object.name);
          if (partId) onPartClick({ id: partId, label: partId.replace(/-/g, ' ') });
        }}
      />
    </Center>
  );
}

const LoadingIndicator = () => (
  <Html center>
    <div className="loader-wrap">
      <div className="loader-ring"/>
      <div className="loader-icon">🩺</div>
      <p style={{color:'white', marginTop: '60px', whiteSpace: 'nowrap', fontSize: '11px', textAlign:'center'}}>
        Synchronizing Anatomical Assets...
      </p>
    </div>
  </Html>
);

export default function ThreeBodyModel({ activePart, onPartClick, layer, view, interactionEnabled = true }) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      if (view === 'back') controlsRef.current.setAzimuthalAngle(Math.PI);
      else controlsRef.current.setAzimuthalAngle(0);
    }
  }, [view]);

  return (
    <div className="three-body-model" style={{ width: '100%', height: '500px', cursor: 'grab', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.5, 5], fov: 42 }}>
        <Suspense fallback={<LoadingIndicator />}>
          <Stage 
            environment="city" 
            intensity={0.6} 
            contactShadow={true} 
            shadows={true} 
            adjustCamera={false}
          >
            <ModelLayer 
              layer={layer} 
              onPartClick={onPartClick} 
              activePart={activePart} 
            />
          </Stage>
        </Suspense>
        <OrbitControls 
          ref={controlsRef}
          enabled={interactionEnabled}
          enablePan={false}
          enableZoom={true} 
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          makeDefault
        />
      </Canvas>
      <div className="three-hint" style={{
        position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
        fontSize: '10px', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.3)',
        padding: '3px 10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', pointerEvents: 'none'
      }}>
        🖱️ Rotate/Zoom • Tap Part To Diagnose
      </div>
    </div>
  );
}
