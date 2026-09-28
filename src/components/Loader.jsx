import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from './motion';

/* Intro screen: counts up with real loading progress, then lifts away. */
export default function Loader({ progress, done }) {
  const [shown, setShown] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const tick = () => {
      setShown((v) => {
        const next = v + (progress - v) * 0.12 + 0.2;
        return Math.min(progress, next);
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [progress]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          role="status"
          aria-live="polite"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1, ease: EASE }}
        >
          <div className="loader-inner">
            <motion.p
              className="loader-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              Yogesh Ahlawat<span className="accent">.</span>
            </motion.p>
            <div className="loader-bar">
              <span style={{ transform: `scaleX(${shown / 100})` }} />
            </div>
            <p className="loader-meta">
              <span>Building the scene</span>
              <span className="tabular">{String(Math.round(shown)).padStart(3, '0')}</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
