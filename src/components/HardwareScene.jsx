import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Premium stylized ESP32 + HC-SR04 — dark metallic aesthetic ── */

function MainPCB() {
  return (
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[2.8, 0.08, 1.6]} />
      <meshStandardMaterial color="#0d2818" metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

function ESPModule() {
  return (
    <group position={[-0.5, 0.08, 0]}>
      {/* Main IC package */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.7, 0.06, 0.7]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.95} roughness={0.08} envMapIntensity={2.5} />
      </mesh>
      {/* Metal shield */}
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[0.62, 0.008, 0.62]} />
        <meshStandardMaterial color="#4a4a5e" metalness={0.98} roughness={0.05} envMapIntensity={3} />
      </mesh>
      {/* Antenna trace (gold) */}
      <mesh position={[0.42, 0.045, 0]}>
        <boxGeometry args={[0.06, 0.003, 0.55]} />
        <meshStandardMaterial color="#c9a84c" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Pin rows */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`l-${i}`} position={[-0.4, 0.02, -0.3 + i * 0.054]}>
          <boxGeometry args={[0.12, 0.015, 0.025]} />
          <meshStandardMaterial color="#b8b8c8" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`r-${i}`} position={[0.15, 0.02, -0.3 + i * 0.054]}>
          <boxGeometry args={[0.12, 0.015, 0.025]} />
          <meshStandardMaterial color="#b8b8c8" metalness={0.95} roughness={0.08} />
        </mesh>
      ))}
      {/* Status LED - tiny glow */}
      <mesh position={[-0.25, 0.075, -0.25]}>
        <sphereGeometry args={[0.015, 12, 12]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function UltrasonicModule() {
  return (
    <group position={[0.8, 0.08, 0]}>
      {/* Sensor PCB */}
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.9, 0.04, 0.5]} />
        <meshStandardMaterial color="#0a1628" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Transducer cylinders */}
      {[-0.22, 0.22].map((z) => (
        <group key={z} position={[0, 0.06, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.1, 32]} />
            <meshStandardMaterial color="#c0c0d0" metalness={0.9} roughness={0.06} envMapIntensity={2.5} />
          </mesh>
          {/* Front face mesh */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.005, 32]} />
            <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Crystal */}
      <mesh position={[0, 0.055, -0.02]}>
        <boxGeometry args={[0.08, 0.025, 0.04]} />
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

function PCBTraces() {
  const traceColor = '#c9a84c';
  const traceProps = { color: traceColor, metalness: 0.9, roughness: 0.15, emissive: traceColor, emissiveIntensity: 0.1 };

  return (
    <group position={[0, 0.042, 0]}>
      {/* Main bus traces */}
      <mesh><boxGeometry args={[2.2, 0.002, 0.008]} /><meshStandardMaterial {...traceProps} /></mesh>
      <mesh position={[0, 0, 0.15]}><boxGeometry args={[2.0, 0.002, 0.008]} /><meshStandardMaterial {...traceProps} /></mesh>
      <mesh position={[0, 0, -0.15]}><boxGeometry args={[1.8, 0.002, 0.008]} /><meshStandardMaterial {...traceProps} /></mesh>
      <mesh position={[0, 0, 0.35]}><boxGeometry args={[1.4, 0.002, 0.008]} /><meshStandardMaterial {...traceProps} /></mesh>
      <mesh position={[0, 0, -0.35]}><boxGeometry args={[1.6, 0.002, 0.008]} /><meshStandardMaterial {...traceProps} /></mesh>
      {/* Vertical connections */}
      <mesh position={[0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[1.2, 0.002, 0.006]} /><meshStandardMaterial {...traceProps} /></mesh>
      <mesh position={[-0.3, 0, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[0.8, 0.002, 0.006]} /><meshStandardMaterial {...traceProps} /></mesh>
      <mesh position={[0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}><boxGeometry args={[0.6, 0.002, 0.006]} /><meshStandardMaterial {...traceProps} /></mesh>
    </group>
  );
}

function Capacitors() {
  return (
    <>
      {[[-1.0, 0.06, 0.4], [-0.8, 0.06, -0.5], [0.3, 0.06, 0.5], [1.1, 0.06, -0.3]].map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.06, 0.03, 0.04]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
    </>
  );
}

function USBConnector() {
  return (
    <group position={[-1.4, 0.06, 0]}>
      <mesh>
        <boxGeometry args={[0.15, 0.06, 0.3]} />
        <meshStandardMaterial color="#9a9aaa" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Port opening */}
      <mesh position={[-0.01, 0, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.2]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

export default function HardwareScene() {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1} color="#ffffff" />
      <pointLight position={[-2, 2, 3]} intensity={0.5} color="#a78bfa" />
      <pointLight position={[2, -1, 2]} intensity={0.3} color="#38bdf8" />

      <group ref={groupRef} rotation={[0.5, -0.3, 0]} scale={1.15}>
        <MainPCB />
        <ESPModule />
        <UltrasonicModule />
        <PCBTraces />
        <Capacitors />
        <USBConnector />
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}
