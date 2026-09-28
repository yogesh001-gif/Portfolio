import { useRef } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/* Word-by-word masked reveal for headings.
   If `play` is given, it animates when play becomes true; otherwise on scroll into view.
   (The in-view trigger lives on the parent: the words themselves start clipped by
   their masks, so an observer on them would never fire.) */
export function SplitReveal({ text, as = 'span', className = '', delay = 0, play, stagger = 0.06 }) {
  const Comp = motion[as];
  const words = text.split(' ');
  const controlled = play !== undefined;
  const parent = { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const child = {
    hidden: { y: '110%', rotate: 4 },
    visible: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: EASE } },
  };
  return (
    <Comp
      className={`split ${className}`}
      aria-label={text}
      variants={parent}
      initial="hidden"
      {...(controlled
        ? { animate: play ? 'visible' : 'hidden' }
        : { whileInView: 'visible', viewport: { once: true, amount: 0.3 } })}
    >
      {words.map((w, i) => (
        <span className="split-mask" key={`${w}-${i}`} aria-hidden="true">
          <motion.span className="split-word" variants={child}>
            {w}
          </motion.span>
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Comp>
  );
}

/* Fade + rise + un-blur when scrolled into view. */
export function Reveal({ children, delay = 0, y = 36, className = '', as = 'div', ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* Card that tilts toward the pointer with a moving glare. */
export function TiltCard({ children, className = '', max = 7, ...rest }) {
  const ref = useRef(null);
  const frame = useRef(0);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--rx', `${(0.5 - py) * max}deg`);
      el.style.setProperty('--ry', `${(px - 0.5) * max}deg`);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave} {...rest}>
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  );
}

export { EASE };
