/* A tiny mutable store shared by the DOM and the 3D scene.
   The 3D scene reads it every frame (no React re-renders);
   DOM components can subscribe to named events. */

const listeners = new Map();

export const store = {
  scroll: 0,
  velocity: 0,
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  vw: typeof window !== 'undefined' ? window.innerWidth : 1200,
  anchors: [], // [{ id, top, height }] in document coordinates
  pointer: { x: 0, y: 0 }, // -1..1
  lenis: null,
  reduced: false,
  quality: 'high',
  hoveredSkill: null,
  contactPulse: -100, // clock time of last "message sent" burst
  traffic: { ns: 0, ew: 0, green: 'ns', remaining: 0 },
};

export function emit(event, payload) {
  listeners.get(event)?.forEach((fn) => fn(payload));
}

export function on(event, fn) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(fn);
  return () => listeners.get(event)?.delete(fn);
}

/* Measure every [data-station] section in document coordinates. */
export function measureAnchors() {
  const els = document.querySelectorAll('[data-station]');
  const y = window.scrollY;
  store.vh = window.innerHeight;
  store.vw = window.innerWidth;
  store.anchors = Array.from(els).map((el) => {
    const r = el.getBoundingClientRect();
    return { id: el.id, top: r.top + y, height: r.height };
  });
  emit('anchors');
}

/* Continuous "station" value: integer while a section is centred
   (the camera holds), fractional while travelling between sections. */
export function stationFloat() {
  const a = store.anchors;
  if (!a.length) return 0;
  const vh = store.vh;
  const c = store.scroll + vh * 0.5;
  const hold = (i) => {
    const pad = Math.min(vh * 0.38, a[i].height * 0.5);
    return [a[i].top + pad, a[i].top + a[i].height - pad];
  };
  const [, firstEnd] = hold(0);
  if (c <= firstEnd) return 0;
  for (let i = 0; i < a.length; i++) {
    const [s, e] = hold(i);
    if (c >= s && c <= e) return i;
    if (i < a.length - 1) {
      const [ns] = hold(i + 1);
      if (c > e && c < ns) return i + (c - e) / Math.max(1, ns - e);
    }
  }
  return a.length - 1;
}

/* 0 when the section's top enters the bottom of the viewport,
   1 when its bottom leaves the top. */
export function sectionProgress(id) {
  const s = store.anchors.find((x) => x.id === id);
  if (!s) return 0;
  const t = (store.scroll + store.vh - s.top) / (s.height + store.vh);
  return Math.min(1, Math.max(0, t));
}

export function activeSectionIndex() {
  return Math.round(stationFloat());
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (store.lenis) {
    store.lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: store.reduced ? 'auto' : 'smooth' });
  }
}
