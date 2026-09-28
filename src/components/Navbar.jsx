import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { SECTIONS, SOCIAL_LINKS } from '../data/content';
import { on, store, scrollToId, activeSectionIndex } from '../lib/store';
import { EASE } from './motion';

const LINKS = SECTIONS.filter((s) => s.id !== 'hero');

export default function Navbar({ enabled3D, can3D, onToggle3D }) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = 0;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = store.scroll;
      setScrolled(y > 40);
      setHidden(y > 240 && y > last + 2 && !open);
      if (y < last - 2) setHidden(false);
      last = y;
      setActive(activeSectionIndex());
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const offs = [on('scroll', schedule), on('anchors', schedule)];
    return () => {
      offs.forEach((f) => f());
      cancelAnimationFrame(raf);
    };
  }, [open]);

  useEffect(() => {
    if (open) store.lenis?.stop();
    else store.lenis?.start();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    // let the menu close before scrolling
    setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'nav--solid' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -90 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <a href="#hero" className="nav-logo" onClick={go('hero')} aria-label="Back to top">
          Y<span className="accent">.</span>A
        </a>

        <nav className="nav-links" aria-label="Sections">
          {LINKS.map((s) => {
            const idx = SECTIONS.findIndex((x) => x.id === s.id);
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={go(s.id)}
                className={active === idx ? 'is-active' : ''}
                aria-current={active === idx ? 'true' : undefined}
              >
                {s.label}
              </a>
            );
          })}
        </nav>

        <div className="nav-actions">
          {can3D && (
            <button
              type="button"
              className={`toggle-3d ${enabled3D ? 'on' : ''}`}
              onClick={onToggle3D}
              aria-pressed={enabled3D}
              title={enabled3D ? 'Turn off 3D (saves battery)' : 'Turn on 3D'}
            >
              <Icon name="box" size={15} />
              <span>3D</span>
            </button>
          )}
          {SOCIAL_LINKS.resume && (
            <a className="btn btn--small btn--primary nav-resume" href={SOCIAL_LINKS.resume} target="_blank" rel="noopener noreferrer">
              <Icon name="file" size={15} /> Resume
            </a>
          )}
          <button
            type="button"
            className={`burger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 36px)' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {SECTIONS.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={go(s.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: EASE }}
                >
                  <span className="mm-index">0{i + 1}</span>
                  {s.label}
                </motion.a>
              ))}
            </nav>
            <div className="mm-social">
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Icon name="github" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Icon name="linkedin" />
              </a>
              {SOCIAL_LINKS.email && (
                <a href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email">
                  <Icon name="mail" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
