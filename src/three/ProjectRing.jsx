import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { projectTexture } from './textures';
import { Glow } from './Atmosphere';
import { PROJECTS } from '../data/content';
import { store, sectionProgress } from '../lib/store';

/* Floating project "screens" on a carousel that turns as you scroll
   through the Work section. */
export default function ProjectRing({ position }) {
  const ring = useRef();
  const panels = useRef([]);
  const textures = useMemo(() => PROJECTS.map((p, i) => projectTexture(p, i)), []);
  const radius = 4.2;
  const step = (Math.PI * 2) / PROJECTS.length;

  useFrame(({ clock }, delta) => {
    if (!ring.current) return;
    const p = sectionProgress('projects');
    // map the middle of the section to one full turn of the carousel
    const turn = THREE.MathUtils.clamp((p - 0.2) / 0.6, 0, 1) * step * (PROJECTS.length - 1);
    const idle = store.reduced ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.05;
    easing.damp(ring.current.rotation, 'y', -turn + idle, 0.35, delta);

    panels.current.forEach((g, i) => {
      if (!g) return;
      const world = i * step - turn;
      const facing = Math.cos(world); // 1 when facing camera
      const s = 0.8 + Math.max(0, facing) * 0.25;
      easing.damp3(g.scale, [s, s, s], 0.25, delta);
      if (!store.reduced) g.position.y = Math.sin(clock.elapsedTime * 0.6 + i) * 0.12;
      g.children.forEach((child) => {
        if (child.material && 'opacity' in child.material && child.userData.fade) {
          child.material.opacity = 0.25 + Math.max(0, facing) * 0.75;
        }
      });
    });
  });

  return (
    <group position={position}>
      <group ref={ring}>
        {PROJECTS.map((p, i) => {
          const a = i * step;
          return (
            <group
              key={p.id}
              position={[Math.sin(a) * radius, 0, Math.cos(a) * radius]}
              rotation={[0, a, 0]}
            >
              <group ref={(el) => (panels.current[i] = el)}>
                <RoundedBox args={[3.3, 2.1, 0.06]} radius={0.06} smoothness={4}>
                  <meshStandardMaterial color="#0e0e18" metalness={0.8} roughness={0.25} />
                </RoundedBox>
                <mesh position={[0, 0, 0.035]} userData={{ fade: true }}>
                  <planeGeometry args={[3.16, 1.97]} />
                  <meshBasicMaterial map={textures[i]} transparent toneMapped={false} />
                </mesh>
                <Glow color={p.colors[1]} size={4.5} opacity={0.18} position={[0, 0, -0.3]} />
              </group>
            </group>
          );
        })}
      </group>
      <Glow color="#7c3aed" size={6} opacity={0.2} />
    </group>
  );
}
