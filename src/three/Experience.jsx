import { Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import CameraRig from './CameraRig';
import { Starfield, JourneyPath } from './Atmosphere';
import Core from './Core';
import Desk from './Desk';
import ProjectRing from './ProjectRing';
import Intersection from './Intersection';
import Constellation from './Constellation';
import { CertRingTextured, Ring } from './CertRing';
import Beacon from './Beacon';
import { STATIONS, PALETTE } from './stations';
import { store, emit } from '../lib/store';

const at = (id) => STATIONS.find((s) => s.id === id).center;

function FirstFrame() {
  const [done, setDone] = useState(false);
  useFrame(() => {
    if (!done) {
      setDone(true);
      emit('scene-ready');
    }
  });
  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 6]} intensity={1.1} />
      <pointLight position={[-4, 2, 4]} intensity={40} distance={20} color={PALETTE.violet} />
      <pointLight position={[4, -18, 5]} intensity={30} distance={16} color={PALETTE.cyan} />
      <pointLight position={[-3, -52, 5]} intensity={35} distance={16} color={PALETTE.violet} />
      <pointLight position={[3, -88, 6]} intensity={30} distance={16} color={PALETTE.amber} />
      <pointLight position={[-3, -106, 5]} intensity={35} distance={16} color={PALETTE.cyan} />
    </>
  );
}

/* Procedural studio reflections — no HDR download needed. */
function Studio() {
  return (
    <Environment resolution={128} frames={1}>
      <color attach="background" args={['#0b0b14']} />
      <Lightformer form="rect" intensity={3} color={PALETTE.violet} position={[-5, 2, 3]} scale={[4, 6, 1]} />
      <Lightformer form="rect" intensity={2.5} color={PALETTE.cyan} position={[5, -1, 2]} scale={[4, 6, 1]} />
      <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 5, -4]} scale={3} />
      <Lightformer form="rect" intensity={1} color="#ffffff" position={[0, -5, 3]} scale={[10, 2, 1]} />
    </Environment>
  );
}

export default function Experience() {
  const low = store.quality === 'low';
  const [dpr, setDpr] = useState(low ? 1 : 1.5);

  return (
    <Canvas
      className="webgl"
      dpr={dpr}
      gl={{ antialias: !low, powerPreference: 'high-performance', alpha: false, stencil: false }}
      camera={{ fov: 40, near: 0.1, far: 80, position: [0, 0, 8] }}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(low ? 1 : 1.5)} />
      <color attach="background" args={[PALETTE.bg]} />
      <fog attach="fog" args={[PALETTE.bg, 11, 30]} />
      <Lights />
      <Studio />
      <CameraRig />
      <Starfield count={low ? 1400 : 4200} />
      <JourneyPath />

      <Core position={at('hero')} />
      <Suspense fallback={null}>
        <Desk position={at('about')} />
      </Suspense>
      <ProjectRing position={at('projects')} />
      <Intersection position={at('trafficx')} />
      <Constellation position={at('skills')} />
      <Suspense fallback={<Ring position={at('certificates')} />}>
        <CertRingTextured position={at('certificates')} />
      </Suspense>
      <Beacon position={at('contact')} />
      <FirstFrame />
    </Canvas>
  );
}
