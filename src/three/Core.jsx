import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Glow } from './Atmosphere';
import { PALETTE } from './stations';
import { store } from '../lib/store';

function Ring({ radius, color, speed, tilt }) {
  const ref = useRef();
  useFrame((_, d) => {
    if (ref.current && !store.reduced) ref.current.rotation.z += d * speed;
  });
  return (
    <group rotation={tilt}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.009, 12, 160]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Orbiter({ radius, speed, offset, color, size, tilt }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * (store.reduced ? speed * 0.2 : speed) + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t) * radius, 0);
  });
  return (
    <group rotation={tilt}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[size, 16, 16]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
        <Glow color={color} size={size * 14} opacity={0.7} />
      </group>
    </group>
  );
}

/* Hero centrepiece: a liquid-metal core wrapped in a wireframe shell,
   orbital rings and satellites. Reacts to the pointer and scroll speed. */
export default function Core({ position = [0, 0, 0], scale = 1 }) {
  const group = useRef();
  const shell = useRef();
  const mat = useRef();

  const rings = useMemo(
    () => [
      { radius: 1.55, color: PALETTE.violet, speed: 0.25, tilt: [Math.PI / 2.3, 0, 0] },
      { radius: 1.8, color: PALETTE.cyan, speed: -0.18, tilt: [Math.PI / 1.8, Math.PI / 5, 0] },
      { radius: 2.05, color: PALETTE.indigo, speed: 0.12, tilt: [Math.PI / 2.8, -Math.PI / 4, 0] },
    ],
    []
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const px = store.reduced ? 0 : store.pointer.x;
    const py = store.reduced ? 0 : store.pointer.y;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, px * 0.5, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.3, 3, delta);
    if (shell.current && !store.reduced) {
      shell.current.rotation.y -= delta * 0.08;
      shell.current.rotation.x += delta * 0.03;
    }
    if (mat.current) {
      const target = 0.28 + Math.min(0.35, Math.abs(store.velocity) * 0.012);
      mat.current.distort = THREE.MathUtils.damp(mat.current.distort, store.reduced ? 0.15 : target, 3, delta);
    }
    g.position.y = position[1] + (store.reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.08);
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          ref={mat}
          color="#16162a"
          metalness={1}
          roughness={0.12}
          envMapIntensity={1.6}
          distort={0.3}
          speed={1.6}
        />
      </mesh>
      <mesh ref={shell} scale={1.3}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={PALETTE.violet} wireframe transparent opacity={0.18} toneMapped={false} />
      </mesh>
      <Glow color={PALETTE.violetDeep} size={7} opacity={0.35} />
      <Glow color={PALETTE.cyan} size={4} opacity={0.12} position={[0.6, -0.4, -0.5]} />
      {rings.map((r, i) => (
        <Ring key={i} {...r} />
      ))}
      <Orbiter radius={1.55} speed={0.5} offset={0} color={PALETTE.violet} size={0.045} tilt={rings[0].tilt} />
      <Orbiter radius={1.8} speed={-0.35} offset={2} color={PALETTE.cyan} size={0.04} tilt={rings[1].tilt} />
      <Orbiter radius={2.05} speed={0.25} offset={4} color={PALETTE.pink} size={0.035} tilt={rings[2].tilt} />
    </group>
  );
}
