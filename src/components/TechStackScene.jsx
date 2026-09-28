import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating tech spheres with colored glow — no external fonts needed ── */

function TechNode({ position, color, index }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const originalPos = useMemo(() => new THREE.Vector3(...position), [position]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y =
        originalPos.y + Math.sin(t * 0.4 + index * 1.5) * 0.2;
      groupRef.current.position.x =
        originalPos.x + Math.cos(t * 0.25 + index * 0.9) * 0.1;
    }
    if (glowRef.current) {
      const t = clock.getElapsedTime();
      glowRef.current.scale.setScalar(1 + Math.sin(t * 0.8 + index) * 0.1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow sphere */}
      <mesh ref={glowRef} scale={1.4}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Main sphere */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.15}
          envMapIntensity={2}
        />
      </mesh>
      {/* Inner bright core */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function ConnectionLine({ startPos, endPos }) {
  const ref = useRef();
  const geometry = useMemo(() => {
    const pts = [new THREE.Vector3(...startPos), new THREE.Vector3(...endPos)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [startPos, endPos]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.06 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#a78bfa" transparent opacity={0.08} />
    </line>
  );
}

export default function TechStackScene({ techItems }) {
  const groupRef = useRef();

  // Arrange in a honeycomb/organic layout
  const positions = useMemo(() => {
    const cols = 4;
    const spacingX = 1.4;
    const spacingY = 1.3;
    return techItems.map((_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = (cols - 1) * spacingX * -0.5;
      const offsetY = (Math.ceil(techItems.length / cols) - 1) * spacingY * 0.5;
      return [
        col * spacingX + offsetX + (row % 2 === 1 ? 0.7 : 0),
        -row * spacingY + offsetY,
        (Math.random() - 0.5) * 0.8,
      ];
    });
  }, [techItems]);

  // Connect nearby nodes
  const connections = useMemo(() => {
    const conns = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = new THREE.Vector3(...positions[i]).distanceTo(
          new THREE.Vector3(...positions[j])
        );
        if (dist < 2) {
          conns.push([i, j]);
        }
      }
    }
    return conns;
  }, [positions]);

  useFrame(({ pointer }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.1,
        0.03
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.06,
        0.03
      );
    }
  });

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#a78bfa" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#38bdf8" />

      <group ref={groupRef}>
        {techItems.map((item, i) => (
          <TechNode
            key={item.name}
            position={positions[i]}
            color={item.color}
            index={i}
          />
        ))}

        {connections.map(([a, b], i) => (
          <ConnectionLine
            key={`conn-${i}`}
            startPos={positions[a]}
            endPos={positions[b]}
          />
        ))}
      </group>
    </>
  );
}
