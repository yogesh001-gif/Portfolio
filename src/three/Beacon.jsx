import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Glow } from './Atmosphere';
import { PALETTE } from './stations';
import { store, on } from '../lib/store';

/* Contact beacon: a transmitter that broadcasts waves.
   When a message is sent, it fires a big burst. */
export default function Beacon({ position }) {
  const waves = useRef([]);
  const core = useRef();
  const burst = useRef();
  const spiral = useRef();
  const pending = useRef(false);
  useEffect(() => on('contact-sent', () => (pending.current = true)), []);
  const particles = useMemo(() => {
    const n = 220;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = i * 0.55;
      const r = 0.6 + (i / n) * 2.4;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = (i / n) * 3 - 1.5;
      p[i * 3 + 2] = Math.sin(a) * r;
    }
    return p;
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (pending.current) {
      store.contactPulse = t;
      pending.current = false;
    }
    waves.current.forEach((w, i) => {
      if (!w) return;
      const k = ((store.reduced ? t * 0.3 : t) * 0.35 + i / 4) % 1;
      w.scale.setScalar(0.4 + k * 3.2);
      w.material.opacity = (1 - k) * 0.55;
    });
    if (core.current) {
      const s = 1 + (store.reduced ? 0 : Math.sin(t * 3) * 0.06);
      core.current.scale.setScalar(s);
      if (!store.reduced) core.current.rotation.y += delta * 0.4;
    }
    if (spiral.current && !store.reduced) spiral.current.rotation.y += delta * 0.25;
    if (burst.current) {
      const since = t - store.contactPulse;
      const k = THREE.MathUtils.clamp(since / 1.6, 0, 1);
      burst.current.visible = since >= 0 && since < 1.6;
      burst.current.scale.setScalar(0.5 + k * 9);
      burst.current.material.opacity = (1 - k) * 0.9;
    }
  });

  return (
    <group position={position}>
      <mesh ref={core}>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#1d1b3a" metalness={1} roughness={0.15} emissive={PALETTE.violetDeep} emissiveIntensity={0.25} envMapIntensity={2} />
      </mesh>
      <mesh scale={0.62}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={PALETTE.violet} wireframe toneMapped={false} />
      </mesh>
      <Glow color={PALETTE.violet} size={4.5} opacity={0.55} />
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} ref={(el) => (waves.current[i] = el)}>
          <torusGeometry args={[1, 0.012, 8, 120]} />
          <meshBasicMaterial color={i % 2 ? PALETTE.cyan : PALETTE.violet} transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
      <mesh ref={burst} visible={false}>
        <torusGeometry args={[1, 0.04, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      <points ref={spiral}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color={PALETTE.cyan} transparent opacity={0.7} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
