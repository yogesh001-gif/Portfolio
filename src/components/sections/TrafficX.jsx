import { useEffect, useState } from 'react';
import Icon from '../Icon';
import { Reveal, SplitReveal } from '../motion';
import { HARDWARE_PROJECT as P } from '../../data/content';
import { store } from '../../lib/store';

/* Live readout from the 3D simulation. */
function LiveReadout() {
  const [t, setT] = useState(store.traffic);
  useEffect(() => {
    const id = setInterval(() => setT({ ...store.traffic }), 250);
    return () => clearInterval(id);
  }, []);
  const light = (axis) => (t.green === axis ? (t.phase === 'yellow' ? 'yellow' : 'green') : 'red');
  return (
    <div className="readout" aria-label="Live simulation readout">
      <p className="readout-title">
        <span className="pulse-dot" aria-hidden="true" /> Live simulation
      </p>
      <div className="readout-grid">
        {['ns', 'ew'].map((axis) => (
          <div key={axis} className="readout-cell">
            <span className={`lamp lamp--${light(axis)}`} aria-hidden="true" />
            <span className="readout-label">{axis === 'ns' ? 'North–South' : 'East–West'}</span>
            <span className="readout-value tabular">
              {t[axis]} <small>waiting</small>
            </span>
          </div>
        ))}
      </div>
      <p className="readout-foot tabular">
        Green → {t.green === 'ns' ? 'North–South' : 'East–West'} · {Math.max(0, t.remaining || 0).toFixed(1)}s left
      </p>
    </div>
  );
}

export default function TrafficX({ enabled3D }) {
  return (
    <section id="trafficx" data-station className="section trafficx">
      <div className="container">
        <div className="traffic-card panel pe">
          <p className="eyebrow">
            <Icon name="cpu" size={14} /> 03 — Featured hardware build
          </p>
          <SplitReveal as="h2" className="h2 xl" text={P.title} />
          <Reveal as="p" className="subtitle" delay={0.05}>
            {P.subtitle}
          </Reveal>
          <Reveal as="p" className="body" delay={0.1}>
            {P.description}
          </Reveal>

          <Reveal as="ol" className="steps" delay={0.15}>
            {P.steps.map((s, i) => (
              <li key={s.title}>
                <span className="step-num">0{i + 1}</span>
                <div>
                  <p className="step-title">{s.title}</p>
                  <p className="step-text">{s.text}</p>
                </div>
              </li>
            ))}
          </Reveal>

          {enabled3D && (
            <Reveal delay={0.2}>
              <LiveReadout />
            </Reveal>
          )}

          <Reveal className="tags" delay={0.25}>
            {P.tech.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </Reveal>

          {(P.github || P.live) && (
            <div className="card-links">
              {P.live && (
                <a className="btn btn--small btn--primary" href={P.live} target="_blank" rel="noopener noreferrer">
                  Demo <Icon name="arrowUpRight" size={14} />
                </a>
              )}
              {P.github && (
                <a className="btn btn--small btn--ghost" href={P.github} target="_blank" rel="noopener noreferrer">
                  <Icon name="github" size={14} /> Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
