import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Glow } from './Atmosphere';
import { textTexture, roundRect } from './textures';
import { PALETTE, STATION_INDEX } from './stations';
import { store, scrollToId, emit } from '../lib/store';

const DESK_STATION = STATION_INDEX.about;

/* Is the camera parked at the desk? Interactions only work then,
   so the desk never steals clicks from other sections. */
function deskActive(scene) {
  return Math.abs((scene.userData.station ?? 0) - DESK_STATION) < 0.45;
}

/* ── Clickable object wrapper ─────────────────────────────────── */
function Hotspot({ target, label, labelPos = [0, 0.6, 0], children, ...props }) {
  const group = useRef();
  const inner = useRef();
  const labelRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);
  const scene = useThree((s) => s.scene);
  const labelTex = useMemo(
    () =>
      textTexture(`${label}  →`, {
        font: '600 44px "Space Grotesk", system-ui, sans-serif',
        bg: 'rgba(12,12,22,0.82)',
        border: 'rgba(167,139,250,0.55)',
        padding: 26,
        radius: 40,
      }),
    [label]
  );
  const aspect = labelTex.userData.aspect;

  useEffect(() => {
    if (!hovered) return undefined;
    document.body.style.cursor = 'pointer';
    emit('cursor', { label });
    return () => {
      document.body.style.cursor = '';
      emit('cursor', null);
    };
  }, [hovered, label]);

  useFrame(({ scene, clock }, delta) => {
    const active = deskActive(scene);
    if (!active && hovered) setHovered(false);
    const lift = hovered ? 0.07 : 0;
    if (inner.current) {
      inner.current.position.y = THREE.MathUtils.damp(inner.current.position.y, lift, 8, delta);
      const s = hovered ? 1.04 : 1;
      inner.current.scale.setScalar(THREE.MathUtils.damp(inner.current.scale.x, s, 8, delta));
    }
    if (labelRef.current) {
      const m = labelRef.current.material;
      m.opacity = THREE.MathUtils.damp(m.opacity, active ? (hovered ? 1 : 0.78) : 0, 6, delta);
      const k = hovered ? 0.24 : 0.2;
      labelRef.current.scale.set(k * aspect, k, 1);
      labelRef.current.position.y = labelPos[1] + (store.reduced ? 0 : Math.sin(clock.elapsedTime * 2 + labelPos[0]) * 0.025);
    }
    if (ringRef.current) {
      const t = (clock.elapsedTime * 0.8 + labelPos[0]) % 1;
      ringRef.current.scale.setScalar(0.15 + t * 0.35);
      ringRef.current.material.opacity = active ? (1 - t) * 0.6 : 0;
    }
  });

  const handlers = {
    onPointerOver: (e) => {
      if (!deskActive(scene)) return;
      e.stopPropagation();
      setHovered(true);
    },
    onPointerOut: () => setHovered(false),
    onClick: (e) => {
      if (!deskActive(scene)) return;
      e.stopPropagation();
      setHovered(false);
      scrollToId(target);
    },
  };

  return (
    <group ref={group} {...props}>
      <group ref={inner} {...handlers}>
        {children}
      </group>
      <sprite ref={labelRef} position={labelPos}>
        <spriteMaterial map={labelTex} transparent opacity={0} depthWrite={false} depthTest={false} toneMapped={false} />
      </sprite>
      <mesh ref={ringRef} position={[labelPos[0], 0.012, labelPos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1, 48]} />
        <meshBasicMaterial color={PALETTE.violet} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
      {hovered && <Glow color={PALETTE.violet} size={1.6} opacity={0.35} position={[0, 0.2, 0]} />}
    </group>
  );
}

