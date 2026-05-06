import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function SalteñaModel({ count = 34000 }) {
  const pointsRef = useRef<THREE.Points>(null!);

  const particles = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cBright  = new THREE.Color('#F0A030');
    const cBase    = new THREE.Color('#C8701A');
    const cToasted = new THREE.Color('#7A3A0A');
    const cDark    = new THREE.Color('#4A1E05');
    const cCrestD  = new THREE.Color('#3D1A04');
    const cCrestM  = new THREE.Color('#5C2A08');
    const cCrestH  = new THREE.Color('#7A3E10');

    const A = 2.5, B = 1.35, C = 1.1;
    const YOFF = -0.25;

    // Superficie superior del elipsoide en x dado (AJUSTADO para el narrowing de las puntas)
    function yTopAt(x: number) {
      const s = Math.min(Math.abs(x) / A, 0.9999);
      // Aplicamos el mismo factor (1 - s * 0.35) que usamos en el cuerpo para que no floten en las puntas
      return (B * Math.sqrt(1 - s * s)) * (1 - s * 0.35) + YOFF;
    }

    // --- CUERPO ---
    const bodyCount = Math.floor(count * 0.78);
    for (let i = 0; i < bodyCount; i++) {
      const i3 = i * 3;
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      let x = A * Math.sin(v) * Math.cos(u);
      let y = B * Math.sin(v) * Math.sin(u);
      let z = C * Math.cos(v);

      // Base plana
      if (y < 0) y *= 0.25;

      // Estrechar hacia las puntas
      const tip = Math.abs(x) / A;
      y *= (1 - tip * 0.35);
      z *= (1 - tip * 0.2);

      const r = Math.pow(Math.random(), 0.08);
      pos[i3]     = x * r;
      pos[i3 + 1] = y * r + YOFF;
      pos[i3 + 2] = z * r;

      const ny = y / B;
      const nx = Math.abs(x) / A;
      let c = cBase.clone();
      if (ny > 0.5 && nx < 0.7) c.lerp(cBright, (ny - 0.5) * 1.5);
      else if (nx > 0.75)        c.lerp(cToasted, (nx - 0.75) * 3.5);
      if (y < 0) c.lerp(cDark, Math.min(-y / 0.4, 1) * 0.7);

      col[i3]     = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }

    // --- REPULGUE: bolitas de punta a punta con spacing adaptativo ---
    const blobs: { cx: number; cy: number; cz: number; r: number; curve: number }[] = [];
    let bx = -A;

    while (bx <= A) {
      const xN = Math.abs(bx) / A;
      const surfaceY = yTopAt(bx);
      const curveFactor = Math.sqrt(1 - xN * xN); 
      const blobR = 0.12 * curveFactor + 0.04;    
      const cy = surfaceY + blobR * 0.1; 
      const idx = blobs.length;
      const zOff = (idx % 2 === 0 ? 1 : -1) * 0.04 * curveFactor; 

      blobs.push({ cx: bx, cy, cz: zOff, r: blobR, curve: curveFactor });

      // Avanzamos proporcionalmente al radio para que siempre se toquen
      // Multiplicador 1.4 asegura solapamiento (2.0 sería apenas tocándose)
      bx += (blobR * 1.4);
    }

    const crestCount = count - bodyCount;
    const perBlob = Math.ceil(crestCount / blobs.length);

    let pi = bodyCount;
    for (let b = 0; b < blobs.length && pi < count; b++) {
      const blob = blobs[b];
      const n = Math.min(perBlob, count - pi);
      for (let k = 0; k < n && pi < count; k++) {
        const i3 = pi * 3;
        let px, py, pz, d2;
        do {
          px = Math.random() * 2 - 1;
          py = Math.random() * 2 - 1;
          pz = Math.random() * 2 - 1;
          d2 = px * px + py * py + pz * pz;
        } while (d2 > 1);

        // Ajustamos la distribución para que la base de la bolita sea más plana y se hunda
        const rr = blob.r * (0.7 + 0.3 * Math.pow(d2, 0.2));
        pos[i3]     = blob.cx + px * rr * 0.95;
        pos[i3 + 1] = blob.cy + py * rr;
        pos[i3 + 2] = blob.cz + pz * rr * 0.7;

        // Quitamos el clamp agresivo que las hacía flotar
        // Si queremos que se hundan, permitimos py negativo sin límite tan alto
        
        const normY = (py + 1) / 2;
        let c = cCrestD.clone();
        if (normY > 0.65)       c.lerp(cCrestH, (normY - 0.65) * 2.2);
        else if (normY > 0.35)  c.lerp(cCrestM, (normY - 0.35) * 1.8);

        col[i3]     = c.r;
        col[i3 + 1] = c.g;
        col[i3 + 2] = c.b;
        pi++;
      }
    }

    return { pos, col };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.18;
    pointsRef.current.rotation.x = Math.sin(t * 0.4) * 0.06;
    pointsRef.current.position.y = Math.sin(t * 0.5) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.pos, 3]}
          count={count}
          array={particles.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.col, 3]}
          count={count}
          array={particles.col}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.93}
        sizeAttenuation
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}

const SalteñaParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-transparent">
      <Canvas camera={{ position: [0, 0.4, 7], fov: 38 }}>
        <ambientLight intensity={1.5} />
        <SalteñaModel count={34000} />
      </Canvas>
    </div>
  );
};

export default SalteñaParticles;