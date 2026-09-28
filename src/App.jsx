import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import { ScrollUI, Cursor } from './components/ScrollUI';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import TrafficX from './components/sections/TrafficX';
import Skills from './components/sections/Skills';
import Certificates from './components/sections/Certificates';
import Contact from './components/sections/Contact';
import Footer from './components/sections/Footer';
import { store, emit, on, measureAnchors } from './lib/store';
import { detectQuality, hasWebGL, isTouch, prefersReducedMotion, read3DPref, write3DPref } from './lib/device';

const Experience = lazy(() => import('./three/Experience'));

/* If WebGL crashes for any reason, fall back to the static background. */
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('3D scene disabled:', err);
    this.props.onFail?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// decided once, before first render
const REDUCED = prefersReducedMotion();
const CAN_3D = typeof window !== 'undefined' && hasWebGL();
store.reduced = REDUCED;
store.quality = detectQuality();

export default function App() {
  const [enabled3D, setEnabled3D] = useState(() => CAN_3D && (read3DPref() ?? true));
  const [progress, setProgress] = useState(10);
  const [loaded, setLoaded] = useState(false);

  // Smooth scrolling (Lenis) — native scrolling for reduced-motion users.
  useEffect(() => {
    document.documentElement.classList.toggle('q-low', store.quality === 'low');
    document.documentElement.classList.toggle('has-cursor', !isTouch() && !REDUCED);
    let lenis = null;
    const onNativeScroll = () => {
      store.scroll = window.scrollY;
      store.velocity = 0;
      emit('scroll');
    };
    if (!REDUCED) {
      lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.9, anchors: false });
      store.lenis = lenis;
      lenis.on('scroll', (l) => {
        store.scroll = l.scroll;
        store.velocity = l.velocity;
        emit('scroll');
      });
      lenis.stop(); // locked while the loader is up
    } else {
      window.addEventListener('scroll', onNativeScroll, { passive: true });
    }
    store.scroll = window.scrollY;

    const onPointer = (e) => {
      store.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    if (!isTouch()) window.addEventListener('pointermove', onPointer, { passive: true });

    const remeasure = () => measureAnchors();
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener('resize', remeasure);
    remeasure();

    return () => {
      lenis?.destroy();
      store.lenis = null;
      ro.disconnect();
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  // Loading sequence: fonts → 3D bundle → first rendered frame.
  useEffect(() => {
    let alive = true;
    const started = performance.now();
    const finish = () => {
      const wait = Math.max(0, 1200 - (performance.now() - started));
      setTimeout(() => {
        if (!alive) return;
        setProgress(100);
        setTimeout(() => alive && setLoaded(true), 450);
      }, wait);
    };
    document.fonts?.ready.then(() => alive && setProgress((p) => Math.max(p, 40)));
    let off = () => {};
    if (enabled3D) {
      import('./three/Experience').then(() => alive && setProgress((p) => Math.max(p, 75)));
      off = on('scene-ready', finish);
    } else {
      document.fonts?.ready.then(finish) ?? finish();
    }
    const safety = setTimeout(finish, 8000); // never keep people waiting forever
    return () => {
      alive = false;
      off();
      clearTimeout(safety);
    };
    // only on first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    store.lenis?.start();
    measureAnchors();
  }, [loaded]);

  const toggle3D = useCallback(() => {
    setEnabled3D((v) => {
      write3DPref(!v);
      return !v;
    });
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Loader progress={progress} done={loaded} />
      <div className={`scene-layer ${enabled3D ? '' : 'scene-layer--off'}`} aria-hidden="true">
        <div className="scene-fallback" />
        {enabled3D && (
          <SceneBoundary onFail={() => setEnabled3D(false)}>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </SceneBoundary>
        )}
        <div className="scene-vignette" />
      </div>

      {!isTouch() && !REDUCED && <Cursor />}
      <Navbar enabled3D={enabled3D} can3D={CAN_3D} onToggle3D={toggle3D} />
      <ScrollUI />

      <main className={`content ${enabled3D ? 'with-3d' : 'no-3d'}`}>
        <Hero ready={loaded} />
        <About enabled3D={enabled3D} />
        <Projects />
        <TrafficX enabled3D={enabled3D} />
        <Skills />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
