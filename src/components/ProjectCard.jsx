import React from 'react';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Unique gradient thumbnails per project instead of blank space */
const PROJECT_GRADIENTS = {
  'AI Personal Finance Advisor': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
  'Khushi Fashion': 'linear-gradient(135deg, #1c1917 0%, #78350f 40%, #d97706 100%)',
  'Buskiबात': 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)',
  'AWS × MAIT': 'linear-gradient(135deg, #14532d 0%, #166534 40%, #22c55e 100%)',
};

function getProjectIcon(title) {
  if (title.includes('Finance')) return 'fas fa-chart-line';
  if (title.includes('Fashion')) return 'fas fa-shopping-bag';
  if (title.includes('Buski')) return 'fas fa-comments';
  if (title.includes('AWS')) return 'fab fa-aws';
  return 'fas fa-code';
}

export default function ProjectCard({ project, index, children }) {
  const isHardware = project.category === 'hardware';
  const gradient = PROJECT_GRADIENTS[project.title];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className={`group relative rounded-2xl overflow-hidden ${
        isHardware ? 'md:col-span-2' : ''
      }`}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
      }}
      id={`project-card-${index}`}
    >
      {/* Hover glow that follows cursor (static fallback) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(600px circle at 50% 30%, rgba(167,139,250,0.08), transparent 50%)',
        }}
      />

      {isHardware ? (
        /* ── Hardware Card: side-by-side 3D + info ── */
        <div className="relative z-10 flex flex-col md:flex-row">
          {/* 3D canvas area */}
          {children && (
            <div
              className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[380px] relative"
              style={{
                background: 'linear-gradient(180deg, rgba(10,10,15,0.9) 0%, rgba(15,15,26,0.95) 100%)',
              }}
            >
              {children}
              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-black/40 text-text-muted backdrop-blur-sm">
                  <i className="fas fa-hand-pointer mr-1" />
                  Drag to rotate
                </span>
              </div>
            </div>
          )}

          <div className="p-6 lg:p-8 flex flex-col gap-4 md:w-1/2">
            {/* Year + hardware badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
                {project.year}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--color-accent-secondary-dim)', color: 'var(--color-accent-secondary)' }}>
                <i className="fas fa-microchip mr-1" />Hardware / IoT
              </span>
            </div>

            <h3 className="font-heading text-xl lg:text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>

            <ul className="space-y-1.5">
              {project.features.slice(0, 3).map((f, i) => (
                <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                  <span className="text-accent mt-0.5 text-[10px]">●</span>{f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {project.tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}
            </div>

            <div className="flex items-center gap-3 mt-2">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4">
                  <i className="fas fa-external-link-alt" />Live Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-4">
                  <i className="fab fa-github" />Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Web Project Card with gradient preview ── */
        <div className="relative z-10 flex flex-col h-full">
          {/* Gradient preview thumbnail */}
          <div
            className="relative h-40 flex items-center justify-center overflow-hidden"
            style={{ background: gradient || 'linear-gradient(135deg, #1e1b4b, #312e81)' }}
          >
            <i className={`${getProjectIcon(project.title)} text-5xl text-white/20`} />
            {/* Subtle mesh overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          <div className="p-6 flex flex-col gap-4 flex-grow">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'var(--color-accent-dim)', color: 'var(--color-accent)' }}>
                {project.year}
              </span>
            </div>

            <h3 className="font-heading text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
              {project.title}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>

            <ul className="space-y-1.5">
              {project.features.slice(0, 3).map((f, i) => (
                <li key={i} className="text-text-muted text-xs flex items-start gap-2">
                  <span className="text-accent mt-0.5 text-[10px]">●</span>{f}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {project.tech.map((t) => <span key={t} className="tech-badge">{t}</span>)}
            </div>

            <div className="flex items-center gap-3 mt-2">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-xs py-2 px-4">
                  <i className="fas fa-external-link-alt" />Live Demo
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2 px-4">
                  <i className="fab fa-github" />Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
