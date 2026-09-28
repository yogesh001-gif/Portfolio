import * as THREE from 'three';

const cache = new Map();

/* Soft round sprite used for glows, stars and halos. */
export function glowTexture() {
  if (cache.has('glow')) return cache.get('glow');
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.18, 'rgba(255,255,255,0.75)');
  grd.addColorStop(0.45, 'rgba(255,255,255,0.18)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  cache.set('glow', t);
  return t;
}

/* Text rendered onto a canvas — no font files or CDN needed. */
export function textTexture(text, {
  font = '600 64px "Space Grotesk", system-ui, sans-serif',
  color = '#f0f0f5',
  padding = 24,
  bg = null,
  radius = 28,
  border = null,
} = {}) {
  const key = `txt:${text}:${font}:${color}:${bg}:${border}`;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  g.font = font;
  const m = g.measureText(text);
  const h = parseInt(font.match(/(\d+)px/)[1], 10);
  c.width = Math.ceil(m.width + padding * 2);
  c.height = Math.ceil(h * 1.35 + padding * 2);
  g.font = font;
  if (bg) {
    g.fillStyle = bg;
    roundRect(g, 1, 1, c.width - 2, c.height - 2, radius);
    g.fill();
    if (border) {
      g.strokeStyle = border;
      g.lineWidth = 3;
      g.stroke();
    }
  }
  g.fillStyle = color;
  g.textBaseline = 'middle';
  g.fillText(text, padding, c.height / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  t.userData = { aspect: c.width / c.height };
  cache.set(key, t);
  return t;
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/* Project "screen" for the floating panels. */
export function projectTexture(project, index) {
  const key = `proj:${project.id}`;
  if (cache.has(key)) return cache.get(key);
  const W = 1024;
  const H = 640;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const [a, b] = project.colors;
  const grd = g.createLinearGradient(0, 0, W, H);
  grd.addColorStop(0, '#0b0b14');
  grd.addColorStop(0.55, a);
  grd.addColorStop(1, b);
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);
  // dot grid
  g.fillStyle = 'rgba(255,255,255,0.08)';
  for (let x = 20; x < W; x += 32) for (let y = 20; y < H; y += 32) g.fillRect(x, y, 2, 2);
  // window chrome
  g.fillStyle = 'rgba(0,0,0,0.35)';
  g.fillRect(0, 0, W, 56);
  ['#f87171', '#fbbf24', '#4ade80'].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(36 + i * 30, 28, 9, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.font = '500 24px "Manrope", system-ui, sans-serif';
  g.fillText(`${project.id}.app`, 140, 36);
  // big number
  g.fillStyle = 'rgba(255,255,255,0.12)';
  g.font = '700 300px "Space Grotesk", system-ui, sans-serif';
  g.fillText(String(index + 1).padStart(2, '0'), W - 420, H - 60);
  // title
  g.fillStyle = '#ffffff';
  g.font = '700 76px "Space Grotesk", system-ui, sans-serif';
  wrapText(g, project.title, 64, 200, W - 128, 86);
  g.fillStyle = 'rgba(255,255,255,0.75)';
  g.font = '500 32px "Manrope", system-ui, sans-serif';
  g.fillText(project.kind, 64, H - 72);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

function wrapText(g, text, x, y, maxW, lh) {
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (g.measureText(test).width > maxW && line) {
      g.fillText(line, x, yy);
      line = w;
      yy += lh;
    } else line = test;
  }
  g.fillText(line, x, yy);
}
