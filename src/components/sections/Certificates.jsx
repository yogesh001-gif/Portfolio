import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../Icon';
import { Reveal, SplitReveal, EASE } from '../motion';
import { CERTIFICATIONS } from '../../data/content';
import { store } from '../../lib/store';

const FILTERS = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'ai', label: 'AI', match: (c) => ['AI', 'Learning path'].includes(c.tag) },
  { id: 'prod', label: 'Productivity', match: (c) => c.tag === 'Productivity' },
  { id: 'code', label: 'Programming', match: (c) => ['Programming', 'Web'].includes(c.tag) },
  { id: 'events', label: 'Events', match: (c) => c.tag === 'Participation' },
];

function CertificateModal({ cert, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    store.lenis?.stop();
    document.body.classList.add('modal-open');
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      store.lenis?.start();
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-title"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="modal-head">
          <div>
            <p className="meta">
              {cert.issuer} · {cert.date}
            </p>
            <h3 id="cert-title" className="h3">
              {cert.title}
            </h3>
          </div>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <img className="modal-img" src={`/certificates/${cert.id}.webp`} alt={`${cert.title} certificate`} />
        <div className="modal-foot">
          <a className="btn btn--small btn--ghost" href={encodeURI(cert.original)} target="_blank" rel="noopener noreferrer">
            Open original <Icon name="external" size={14} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Certificates() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const list = useMemo(() => CERTIFICATIONS.filter(FILTERS.find((f) => f.id === filter).match), [filter]);

  return (
    <section id="certificates" data-station className="section certificates">
      <div className="container">
        <header className="section-head center pe">
          <p className="eyebrow">05 — Always learning</p>
          <SplitReveal as="h2" className="h2 xl" text="Certificates." />
          <Reveal className="filters" delay={0.1} role="tablist" aria-label="Filter certificates">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`filter ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
                {filter === f.id && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ duration: 0.4, ease: EASE }} />}
              </button>
            ))}
          </Reveal>
        </header>

        <motion.div layout className="cert-grid">
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.button
                layout
                key={c.id}
                type="button"
                className="cert-card panel pe"
                onClick={() => setOpen(c)}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="cert-thumb">
                  <img src={`/certificates/${c.id}-thumb.webp`} alt="" loading="lazy" decoding="async" width="640" height="480" />
                  <span className="cert-view">
                    <Icon name="eye" size={16} /> View
                  </span>
                </span>
                <span className="cert-info">
                  <span className="cert-title">{c.title}</span>
                  <span className="meta">
                    {c.issuer} · {c.date}
                  </span>
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {createPortal(<AnimatePresence>{open && <CertificateModal cert={open} onClose={close} />}</AnimatePresence>, document.body)}
    </section>
  );
}
