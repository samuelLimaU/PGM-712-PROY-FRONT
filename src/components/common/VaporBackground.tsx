import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 2000 }) {
  const mesh = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();

  // Guardamos datos individuales de cada partícula para su comportamiento
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        speed: 0.005 + Math.random() * 0.01,
        amplitude: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        xOffset: (Math.random() - 0.5) * 1.2, // Dispersión inicial en X
      });
    }
    return data;
  }, [count]);

  // Posiciones iniciales (dispersas en todo el volumen visible)
  const initialPositions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * viewport.width * 1.5;
      p[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const { speed, amplitude, phase, xOffset } = particleData[i];

      // 1. Movimiento constante HACIA ARRIBA (Vapor)
      positions[i3 + 1] += speed;

      // 2. Ondulación lateral (Seno/Coseno)
      positions[i3] += Math.sin(time + phase) * 0.002;

      // 3. Influencia del Mouse (Turbulencia suave, no atracción total)
      // Calculamos la distancia al mouse en el espacio 3D (aproximado)
      const mX = (mouse.x * viewport.width) / 2;
      const mY = (mouse.y * viewport.height) / 2;
      
      const dist = Math.sqrt(
        Math.pow(positions[i3] - mX, 2) + 
        Math.pow(positions[i3 + 1] - mY, 2)
      );

      // Si el mouse está cerca, añade un poco de "empuje" o caos
      if (dist < 2) {
        positions[i3] += (positions[i3] - mX) * 0.01;
        positions[i3 + 1] += (positions[i3 + 1] - mY) * 0.01;
      }

      // 4. Reset: Si la partícula sale por arriba o los lados, re-aparece abajo
      if (positions[i3 + 1] > viewport.height / 1.2) {
        positions[i3 + 1] = -viewport.height / 1.2;
        positions[i3] = (Math.random() - 0.5) * viewport.width * 1.5;
      }
      
      // Reset lateral para que no se escapen
      if (Math.abs(positions[i3]) > viewport.width) {
        positions[i3] = (Math.random() - 0.5) * viewport.width;
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotación muy sutil para dar volumen, pero sin mostrar los bordes del "cubo"
    mesh.current.rotation.z = Math.sin(time * 0.1) * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={initialPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

const VaporBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 60 }} 
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={2500} />
      </Canvas>
    </div>
  );
};

export default VaporBackground;
