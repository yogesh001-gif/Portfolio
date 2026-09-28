import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Glow } from './Atmosphere';
import { PALETTE, STATION_INDEX } from './stations';
import { store } from '../lib/store';

/* A live mini-simulation of TrafficX: cars queue at red lights,
   ultrasonic sensors ping each approach, and the ESP32 gives the
   busier road a longer green. */

const LANE = 0.42;
const STOP = -1.15; // stop line on the travel coordinate
const HALF = 5.6; // road half-length
const CAR_LEN = 0.62;
const VMAX = 1.7;
const MIN_GREEN = 3;
const MAX_GREEN = 9;
const YELLOW = 1.2;

const LANES = [
  { axis: 'ns', dir: 1 },
  { axis: 'ns', dir: -1 },
  { axis: 'ew', dir: 1 },
  { axis: 'ew', dir: -1 },
];

const CAR_COLORS = ['#a78bfa', '#38bdf8', '#f472b6', '#e5e7eb', '#fbbf24', '#34d399', '#818cf8', '#fb7185'];

function laneTransform(lane, s, out) {
  const { axis, dir } = lane;
  if (axis === 'ns') out.set(dir === 1 ? -LANE : LANE, 0, dir * s);
  else out.set(dir * s, 0, dir === 1 ? LANE : -LANE);
  return out;
}

function laneYaw(lane) {
  if (lane.axis === 'ns') return lane.dir === 1 ? 0 : Math.PI;
  return lane.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
}

function Car({ color, carRef }) {
  return (
    <group ref={carRef}>
      <RoundedBox args={[0.34, 0.16, CAR_LEN]} radius={0.05} smoothness={3} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.12, 0.32]} radius={0.04} smoothness={3} position={[0, 0.22, -0.03]}>
        <meshStandardMaterial color="#0c0c16" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      {[-0.1, 0.1].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.1, CAR_LEN / 2 + 0.005]}>
            <boxGeometry args={[0.07, 0.035, 0.01]} />
            <meshBasicMaterial color="#fffbe6" toneMapped={false} />
          </mesh>
          <mesh position={[x, 0.1, -CAR_LEN / 2 - 0.005]}>
            <boxGeometry args={[0.07, 0.035, 0.01]} />
            <meshBasicMaterial color="#ff3b3b" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <Glow color="#fff7d6" size={0.6} opacity={0.35} position={[0, 0.1, CAR_LEN / 2 + 0.2]} />
    </group>
  );
}

