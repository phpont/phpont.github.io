import { useEffect, useRef, useCallback } from 'react';
import styles from './Hero.module.css';
import { ColdFieldCanvas } from './ColdFieldCanvas';
import * as T from './visualTuning';

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const reducedMotion = useRef(false);

  const animate = useCallback(() => {
    if (reducedMotion.current) return;

    currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * T.MOUSE_LERP;
    currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * T.MOUSE_LERP;

    if (containerRef.current) {
      const isMobile = window.innerWidth < 768;
      
      // Calculate translations
      const tx = currentMouse.current.x * (isMobile ? T.MOUSE_TEXT_STRENGTH_X_MOBILE : T.MOUSE_TEXT_STRENGTH_X_DESKTOP);
      const ty = currentMouse.current.y * (isMobile ? T.MOUSE_TEXT_STRENGTH_Y_MOBILE : T.MOUSE_TEXT_STRENGTH_Y_DESKTOP);
      
      // Calculate tilt
      const tiltMax = isMobile ? T.MOUSE_TILT_MAX_MOBILE : T.MOUSE_TILT_MAX_DESKTOP;
      const rotX = -currentMouse.current.y * tiltMax; // negative Y mouse tilts X up
      const rotY = currentMouse.current.x * tiltMax;

      // Calculate ghost inverse translation
      const gx = currentMouse.current.x * T.WORDMARK_GHOST_PARALLAX_REVERSE;
      const gy = currentMouse.current.y * T.WORDMARK_GHOST_PARALLAX_REVERSE;
      const ghostOpacity = T.WORDMARK_GHOST_OPACITY_MIN + 
                           (Math.abs(currentMouse.current.x) + Math.abs(currentMouse.current.y)) * 0.5 * 
                           (T.WORDMARK_GHOST_OPACITY_MAX - T.WORDMARK_GHOST_OPACITY_MIN);

      containerRef.current.style.setProperty('--tx', `${tx}px`);
      containerRef.current.style.setProperty('--ty', `${ty}px`);
      containerRef.current.style.setProperty('--rotX', `${rotX}deg`);
      containerRef.current.style.setProperty('--rotY', `${rotY}deg`);
      
      containerRef.current.style.setProperty('--gx', `${gx}px`);
      containerRef.current.style.setProperty('--gy', `${gy}px`);
      containerRef.current.style.setProperty('--gOpacity', String(ghostOpacity));
      
      containerRef.current.style.setProperty('--bOpacity', String(T.WORDMARK_BLUE_OPACITY));
      containerRef.current.style.setProperty('--bOffset', `${T.WORDMARK_BLUE_OFFSET}px`);
      containerRef.current.style.setProperty('--gBlur', `${T.WORDMARK_GHOST_BLUR}px`);
    }

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handlePointerMove = (e: PointerEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <>
      <ColdFieldCanvas />
      <main className={styles.heroContainer}>
        <div 
          className={styles.content} 
          ref={containerRef} 
          style={{ 
            '--tx': '0px', '--ty': '0px', 
            '--rotX': '0deg', '--rotY': '0deg',
            '--gx': '0px', '--gy': '0px',
            '--gOpacity': String(T.WORDMARK_GHOST_OPACITY_MIN),
            '--bOpacity': String(T.WORDMARK_BLUE_OPACITY),
            '--bOffset': `${T.WORDMARK_BLUE_OFFSET}px`,
            '--gBlur': `${T.WORDMARK_GHOST_BLUR}px`
          } as React.CSSProperties}
        >
          <span className={styles.signature}>Paulo</span>
          <h1 className={styles.wordmark} data-text="PONTAROLO">PONTAROLO</h1>
          <span className={styles.subtitle}>Software Engineer &middot; Offensive Security</span>
        </div>
      </main>
    </>
  );
};
