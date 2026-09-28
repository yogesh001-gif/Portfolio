import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { Glow } from './Atmosphere';
import { CERTIFICATIONS } from '../data/content';
import { store, sectionProgress } from '../lib/store';

/* The real certificates, orbiting as a ring that turns with scroll. */
function Frame({ tex, angle, radius }) {
  return (
    <group position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, angle, 0]}>
      <mesh>
        <boxGeometry args={[1.64, 1.2, 0.03]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0, 0.017]}>
        <planeGeometry args={[1.56, 1.12]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function CertRingTextured({ position }) {
  const textures = useTexture(CERTIFICATIONS.map((c) => `/certificates/${c.id}-thumb.webp`));
  textures.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  return <Ring position={position} textures={textures} />;
}

export function Ring({ position, textures }) {
  const ring = useRef();
  const radius = 4.6;
  const step = (Math.PI * 2) / CERTIFICATIONS.length;

  useFrame(({ clock }, delta) => {
    if (!ring.current) return;
    const p = sectionProgress('certificates');
    const auto = store.reduced ? 0 : clock.elapsedTime * 0.05;
    easing.damp(ring.current.rotation, 'y', -p * Math.PI * 1.4 - auto, 0.4, delta);
  });

  return (
    <group position={position} rotation={[0.12, 0, 0]}>
      <group ref={ring}>
        {CERTIFICATIONS.map((c, i) =>
          textures ? (
            <Frame key={c.id} tex={textures[i]} angle={i * step} radius={radius} />
          ) : (
            <group key={c.id} position={[Math.sin(i * step) * radius, 0, Math.cos(i * step) * radius]} rotation={[0, i * step, 0]}>
              <mesh>
                <boxGeometry args={[1.64, 1.2, 0.03]} />
                <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.28} />
              </mesh>
            </group>
          )
        )}
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 200]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <Glow color="#fbbf24" size={4} opacity={0.2} />
    </group>
  );
}
