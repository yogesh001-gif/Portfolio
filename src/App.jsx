import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import TechStackSection from './components/TechStackSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  // Smooth scroll with Lenis (if installed) or native
  useEffect(() => {
    let lenis;
    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch (e) {
        // Lenis not available, native smooth scroll works fine
      }
    };
    initLenis();
    return () => lenis?.destroy();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)' }}>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <TechStackSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