/* ── Monitor with a live "code editor" screen ─────────────────── */
function useCodeScreen() {
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 600;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return { canvas: c, texture: t };
  }, []);

  const draw = (cursorOn) => {
    const g = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    g.fillStyle = '#0c0c16';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#12121f';
    g.fillRect(0, 0, 190, H);
    g.fillStyle = '#161628';
    g.fillRect(0, 0, W, 44);
    ['#f87171', '#fbbf24', '#4ade80'].forEach((col, i) => {
      g.fillStyle = col;
      g.beginPath();
      g.arc(24 + i * 22, 22, 7, 0, Math.PI * 2);
      g.fill();
    });
    g.fillStyle = '#8a8a9a';
    g.font = '500 20px "Manrope", system-ui, sans-serif';
    g.fillText('portfolio — Work.jsx', 420, 29);
    ['src', '  Work.jsx', '  Desk.jsx', '  TrafficX.cpp', '  Skills.jsx', 'public'].forEach((f, i) => {
      g.fillStyle = i === 1 ? '#c4b5fd' : '#6b6b80';
      g.fillText(f, 22, 90 + i * 34);
    });
    const lines = [
      [['#c084fc', 'const '], ['#e2e8f0', 'projects = ['], []],
      [['#86efac', "  'AI Finance Advisor',"]],
      [['#86efac', "  'Khushi Fashion',"]],
      [['#86efac', "  'Buski Baat',"]],
      [['#86efac', "  'AWS x MAIT',"]],
      [['#e2e8f0', '];']],
      [],
      [['#c084fc', 'export default function '], ['#7dd3fc', 'Work'], ['#e2e8f0', '() {']],
      [['#c084fc', '  return '], ['#e2e8f0', '<'], ['#7dd3fc', 'Grid '], ['#fbbf24', 'items'], ['#e2e8f0', '={projects} />;']],
      [['#e2e8f0', '}']],
      [],
      [['#6b7280', '// click the screen to open my work →']],
    ];
    g.font = '500 25px ui-monospace, "Cascadia Code", Consolas, monospace';
    let lastX = 0;
    lines.forEach((parts, i) => {
      const y = 96 + i * 38;
      g.fillStyle = '#3f3f55';
      g.fillText(String(i + 1).padStart(2, ' '), 210, y);
      let x = 260;
      parts.forEach(([col, txt]) => {
        if (!txt) return;
        g.fillStyle = col;
        g.fillText(txt, x, y);
        x += g.measureText(txt).width;
      });
      if (i === lines.length - 1) lastX = x;
    });
    if (cursorOn) {
      g.fillStyle = '#a78bfa';
      g.fillRect(lastX + 4, 96 + (lines.length - 1) * 38 - 22, 12, 28);
    }
    // glow bar
    const grd = g.createLinearGradient(0, H - 6, W, H);
    grd.addColorStop(0, '#a78bfa');
    grd.addColorStop(1, '#38bdf8');
    g.fillStyle = grd;
    g.fillRect(0, H - 6, W, 6);
    texture.needsUpdate = true;
  };

  useEffect(() => {
    draw(true);
    let on = true;
    const id = setInterval(() => {
      on = !on;
      draw(on);
    }, 600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return texture;
}

function Monitor() {
  const screen = useCodeScreen();
  return (
    <group>
      <mesh position={[0, 0.015, -0.6]}>
        <cylinderGeometry args={[0.32, 0.36, 0.03, 40]} />
        <meshStandardMaterial color="#20202e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.34, -0.66]}>
        <boxGeometry args={[0.1, 0.62, 0.05]} />
        <meshStandardMaterial color="#26263a" metalness={0.8} roughness={0.3} />
      </mesh>
      <RoundedBox args={[2.2, 1.3, 0.07]} radius={0.035} smoothness={4} position={[0, 1.08, -0.62]}>
        <meshStandardMaterial color="#111119" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 1.08, -0.583]}>
        <planeGeometry args={[2.08, 1.2]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 1.05, 0.2]} color="#8b8cf8" intensity={2.2} distance={3} decay={2} />
    </group>
  );
}

function Keyboard() {
  const keys = useRef();
  useEffect(() => {
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 14; c++) {
        m.makeTranslation(-0.585 + c * 0.09, 0.062, 0.2 + r * 0.085);
        keys.current.setMatrixAt(i++, m);
      }
    }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <RoundedBox args={[1.36, 0.05, 0.44]} radius={0.02} smoothness={3} position={[0, 0.028, 0.33]}>
        <meshStandardMaterial color="#1a1a28" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[null, null, 56]}>
        <boxGeometry args={[0.075, 0.022, 0.07]} />
        <meshStandardMaterial color="#2a2a3e" roughness={0.5} emissive="#6d28d9" emissiveIntensity={0.18} />
      </instancedMesh>
      <mesh position={[0.95, 0.03, 0.38]} scale={[1, 0.6, 1.5]}>
        <sphereGeometry args={[0.07, 24, 16]} />
        <meshStandardMaterial color="#1f1f2e" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

