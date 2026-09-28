import Icon from '../Icon';
import { Reveal, SplitReveal, TiltCard } from '../motion';
import { PROJECTS } from '../../data/content';

function ProjectLinks({ project }) {
  if (!project.live && !project.github) return null;
  return (
    <div className="card-links">
      {project.live && (
        <a className="btn btn--small btn--primary" href={project.live} target="_blank" rel="noopener noreferrer">
          Live site <Icon name="arrowUpRight" size={14} />
        </a>
      )}
      {project.github && (
        <a className="btn btn--small btn--ghost" href={project.github} target="_blank" rel="noopener noreferrer">
          <Icon name="github" size={14} /> Code
        </a>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" data-station className="section projects">
      <div className="container">
        <header className="section-head center pe">
          <p className="eyebrow">02 — Selected work</p>
          <SplitReveal as="h2" className="h2 xl" text="Things I’ve built." />
          <Reveal as="p" className="body muted" delay={0.1}>
            Web products that solve real problems — scroll to spin through them.
          </Reveal>
        </header>

        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 0.1} className="pe">
              <TiltCard className="project-card panel">
                <div className="project-thumb" style={{ '--c1': p.colors[0], '--c2': p.colors[1] }}>
                  <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
                  <Icon name={p.icon} size={42} strokeWidth={1.4} />
                </div>
                <div className="project-body">
                  <p className="meta">
                    {p.kind} <span aria-hidden="true">·</span> {p.year}
                  </p>
                  <h3 className="h3">{p.title}</h3>
                  <p className="body small">{p.description}</p>
                  <ul className="ticks">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="tags">
                    {p.tech.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <ProjectLinks project={p} />
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
