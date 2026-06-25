// ============================================================
// ColdFieldCanvas.tsx — Black Signal Living Hero
// Scene orchestrator: mist quad + 4-class living particles
// ============================================================

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mistVertexShader, mistFragmentShader } from './coldFieldShader';
import { LivingParticles } from './LivingParticles';
import * as T from './visualTuning';

const SceneManager = () => {
  const fogMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));
  const reducedMotionRef = useRef(false);
  const mouseForParticles = useRef({ x: 0, y: 0 });

  const [resolution, setResolution] = useState(
    () => new THREE.Vector2(window.innerWidth, window.innerHeight)
  );

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      setResolution(new THREE.Vector2(window.innerWidth, window.innerHeight));
    };

    const handleMouseMove = (event: MouseEvent) => {
      targetMouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const fogUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: resolution },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMistStrength: { value: T.MIST_STRENGTH },
      uBlueStrength: { value: T.BLUE_STRENGTH },
      uGrainStrength: { value: T.GRAIN_STRENGTH },
      uVignetteStrength: { value: T.VIGNETTE_STRENGTH },
    }),
    [resolution]
  );

  useFrame((state) => {
    currentMouse.current.lerp(targetMouse.current, T.MOUSE_LERP);
    mouseForParticles.current.x = currentMouse.current.x;
    mouseForParticles.current.y = currentMouse.current.y;

    if (fogMaterialRef.current) {
      if (!reducedMotionRef.current) {
        fogMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      }
      fogMaterialRef.current.uniforms.uMouse.value.copy(currentMouse.current);
    }
  });

  return (
    <>
      {/* Mist background quad */}
      <mesh renderOrder={-2}>
        <planeGeometry args={[2, 2]} />
        <shaderMaterial
          ref={fogMaterialRef}
          vertexShader={mistVertexShader}
          fragmentShader={mistFragmentShader}
          uniforms={fogUniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* 4-class particle system */}
      <LivingParticles mouse={mouseForParticles.current} />
    </>
  );
};

export const ColdFieldCanvas = ({ className }: { className?: string }) => {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 0], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
      >
        <SceneManager />
      </Canvas>
    </div>
  );
};
