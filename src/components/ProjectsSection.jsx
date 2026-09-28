import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import HardwareScene from './HardwareScene';
import LoadingSpinner from './LoadingSpinner';
import { PROJECTS } from '../data/content';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ProjectsSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const webProjects = PROJECTS.filter((p) => p.category === 'web');
  const hardwareProjects = PROJECTS.filter((p) => p.category === 'hardware');

  return (
    <section id="projects" className="py-24 lg:py-32 section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <p
            className="text-sm font-medium tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Selected Work
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold">
            Projects<span className="text-accent">.</span>
          </h2>
        </motion.div>

        {/* Web Projects — Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {webProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* Hardware Projects */}
        <div className="space-y-6">
          {hardwareProjects.map((project, i) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={webProjects.length + i}
            >
              {!isMobile ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <Canvas
                    dpr={[1, 2]}
                    camera={{ position: [0, 1.5, 3.5], fov: 40 }}
                    style={{ background: 'transparent' }}
                  >
                    <HardwareScene />
                  </Canvas>
                </Suspense>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <i className="fas fa-microchip text-4xl text-accent mb-3 block" />
                    <p className="text-text-secondary text-sm">
                      Interactive 3D model — view on desktop
                    </p>
                  </div>
                </div>
              )}
            </ProjectCard>
          ))}
        </div>
      </div>
    </section>
  );
}