function ESP32Board() {
  const led = useRef();
  useFrame(({ clock }) => {
    if (led.current) led.current.material.color.set(Math.sin(clock.elapsedTime * 5) > 0 ? '#22c55e' : '#052e16');
  });
  return (
    <group>
      {/* ESP32 dev board */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.62, 0.03, 0.3]} />
        <meshStandardMaterial color="#0f3d2a" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0.06, 0.05, 0]}>
        <boxGeometry args={[0.26, 0.03, 0.2]} />
        <meshStandardMaterial color="#c7c7d2" metalness={0.95} roughness={0.15} />
      </mesh>
      <mesh position={[-0.26, 0.045, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.12]} />
        <meshStandardMaterial color="#9a9aaa" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh ref={led} position={[-0.14, 0.045, 0.1]}>
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshBasicMaterial color="#22c55e" toneMapped={false} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i}>
          <mesh position={[-0.24 + i * 0.052, 0.045, 0.135]}>
            <boxGeometry args={[0.02, 0.03, 0.02]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[-0.24 + i * 0.052, 0.045, -0.135]}>
            <boxGeometry args={[0.02, 0.03, 0.02]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {/* HC-SR04 ultrasonic sensor */}
      <group position={[0.02, 0.02, 0.42]}>
        <mesh>
          <boxGeometry args={[0.48, 0.025, 0.2]} />
          <meshStandardMaterial color="#123c8c" roughness={0.5} />
        </mesh>
        {[-0.12, 0.12].map((x) => (
          <mesh key={x} position={[x, 0.07, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.11, 32]} />
            <meshStandardMaterial color="#c9ccd6" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>
      {/* jumper wires */}
      {[
        ['#ef4444', -0.1],
        ['#f59e0b', -0.03],
        ['#22c55e', 0.04],
        ['#3b82f6', 0.11],
      ].map(([color, x]) => (
        <mesh key={color} position={[x, 0.06, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.075, 0.008, 8, 20, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function CertificateFrames() {
  const [a, b] = useTexture(['/certificates/career-essentials-genai-thumb.webp', '/certificates/cpp-thumb.webp']);
  [a, b].forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const Frame = ({ tex, ...p }) => (
    <group {...p}>
      <RoundedBox args={[0.74, 0.58, 0.04]} radius={0.015} smoothness={3}>
        <meshStandardMaterial color="#c9a84c" metalness={0.9} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[0.66, 0.5]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.22, -0.12]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.04, 0.3, 0.02]} />
        <meshStandardMaterial color="#8a7433" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
  return (
    <group>
      <Frame tex={b} position={[0.16, 0.3, -0.18]} rotation={[-0.12, -0.35, 0.02]} />
      <Frame tex={a} position={[-0.1, 0.3, 0.05]} rotation={[-0.12, -0.2, 0]} />
    </group>
  );
}

function Phone() {
  const ref = useRef();
  const screen = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 512;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 256, 512);
    grd.addColorStop(0, '#312e81');
    grd.addColorStop(1, '#0e7490');
    g.fillStyle = grd;
    roundRect(g, 0, 0, 256, 512, 30);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,0.92)';
    roundRect(g, 28, 300, 200, 70, 20);
    g.fill();
    g.fillStyle = '#312e81';
    g.font = '700 30px "Space Grotesk", system-ui, sans-serif';
    g.fillText('Say hi 👋', 50, 346);
    g.fillStyle = '#fff';
    g.font = '700 72px "Space Grotesk", system-ui, sans-serif';
    g.fillText('1', 110, 170);
    g.font = '500 24px "Manrope", system-ui, sans-serif';
    g.fillText('new message', 60, 220);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current || store.reduced) return;
    const t = clock.elapsedTime % 4;
    ref.current.rotation.y = t < 0.5 ? Math.sin(t * 60) * 0.04 : 0;
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[0.28, 0.025, 0.56]} radius={0.012} smoothness={3} position={[0, 0.013, 0]}>
        <meshStandardMaterial color="#0d0d14" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 0.52]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PhotoFrame() {
  const tex = useTexture('/profile-pic/profile.jpg');
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <group>
      <RoundedBox args={[0.4, 0.54, 0.035]} radius={0.012} smoothness={3}>
        <meshStandardMaterial color="#e8e8f0" metalness={0.2} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.019]}>
        <planeGeometry args={[0.33, 0.47]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Lamp() {
  return (
    <group>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.04, 32]} />
        <meshStandardMaterial color="#1c1c28" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 0.42, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.015, 0.015, 0.85, 12]} />
        <meshStandardMaterial color="#2b2b3d" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.42, 0.78, 0]} rotation={[0, 0, 1.1]}>
        <cylinderGeometry args={[0.015, 0.015, 0.55, 12]} />
        <meshStandardMaterial color="#2b2b3d" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.66, 0.66, 0]} rotation={[0, 0, 2.4]}>
        <coneGeometry args={[0.13, 0.2, 32, 1, true]} />
        <meshStandardMaterial color="#2b2b3d" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.7, 0.62, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#fde68a" toneMapped={false} />
      </mesh>
      <Glow color="#fbbf24" size={1.1} opacity={0.5} position={[0.72, 0.58, 0]} />
      <pointLight position={[0.75, 0.5, 0]} color="#fcd34d" intensity={1.4} distance={2.6} decay={2} />
    </group>
  );
}

