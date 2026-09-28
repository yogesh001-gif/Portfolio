import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import TechStackScene from './TechStackScene';
import LoadingSpinner from './LoadingSpinner';
import { TECH_STACK } from '../data/content';

const categories = ['Languages', 'Frontend', 'Backend', 'Tools', 'Hardware'];

export default function TechStackSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      id="skills"
      className="py-24 lg:py-32 section-padding relative overflow-hidden"
      style={{ background: 'var(--color-bg-secondary)' }}
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p
            className="text-sm font-medium tracking-[0.2em] uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            Technologies
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold">
            Tech Stack<span className="text-accent">.</span>
          </h2>
        </motion.div>

        {/* Desktop: 3D scene + legend side by side */}
        {!isMobile ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* 3D Canvas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-3"
              style={{ height: '480px' }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <Canvas
                  dpr={[1, 2]}
                  camera={{ position: [0, 0, 7], fov: 50 }}
                  style={{ background: 'transparent' }}
                >
                  <TechStackScene techItems={TECH_STACK} />
                </Canvas>
              </Suspense>
            </motion.div>

            {/* Legend / Category List */}
            <div className="lg:col-span-2 space-y-6">
              {categories.map((cat, catIdx) => {
                const items = TECH_STACK.filter((t) => t.category === cat);
                if (items.length === 0) return null;
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1, duration: 0.5 }}
                  >
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-[0.15em] mb-3">
                      {cat}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-300 hover:scale-105 cursor-default"
                          style={{
                            background: 'var(--color-bg-card)',
                            border: '1px solid var(--color-border)',
                          }}
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: item.color,
                              boxShadow: `0 0 8px ${item.color}40`,
                            }}
                          />
                          <span className="text-sm font-medium text-text-primary">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mobile: categorized grid only */
          <div className="space-y-8">
            {categories.map((cat, catIdx) => {
              const items = TECH_STACK.filter((t) => t.category === cat);
              if (items.length === 0) return null;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.08, duration: 0.5 }}
                >
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-[0.15em] mb-3">
                    {cat}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                        style={{
                          background: 'var(--color-bg-card)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: item.color,
                            boxShadow: `0 0 8px ${item.color}40`,
                          }}
                        />
                        <span className="text-sm font-medium text-text-primary">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
