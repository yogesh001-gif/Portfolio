import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture } from './textures';
import { STATIONS, PALETTE } from './stations';
import { store } from '../lib/store';

/* Additive glow sprite — cheap "bloom" without post-processing. */
export function Glow({ color = PALETTE.violet, size = 1, opacity = 0.6, ...props }) {
  const map = useMemo(() => glowTexture(), []);
  return (
    <sprite scale={[size, size, size]} {...props}>
      <spriteMaterial
        map={map}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

/* Dust field spanning the whole journey — gives a sense of speed while flying. */
export function Starfield({ count = 2400 }) {
  const ref = useRef();
  const map = useMemo(() => glowTexture(), []);
  const [positions, colors] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const palette = [PALETTE.violet, PALETTE.cyan, '#ffffff', PALETTE.indigo, '#c4b5fd'].map((h) => new THREE.Color(h));
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 36;
      p[i * 3 + 1] = 14 - Math.random() * 140;
      p[i * 3 + 2] = -22 + Math.random() * 28;
      const col = palette[Math.floor(Math.random() * palette.length)];
      const dim = 0.35 + Math.random() * 0.65;
      c[i * 3] = col.r * dim;
      c[i * 3 + 1] = col.g * dim;
      c[i * 3 + 2] = col.b * dim;
    }
    return [p, c];
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || store.reduced) return;
    ref.current.rotation.y += delta * 0.004;
    ref.current.position.y = store.velocity * -0.004;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={map}
        size={0.17}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.95}
        fog={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

/* A glowing thread linking all stations, with a light that travels
   along it as you scroll. */
export function JourneyPath() {
  const traveler = useRef();
  const curve = useMemo(() => {
    const pts = [];
    STATIONS.forEach((s, i) => {
      const [x, y] = s.center;
      pts.push(new THREE.Vector3(x + (i % 2 ? -4 : 4), y + 2, -8));
      pts.push(new THREE.Vector3(x + (i % 2 ? 4.4 : -4.4), y - 8, -9));
    });
    return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  }, []);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 400, 0.012, 6, false), [curve]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ scene }) => {
    const f = scene.userData.station || 0;
    const t = Math.min(0.999, Math.max(0, (f * 2 + 0.5) / (STATIONS.length * 2 - 1)));
    curve.getPointAt(t, tmp);
    traveler.current?.position.copy(tmp);
  });

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={PALETTE.violet} transparent opacity={0.16} toneMapped={false} />
      </mesh>
      <group ref={traveler}>
        <mesh>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <Glow color={PALETTE.cyan} size={1.6} opacity={0.9} />
      </group>
    </group>
  );
}