function Plant() {
  const leaves = useMemo(
    () => Array.from({ length: 9 }, (_, i) => ({ r: (i / 9) * Math.PI * 2, tilt: 0.35 + (i % 3) * 0.18, h: 0.34 + (i % 2) * 0.1 })),
    []
  );
  return (
    <group>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.14, 0.11, 0.24, 24]} />
        <meshStandardMaterial color="#e5e0d8" roughness={0.8} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh key={i} position={[Math.cos(l.r) * 0.05, 0.3, Math.sin(l.r) * 0.05]} rotation={[Math.sin(l.r) * l.tilt, 0, -Math.cos(l.r) * l.tilt]}>
          <coneGeometry args={[0.04, l.h, 6]} />
          <meshStandardMaterial color={i % 2 ? '#16a34a' : '#22c55e'} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Mug() {
  return (
    <group>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.18, 24]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.45} />
      </mesh>
      <mesh position={[0.085, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.045, 0.012, 8, 20]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.45} />
      </mesh>
    </group>
  );
}

/* ── The desk: the interactive hub of the site ───────────────── */
export default function Desk({ position }) {
  return (
    <group position={position}>
      {/* desk surface + legs */}
      <RoundedBox args={[4.8, 0.14, 2.4]} radius={0.05} smoothness={4} position={[0, -0.07, 0]}>
        <meshStandardMaterial color="#17172a" metalness={0.35} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, -0.07, 1.205]}>
        <boxGeometry args={[4.7, 0.018, 0.012]} />
        <meshBasicMaterial color={PALETTE.violet} toneMapped={false} />
      </mesh>
      <Glow color={PALETTE.violet} size={5} opacity={0.12} position={[0, -0.2, 1.3]} />
      {[
        [-2.25, -1.05],
        [2.25, -1.05],
        [-2.25, 1.05],
        [2.25, 1.05],
      ].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, -0.95, z]}>
          <boxGeometry args={[0.08, 1.75, 0.08]} />
          <meshStandardMaterial color="#1b1b29" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      <Hotspot target="projects" label="My work" labelPos={[0, 1.95, -0.6]}>
        <Monitor />
      </Hotspot>
      <Keyboard />
      <Hotspot target="trafficx" label="TrafficX" labelPos={[0, 0.7, 0]} position={[-1.5, 0, 0.2]} rotation={[0, 0.35, 0]}>
        <ESP32Board />
      </Hotspot>
      <Hotspot target="certificates" label="Certificates" labelPos={[0, 0.95, 0]} position={[1.65, 0, -0.45]}>
        <CertificateFrames />
      </Hotspot>
      <Hotspot target="contact" label="Contact" labelPos={[0, 0.55, 0]} position={[1.55, 0, 0.55]} rotation={[0, -0.4, 0]}>
        <Phone />
      </Hotspot>
      <group position={[-1.05, 0.28, -0.62]} rotation={[-0.15, 0.3, 0]}>
        <PhotoFrame />
      </group>
      <group position={[-2.1, 0, -0.8]}>
        <Lamp />
      </group>
      <group position={[2.1, 0, -0.85]}>
        <Plant />
      </group>
      <group position={[2.0, 0, 0.05]}>
        <Mug />
      </group>
    </group>
  );
}
