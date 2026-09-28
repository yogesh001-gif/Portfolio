import React, { Suspense, useState, useEffect, useCallback, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
const HeroScene = lazy(() => import('./HeroScene'));
import LoadingSpinner from './LoadingSpinner';
import { SOCIAL_LINKS, TYPEWRITER_WORDS } from '../data/content';

function useTypewriter(words, typingSpeed = 100, deletingSpeed = 60, pauseTime = 2000) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const typedText = useTypewriter(TYPEWRITER_WORDS);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center section-padding overflow-hidden"
      style={{ paddingTop: '5rem' }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(167,139,250,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 30% 70%, rgba(56,189,248,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: 2D Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-medium tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            Full-Stack & Embedded Systems
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight"
          >
            Yogesh
            <br />
            <span className="gradient-text">Ahlawat</span>
          </motion.h1>

          <motion.div variants={itemVariants} className="h-8">
            <span className="text-lg text-text-secondary font-body">
              {typedText}
              <span className="inline-block w-[2px] h-5 ml-1 bg-accent animate-pulse align-middle" />
            </span>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-text-secondary max-w-md leading-relaxed"
          >
            B.Tech ECE student at MAIT, building practical web products and intelligent hardware systems with modern technology.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
            <a
              href={SOCIAL_LINKS.resume}
              className="btn-primary"
              id="hero-resume-btn"
            >
              <i className="fas fa-file-alt" />
              Resume
            </a>
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              id="hero-github-btn"
            >
              <i className="fab fa-github" />
              GitHub
            </a>
          </motion.div>
        </motion.div>

        {/* Right: 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full aspect-square max-w-lg mx-auto md:max-w-none"
        >
          {!isMobile ? (
            <Suspense fallback={<LoadingSpinner />}>
              <Canvas
                dpr={[1, 2]}
                camera={{ position: [0, 0, 4], fov: 45 }}
                style={{ background: 'transparent' }}
              >
                <HeroScene />
              </Canvas>
            </Suspense>
          ) : (
            /* Mobile fallback: animated gradient orb */
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-48 h-48 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(167,139,250,0.3), rgba(56,189,248,0.15), transparent)',
                  boxShadow: '0 0 80px rgba(167,139,250,0.15)',
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
