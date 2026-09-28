import Icon from '../Icon';
import { Reveal, SplitReveal } from '../motion';
import { EDUCATION, INTERESTS, PROFILE, ACADEMIC_PROFILE } from '../../data/content';
import { getAcademicProgress } from '../../lib/academic';
import { scrollToId } from '../../lib/store';
import { isTouch } from '../../lib/device';

const QUICK = [
  { id: 'projects', label: 'Work', icon: 'eye' },
  { id: 'trafficx', label: 'TrafficX', icon: 'cpu' },
  { id: 'certificates', label: 'Certificates', icon: 'award' },
  { id: 'contact', label: 'Contact', icon: 'send' },
];

export default function About({ enabled3D }) {
  const academic = getAcademicProgress(ACADEMIC_PROFILE);
  return (
    <section id="about" data-station className="section about">
      <div className="container">
        <div className="about-card panel pe">
          <p className="eyebrow">01 — About</p>
          <SplitReveal as="h2" className="h2" text="Screens and circuit boards." />
          <Reveal as="p" className="body" delay={0.1}>
            I’m {PROFILE.firstName}, an ECE student at {ACADEMIC_PROFILE.collegeShort} who likes building things end to end — from a
            React front-end and a Node or Spring Boot API, down to an ESP32 reading real sensors. I care about products that
            are useful, fast and a little bit delightful.
          </Reveal>

          <Reveal className="edu" delay={0.15}>
            {EDUCATION.map((e) => (
              <div className="edu-item" key={e.title}>
                <span className="edu-icon">
                  <Icon name="cap" size={16} />
                </span>
                <div>
                  <p className="edu-title">{e.title}</p>
                  <p className="edu-meta">
                    {e.place} · {e.date}
                    {e.current && !academic.graduated && <span className="badge">{academic.label}</span>}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="chips" delay={0.2}>
            {INTERESTS.map((i) => (
              <span className="chip" key={i}>
                {i}
              </span>
            ))}
          </Reveal>

          <Reveal className="desk-hint" delay={0.25}>
            {enabled3D && (
              <p>
                <Icon name="pointer" size={16} />
                {isTouch() ? 'Tap' : 'Click'} anything glowing on my desk to jump there — or use these:
              </p>
            )}
            <div className="quick-links">
              {QUICK.map((q) => (
                <button key={q.id} type="button" className="quick" onClick={() => scrollToId(q.id)}>
                  <Icon name={q.icon} size={15} /> {q.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
