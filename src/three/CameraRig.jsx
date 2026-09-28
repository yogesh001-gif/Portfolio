import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { STATIONS } from './stations';
import { store, stationFloat } from '../lib/store';

const UP = new THREE.Vector3(0, 1, 0);
const BASE_FOV = 40;

// Slow near stations, fast in between — the camera "settles" at each section.
const smootherstep = (x) => x * x * x * (x * (x * 6 - 15) + 10);

function keyframe(station, mobile, aspect) {
  const m = mobile && station.mobile ? { ...station, ...station.mobile } : station;
  const c = new THREE.Vector3(...station.center);
  const pos = c.clone().add(new THREE.Vector3(...m.offset));
  const target = c.clone().add(new THREE.Vector3(0, m.lookY || 0, 0));

  const shift = mobile ? station.mobile?.shift ?? 0 : station.shift;
  if (shift) {
    const dist = pos.distanceTo(target);
    const halfW = dist * Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) * aspect;
    const dir = target.clone().sub(pos).normalize();
    const right = dir.clone().cross(UP).normalize();
    const delta = right.multiplyScalar(-shift * halfW);
    pos.add(delta);
    target.add(delta);
  }
  return { pos, target };
}

export default function CameraRig() {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const first = useRef(true);

  const aspect = size.width / size.height;
  const mobile = size.width < 768 || aspect < 0.9;
  const frames = useMemo(() => STATIONS.map((s) => keyframe(s, mobile, aspect)), [mobile, aspect]);

  useFrame((state, delta) => {
    const f = Math.min(frames.length - 1, Math.max(0, stationFloat()));
    const i0 = Math.floor(f);
    const i1 = Math.min(i0 + 1, frames.length - 1);
    const raw = f - i0;
    const k = smootherstep(raw);

    tmpPos.lerpVectors(frames[i0].pos, frames[i1].pos, k);
    tmpTarget.lerpVectors(frames[i0].target, frames[i1].target, k);

    // Pull back in the middle of a flight so transitions feel like a real move.
    const arc = Math.sin(Math.PI * raw);
    tmpPos.z += arc * 3.2;
    tmpPos.x += arc * (i0 % 2 === 0 ? 1.4 : -1.4);

    // Gentle pointer parallax (disabled for reduced motion / touch).
    if (!store.reduced) {
      tmpPos.x += store.pointer.x * 0.35;
      tmpPos.y += store.pointer.y * 0.22;
    }

    if (first.current) {
      camera.position.copy(tmpPos);
      look.current.copy(tmpTarget);
      first.current = false;
    } else {
      const smooth = store.reduced ? 0.08 : 0.28;
      easing.damp3(camera.position, tmpPos, smooth, delta);
      easing.damp3(look.current, tmpTarget, smooth, delta);
    }
    camera.lookAt(look.current);
    // slight cinematic roll mid-flight
    if (!store.reduced) camera.rotateZ(arc * (i0 % 2 === 0 ? -0.06 : 0.06));

    const targetFov = BASE_FOV + arc * 7 + Math.min(6, Math.abs(store.velocity) * 0.12);
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4, delta);
    camera.updateProjectionMatrix();

    state.scene.userData.station = f;
  });

  return null;
}
