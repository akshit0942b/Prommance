// src/components/VantaBackground.js
import React, { useState, useEffect, useRef } from 'react';
import FOG from 'vanta/dist/vanta.fog.min'; 
import * as THREE from 'three';

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        FOG({ // <-- Use FOG
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: 0xf5c6aa,
          midtoneColor: 0xe6a4b4,   
          lowlightColor: 0xa084e8,  
          baseColor: 0xfcf8f7,     
          blurFactor: 0.5,
          speed: 1.2,
          zoom: 0.8,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <div ref={vantaRef} className="vanta-background" />
      <div className="scrollable-content">
        {children}
      </div>
    </>
  );
};

export default VantaBackground;