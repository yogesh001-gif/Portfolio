import { useEffect, useRef, useState } from 'react';
import { SECTIONS } from '../data/content';
import { on, store, stationFloat, scrollToId } from '../lib/store';

/* Top progress bar + side "chapter" rail. */
export function ScrollUI() {
  const bar = useRef(null);
  const fill = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - store.vh;
      const p = max > 0 ? store.scroll / max : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      const f = stationFloat();
      if (fill.current) fill.current.style.transform = `scaleY(${f / (SECTIONS.length - 1)})`;
      setActive(Math.round(f));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const offs = [on('scroll', schedule), on('anchors', schedule)];
    schedule();
    return () => {
      offs.forEach((f) => f());
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span ref={bar} />
      </div>
      <nav className="rail" aria-label="Chapters">
        <span className="rail-track" aria-hidden="true">
          <span ref={fill} />
        </span>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`rail-dot ${active === i ? 'is-active' : ''} ${active > i ? 'is-past' : ''}`}
            onClick={() => scrollToId(s.id)}
            aria-label={`Go to ${s.label}`}
            aria-current={active === i ? 'true' : undefined}
          >
            <span className="rail-label">
              <span className="rail-num">0{i + 1}</span> {s.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  );
}

/* Custom cursor for mouse users: a dot + a trailing ring that
   grows over links and shows labels over 3D objects. */
export function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [label, setLabel] = useState(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;
    const move = (e) => {
      if (e.pointerType !== 'mouse') return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      const interactive = e.target.closest?.('a, button, input, textarea, [role="button"], .cert-card');
      setHovering(!!interactive);
    };
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => {
      target.x = target.y = -100;
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);
    const off = on('cursor', (payload) => setLabel(payload?.label ?? null));
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
      off();
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <span ref={dot} className="cursor-dot" />
      <span ref={ring} className={`cursor-ring ${hovering ? 'is-hover' : ''} ${label ? 'is-label' : ''}`}>
        <span className="cursor-text">{label ? `Open ${label}` : ''}</span>
      </span>
    </div>
  );
}