function TrafficLight({ position, rotation, lampRefs }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 1.1, 10]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.3} />
      </mesh>
      <RoundedBox args={[0.18, 0.46, 0.14]} radius={0.03} smoothness={3} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#111119" metalness={0.7} roughness={0.35} />
      </RoundedBox>
      {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
        <mesh key={c} position={[0, 1.39 - i * 0.14, 0.072]} ref={(el) => (lampRefs[i] = el)}>
          <circleGeometry args={[0.045, 20]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Sensor({ position, rotation, pulseRef }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        <meshStandardMaterial color="#2a2a3a" />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.26, 0.12, 0.04]} />
        <meshStandardMaterial color="#123c8c" />
      </mesh>
      {[-0.065, 0.065].map((x) => (
        <mesh key={x} position={[x, 0.52, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 20]} />
          <meshStandardMaterial color="#c9ccd6" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      <mesh ref={pulseRef} position={[0, 0.52, 0.1]}>
        <ringGeometry args={[0.85, 1, 40, 1, -0.6, 1.2]} />
        <meshBasicMaterial color={PALETTE.cyan} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Intersection({ position }) {
  const carRefs = useRef([]);
  const lampRefs = useRef({ ns: [[], []], ew: [[], []] });
  const pulseRefs = useRef([]);
  const dashes = useRef();
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const cars = useMemo(() => {
    const list = [];
    LANES.forEach((lane, li) => {
      for (let k = 0; k < 2; k++) {
        list.push({ lane: li, s: -HALF + k * 2.4 + li * 0.7, v: VMAX * 0.6, color: CAR_COLORS[(li * 2 + k) % CAR_COLORS.length] });
      }
    });
    return list;
  }, []);

  const sim = useRef({ green: 'ns', phase: 'green', timer: 5, nextGreen: 5 });

  // lane dashes
  useEffect(() => {
    const m = new THREE.Matrix4();
    let i = 0;
    for (let s = -HALF + 0.3; s < HALF; s += 0.6) {
      if (Math.abs(s) < 1.3) continue;
      m.makeTranslation(0, 0.022, s);
      dashes.current.setMatrixAt(i++, m);
      m.makeRotationY(Math.PI / 2).setPosition(s, 0.022, 0);
      dashes.current.setMatrixAt(i++, m);
    }
    dashes.current.count = i;
    dashes.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ scene, clock }, rawDelta) => {
    const station = scene.userData.station ?? 0;
    if (Math.abs(station - STATION_INDEX.trafficx) > 1.5) return; // off-screen: pause
    const delta = Math.min(rawDelta, 0.05) * (store.reduced ? 0.5 : 1);
    const S = sim.current;

    // queue length per axis = cars waiting before the stop line
    const queue = { ns: 0, ew: 0 };
    cars.forEach((c) => {
      const lane = LANES[c.lane];
      if (c.s < STOP + 0.05 && c.s > STOP - 3.2 && c.v < 0.5) queue[lane.axis]++;
    });

    // signal controller
    S.timer -= delta;
    if (S.timer <= 0) {
      if (S.phase === 'green') {
        S.phase = 'yellow';
        S.timer = YELLOW;
      } else {
        S.green = S.green === 'ns' ? 'ew' : 'ns';
        S.phase = 'green';
        // adaptive timing: more waiting cars → longer green
        S.timer = THREE.MathUtils.clamp(MIN_GREEN + queue[S.green] * 1.6, MIN_GREEN, MAX_GREEN);
      }
    }
    store.traffic = { ns: queue.ns, ew: queue.ew, green: S.green, phase: S.phase, remaining: S.timer };

    // cars
    cars.forEach((c, idx) => {
      const lane = LANES[c.lane];
      const canGo = S.green === lane.axis && S.phase === 'green';
      let gap = Infinity;
      cars.forEach((o) => {
        if (o !== c && o.lane === c.lane && o.s > c.s) gap = Math.min(gap, o.s - c.s - CAR_LEN - 0.12);
      });
      if (!canGo && c.s < STOP) gap = Math.min(gap, STOP - c.s);
      const desired = gap < 0.05 ? 0 : VMAX * THREE.MathUtils.clamp(gap / 1.4, 0, 1);
      c.v = THREE.MathUtils.damp(c.v, desired, desired < c.v ? 9 : 2.2, delta);
      c.s += c.v * delta;
      if (c.s > HALF + 0.4) {
        c.s = -HALF - Math.random() * 1.5;
        // respawn behind the last car in this lane
        const minS = Math.min(...cars.filter((o) => o !== c && o.lane === c.lane).map((o) => o.s));
        if (minS - c.s < CAR_LEN + 0.4) c.s = minS - CAR_LEN - 0.6;
      }
      const g = carRefs.current[idx];
      if (g) {
        laneTransform(lane, c.s, tmp);
        g.position.copy(tmp);
        g.rotation.y = laneYaw(lane);
        g.visible = Math.abs(c.s) < HALF + 0.3;
      }
    });

    // lamps
    const setLamps = (axis) => {
      const on = S.green === axis ? (S.phase === 'green' ? 2 : 1) : 0;
      lampRefs.current[axis].forEach((lamps) =>
        lamps.forEach((m, i) => {
          if (!m) return;
          const active = i === on;
          m.material.opacity = 1;
          m.material.color.setScalar(1);
          m.material.color.set(['#ef4444', '#f59e0b', '#22c55e'][i]).multiplyScalar(active ? 2.2 : 0.12);
        })
      );
    };
    setLamps('ns');
    setLamps('ew');

    // sensor pings — faster when the lane has a queue
    pulseRefs.current.forEach((p, i) => {
      if (!p) return;
      const axis = LANES[i].axis;
      const rate = 0.9 + queue[axis] * 0.5;
      const t = (clock.elapsedTime * rate + i * 0.25) % 1;
      p.scale.setScalar(0.1 + t * 0.9);
      p.material.opacity = (1 - t) * 0.8;
    });
  });

  // light + sensor placement per approach (on the right-hand kerb before the stop line)
  const approaches = LANES.map((lane) => {
    const p = laneTransform(lane, STOP - 0.2, new THREE.Vector3());
    const side = new THREE.Vector3();
    if (lane.axis === 'ns') side.set(lane.dir === 1 ? -0.55 : 0.55, 0, 0);
    else side.set(0, 0, lane.dir === 1 ? 0.55 : -0.55);
    const yaw = laneYaw(lane) + Math.PI;
    return { light: p.clone().add(side), sensor: laneTransform(lane, STOP - 1.4, new THREE.Vector3()).add(side), yaw };
  });

  return (
    <group position={position}>
      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[6.4, 64]} />
        <meshStandardMaterial color="#0b0b14" roughness={0.9} />
      </mesh>
      <gridHelper args={[12, 24, '#1f1f35', '#15152a']} position={[0, 0, 0]} />
      {/* roads */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[1.7, 0.02, HALF * 2]} />
        <meshStandardMaterial color="#1a1a28" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[HALF * 2, 0.02, 1.7]} />
        <meshStandardMaterial color="#1a1a28" roughness={0.8} />
      </mesh>
      <instancedMesh ref={dashes} args={[null, null, 40]}>
        <boxGeometry args={[0.035, 0.005, 0.26]} />
        <meshBasicMaterial color="#6b6b85" />
      </instancedMesh>
      {/* stop lines */}
      {LANES.map((lane, i) => {
        const p = laneTransform(lane, STOP + 0.05, new THREE.Vector3());
        return (
          <mesh key={i} position={[p.x, 0.022, p.z]} rotation={[0, laneYaw(lane), 0]}>
            <boxGeometry args={[0.72, 0.005, 0.05]} />
            <meshBasicMaterial color="#e5e7eb" />
          </mesh>
        );
      })}

      {approaches.map((a, i) => {
        const axis = LANES[i].axis;
        const slot = LANES[i].dir === 1 ? 0 : 1;
        return (
          <group key={i}>
            <TrafficLight position={a.light} rotation={[0, a.yaw, 0]} lampRefs={lampRefs.current[axis][slot]} />
            <Sensor position={a.sensor} rotation={[0, a.yaw, 0]} pulseRef={(el) => (pulseRefs.current[i] = el)} />
          </group>
        );
      })}

      {cars.map((c, i) => (
        <Car key={i} color={c.color} carRef={(el) => (carRefs.current[i] = el)} />
      ))}

      {/* ESP32 controller box on the corner */}
      <group position={[2.1, 0, 2.1]}>
        <RoundedBox args={[0.7, 0.35, 0.5]} radius={0.05} smoothness={3} position={[0, 0.18, 0]}>
          <meshStandardMaterial color="#141424" metalness={0.6} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.37, 0]}>
          <boxGeometry args={[0.46, 0.02, 0.26]} />
          <meshStandardMaterial color="#0f3d2a" />
        </mesh>
        <mesh position={[0.05, 0.39, 0]}>
          <boxGeometry args={[0.18, 0.02, 0.14]} />
          <meshStandardMaterial color="#c7c7d2" metalness={0.95} roughness={0.15} />
        </mesh>
        <Glow color={PALETTE.violet} size={1.8} opacity={0.4} position={[0, 0.5, 0]} />
      </group>
    </group>
  );
}
