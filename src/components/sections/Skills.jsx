import { Reveal, SplitReveal } from '../motion';
import { TECH_STACK, TECH_CATEGORIES } from '../../data/content';
import { store } from '../../lib/store';

export default function Skills() {
  const set = (name) => () => {
    store.hoveredSkill = name;
  };
  return (
    <section id="skills" data-station className="section skills">
      <div className="container">
        <div className="skills-col pe">
          <p className="eyebrow">04 — Toolkit</p>
          <SplitReveal as="h2" className="h2 xl" text="My tech constellation." />
          <Reveal as="p" className="body muted" delay={0.1}>
            Hover a skill to find its star.
          </Reveal>
          <div className="skill-groups" onMouseLeave={set(null)}>
            {TECH_CATEGORIES.map((cat, ci) => (
              <Reveal key={cat} className="skill-group" delay={0.05 * ci}>
                <h3 className="kicker">{cat}</h3>
                <div className="chips">
                  {TECH_STACK.filter((t) => t.category === cat).map((t) => (
                    <button
                      type="button"
                      key={t.name}
                      className="chip chip--skill"
                      style={{ '--dot': t.color }}
                      onMouseEnter={set(t.name)}
                      onFocus={set(t.name)}
                      onBlur={set(null)}
                    >
                      <span className="chip-dot" aria-hidden="true" />
                      {t.name}
                    </button>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
