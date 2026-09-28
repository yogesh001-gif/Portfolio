export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isTouch() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export function isSmallScreen() {
  return typeof window !== 'undefined' && window.innerWidth < 768;
}

/* 'high' on desktops with decent hardware, 'low' on phones / weak machines. */
export function detectQuality() {
  if (typeof navigator === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8;
  if (isSmallScreen() || isTouch() || cores <= 4 || memory <= 4) return 'low';
  return 'high';
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const PREF_KEY = 'ya-3d-enabled';

export function read3DPref() {
  try {
    const v = window.localStorage.getItem(PREF_KEY);
    return v === null ? null : v === '1';
  } catch {
    return null;
  }
}

export function write3DPref(enabled) {
  try {
    window.localStorage.setItem(PREF_KEY, enabled ? '1' : '0');
  } catch {
    /* storage unavailable — ignore */
  }
}
