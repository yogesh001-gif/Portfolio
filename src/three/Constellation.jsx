import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { Glow } from './Atmosphere';
import { textTexture } from './textures';
import { TECH_STACK } from '../data/content';
import { store, sectionProgress } from '../lib/store';

/* Skills as a star constellation. Hovering a skill chip in the page
   lights up the matching star. */
function fibonacciSphere(n, r) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    pts.push(new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r));
  }
  return pts;
}

function Node({ item, position }) {
  const ref = useRef();
  const label = useRef();
  const tex = useMemo(
    () => textTexture(item.name, { font: '600 46px "Space Grotesk", system-ui, sans-serif', padding: 14 }),
    [item.name]
  );
  const aspect = tex.userData.aspect;
  useFrame((_, delta) => {
    const active = store.hoveredSkill === item.name;
    const dim = store.hoveredSkill && !active;
    const s = active ? 1.9 : dim ? 0.75 : 1;
    if (ref.current) easing.damp3(ref.current.scale, [s, s, s], 0.15, delta);
    if (label.current) {
      label.current.material.opacity = THREE.MathUtils.damp(label.current.material.opacity, dim ? 0.25 : 1, 8, delta);
      const k = active ? 0.26 : 0.17;
      easing.damp3(label.current.scale, [k * aspect, k, 1], 0.15, delta);
    }
  });
  return (
    <group position={position}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshBasicMaterial color={item.color} toneMapped={false} />
        </mesh>
        <Glow color={item.color} size={0.9} opacity={0.75} />
      </group>
      <sprite ref={label} position={[0, -0.28, 0]}>
        <spriteMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
      </sprite>
    </group>
  );
}

export default function Constellation({ position }) {
  const group = useRef();
  const points = useMemo(() => fibonacciSphere(TECH_STACK.length, 2.15), []);
  const lines = useMemo(() => {
    const seg = [];
    points.forEach((p, i) => {
      const nearest = points
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter((x) => x.j > i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      nearest.forEach(({ j }) => seg.push(p.x, p.y, p.z, points[j].x, points[j].y, points[j].z));
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    return g;
  }, [points]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const p = sectionProgress('skills');
    const auto = store.reduced ? 0 : clock.elapsedTime * 0.06;
    easing.damp(group.current.rotation, 'y', auto + p * Math.PI * 1.2, 0.4, delta);
    easing.damp(group.current.rotation, 'x', 0.25 + store.pointer.y * 0.15, 0.4, delta);
  });

  return (
    <group position={position}>
      <group ref={group}>
        <lineSegments geometry={lines}>
          <lineBasicMaterial color="#a78bfa" transparent opacity={0.22} toneMapped={false} />
        </lineSegments>
        {TECH_STACK.map((item, i) => (
          <Node key={item.name} item={item} position={points[i]} />
        ))}
        <mesh>
          <sphereGeometry args={[2.15, 32, 32]} />
          <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.04} toneMapped={false} />
        </mesh>
      </group>
      <Glow color="#6366f1" size={5} opacity={0.25} />
    </group>
  );
}
