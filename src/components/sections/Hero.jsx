import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../Icon';
import { SplitReveal, EASE } from '../motion';
import { PROFILE, ROLES, SOCIAL_LINKS, PROJECTS, CERTIFICATIONS, TECH_STACK, ACADEMIC_PROFILE } from '../../data/content';
import { getAcademicProgress } from '../../lib/academic';
import { scrollToId, store } from '../../lib/store';

function RoleTicker({ play }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play || store.reduced) return undefined;
    const id = setInterval(() => setI((v) => (v + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, [play]);
  // All roles stacked in a column; the column slides up one row at a time.
  return (
    <span className="ticker">
      <span className="ticker-track" style={{ transform: `translateY(${-i * 1.3}em)` }}>
        {ROLES.map((r, idx) => (
          <span key={r} className={`ticker-word ${idx === i ? 'is-active' : ''}`} aria-hidden={idx !== i}>
            {r}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero({ ready }) {
  const academic = getAcademicProgress(ACADEMIC_PROFILE);
  const stats = [
    { n: PROJECTS.length + 1, label: 'Projects built' },
    { n: CERTIFICATIONS.length, label: 'Certifications' },
    { n: TECH_STACK.length, label: 'Technologies' },
  ];
  const fade = (d) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.9, ease: EASE, delay: d },
  });

  return (
    <section id="hero" data-station className="section hero">
      <div className="container">
        <div className="hero-copy pe">
          <motion.p className="eyebrow" {...fade(0.1)}>
            <span className="pulse-dot" aria-hidden="true" />
            {ACADEMIC_PROFILE.program} · {ACADEMIC_PROFILE.collegeShort} · {academic.label}
          </motion.p>

          <h1 className="display">
            <SplitReveal text={PROFILE.firstName} play={ready} delay={0.15} className="display-line" />
            <SplitReveal text={PROFILE.lastName} play={ready} delay={0.28} className="display-line grad-text" />
          </h1>

          <motion.p className="hero-role" {...fade(0.55)}>
            <span className="muted">I’m a</span> <RoleTicker play={ready} />
          </motion.p>

          <motion.p className="lead" {...fade(0.65)}>
            {PROFILE.tagline} I study Electronics &amp; Communication at MAIT and build full-stack web apps and
            ESP32-powered hardware.
          </motion.p>

          <motion.div className="cta-row" {...fade(0.75)}>
            <button type="button" className="btn btn--primary magnetic" onClick={() => scrollToId('projects')}>
              Explore my work <Icon name="arrowDown" size={16} />
            </button>
            {SOCIAL_LINKS.resume && (
              <a className="btn btn--ghost" href={SOCIAL_LINKS.resume} target="_blank" rel="noopener noreferrer">
                <Icon name="file" size={16} /> Resume
              </a>
            )}
            <a className="icon-btn" href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Icon name="github" />
            </a>
            <a className="icon-btn" href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Icon name="linkedin" />
            </a>
          </motion.div>

          <motion.ul className="stats" {...fade(0.9)}>
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{String(s.n).padStart(2, '0')}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <motion.button
        type="button"
        className="scroll-cue"
        onClick={() => scrollToId('about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        <span className="mouse" aria-hidden="true">
          <span />
        </span>
        Scroll to explore
      </motion.button>
    </section>
  );
}
