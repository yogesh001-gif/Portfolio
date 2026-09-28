import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Premium abstract tech sculpture — not a literal chip, but a sleek
     dark metallic form with glowing accents that follows the cursor ── */

function CoreSphere() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.08;
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color="#1a1a2e"
        metalness={0.97}
        roughness={0.08}
        envMapIntensity={2.5}
        distort={0.15}
        speed={1.5}
      />
    </mesh>
  );
}

function GlowRing({ radius, color, speed, axis }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      if (axis === 'x') ref.current.rotation.x = t;
      else if (axis === 'y') ref.current.rotation.y = t;
      else ref.current.rotation.z = t;
    }
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.008, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        toneMapped={false}
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function OrbitingNode({ radius, speed, offset, size = 0.04, color = '#a78bfa' }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed + offset;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.y = Math.sin(t) * radius * 0.6;
      ref.current.position.z = Math.sin(t * 0.7) * radius * 0.3;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={4}
        toneMapped={false}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 40 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3,
      ],
      size: Math.random() * 0.015 + 0.005,
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  return (
    <>
      {particles.map((p, i) => (
        <FloatingDot key={i} {...p} />
      ))}
    </>
  );
}

function FloatingDot({ pos, size, speed, offset }) {
  const ref = useRef();
  const originalY = pos[1];
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = originalY + Math.sin(clock.getElapsedTime() * speed + offset) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color="#a78bfa"
        emissive="#a78bfa"
        emissiveIntensity={2}
        toneMapped={false}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default function HeroScene() {
  const groupRef = useRef();
  const { viewport } = useThree();

  useFrame(({ pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.4,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.25,
        0.04
      );
    }
  });

  const scale = viewport.width > 6 ? 1.3 : 0.95;

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 4]} intensity={1.2} color="#a78bfa" distance={15} />
      <pointLight position={[-3, -2, 3]} intensity={0.6} color="#38bdf8" distance={12} />
      <pointLight position={[0, -4, 2]} intensity={0.4} color="#6366f1" distance={10} />

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.4}>
        <group ref={groupRef} scale={scale}>
          {/* Central distorted sphere — dark metallic */}
          <CoreSphere />

          {/* Glowing orbital rings */}
          <GlowRing radius={1.5} color="#a78bfa" speed={0.15} axis="y" />
          <GlowRing radius={1.7} color="#38bdf8" speed={-0.1} axis="x" />
          <GlowRing radius={1.9} color="#6366f1" speed={0.08} axis="z" />

          {/* Orbiting nodes */}
          <OrbitingNode radius={1.5} speed={0.4} offset={0} color="#a78bfa" size={0.05} />
          <OrbitingNode radius={1.7} speed={-0.3} offset={2} color="#38bdf8" size={0.04} />
          <OrbitingNode radius={1.9} speed={0.2} offset={4} color="#c084fc" size={0.035} />
          <OrbitingNode radius={1.3} speed={-0.5} offset={1} color="#818cf8" size={0.045} />
          <OrbitingNode radius={1.6} speed={0.35} offset={3} color="#22d3ee" size={0.03} />

          {/* Background floating particles */}
          <FloatingParticles count={50} />
        </group>
      </Float>
    </>
  );
}
