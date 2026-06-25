// ============================================================
// LivingParticles.tsx — Black Signal Living Hero
// 4 particle classes: FarDust, MidSnow, NearBlurFlakes, BlueSignals
// ============================================================

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as T from './visualTuning';

// ---- Buffer creation helper ----
function createParticleBuffers(
  count: number,
  zNear: number, zFar: number,
  spreadX: number, spreadY: number,
  alphaMin: number, alphaMax: number,
  centerExclusion?: number
) {
  const pos = new Float32Array(count * 3);
  const spd = new Float32Array(count);
  const siz = new Float32Array(count);
  const phs = new Float32Array(count);
  const alp = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    let x: number, y: number;
    if (centerExclusion) {
      do {
        x = (Math.random() - 0.5) * spreadX;
        y = (Math.random() - 0.5) * spreadY;
      } while (Math.sqrt(x * x + y * y) < centerExclusion);
    } else {
      x = (Math.random() - 0.5) * spreadX;
      y = (Math.random() - 0.5) * spreadY;
    }

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = zNear + Math.random() * (zFar - zNear);

    spd[i] = Math.random() * 0.2 + 0.1;
    siz[i] = Math.random() * 2.0 + 0.5;
    phs[i] = Math.random() * Math.PI * 2;
    alp[i] = alphaMin + Math.random() * (alphaMax - alphaMin);
  }

  return { pos, spd, siz, phs, alp };
}

// ---- Vertex shader ----
const vertexShader = `
  attribute float aSpeed;
  attribute float aSize;
  attribute float aPhase;
  attribute float aBaseAlpha;

  uniform float uTime;
  uniform float uSizeScale;
  uniform float uSizeMin;
  uniform float uSizeMax;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;

  varying float vAlpha;

  void main() {
    vec3 basePos = position;

    // Organic drift
    basePos.x += sin(uTime * aSpeed + aPhase) * 0.5;
    basePos.y += cos(uTime * aSpeed * 0.8 + aPhase) * 0.3;

    // Mouse displacement
    basePos.x += uMouse.x * uMouseInfluence * (1.0 + aPhase * 0.1);
    basePos.y += uMouse.y * uMouseInfluence * (1.0 + aPhase * 0.1);

    vec4 mvPos = modelViewMatrix * vec4(basePos, 1.0);

    float rawSize = aSize * (uSizeScale / max(1.0, -mvPos.z));
    gl_PointSize = clamp(rawSize, uSizeMin, uSizeMax);

    gl_Position = projectionMatrix * mvPos;

    // Depth-based alpha
    float depthFade = smoothstep(-42.0, -4.0, mvPos.z);
    vAlpha = aBaseAlpha * mix(0.4, 1.0, depthFade);
  }
`;

// ---- Fragment shader factories ----
// Glow fragment: bright white core + large soft blur halo (firefly effect)
const makeGlowFragment = (color: string) => `
  precision highp float;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    // Hard bright core — small and intense
    float core = exp(-d * d * 45.0);
    // Large soft blur halo — this IS the glow
    float halo = exp(-d * d * 2.5) * 0.7;
    // Combined
    float glow = core + halo;

    // Push towards white in the core for brightness
    vec3 baseCol = ${color};
    vec3 whiteCore = mix(baseCol, vec3(0.92, 0.92, 0.94), core * 0.6);

    gl_FragColor = vec4(whiteCore, glow * vAlpha);
  }
`;

// Dust fragment — subtle glow for background texture
const makeDustFragment = (color: string) => `
  precision highp float;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.05, d);
    float halo = exp(-d * d * 4.5) * 0.35;
    float glow = core + halo;

    vec3 col = ${color};
    gl_FragColor = vec4(col, glow * vAlpha);
  }
`;

const blurFragment = `
  precision highp float;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float glow = exp(-d * d * 4.0);
    vec3 col = vec3(0.32, 0.36, 0.46);
    gl_FragColor = vec4(col, glow * vAlpha);
  }
`;

// ---- Generic particle layer ----
interface ParticleLayerProps {
  count: number;
  zNear: number;
  zFar: number;
  spreadX: number;
  spreadY: number;
  sizeScale: number;
  sizeMin: number;
  sizeMax: number;
  alphaMin: number;
  alphaMax: number;
  rotationSpeed: number;
  mouseInfluence: number;
  fragmentShader: string;
  mouse: { x: number; y: number };
  reducedMotion: boolean;
  centerExclusion?: number;
}

const ParticleLayer = (props: ParticleLayerProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const buffers = useMemo(() =>
    createParticleBuffers(
      props.count, props.zNear, props.zFar,
      props.spreadX, props.spreadY,
      props.alphaMin, props.alphaMax,
      props.centerExclusion
    ),
    [props.count, props.zNear, props.zFar, props.spreadX, props.spreadY,
     props.alphaMin, props.alphaMax, props.centerExclusion]
  );

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSizeScale: { value: props.sizeScale },
    uSizeMin: { value: props.sizeMin },
    uSizeMax: { value: props.sizeMax },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseInfluence: { value: props.mouseInfluence },
  }), [props.sizeScale, props.sizeMin, props.sizeMax, props.mouseInfluence]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const mat = pointsRef.current.material as THREE.ShaderMaterial;

    if (!props.reducedMotion) {
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      pointsRef.current.rotation.y = state.clock.elapsedTime * props.rotationSpeed;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.006) * T.ROTATION_X_AMP;
    }
    mat.uniforms.uMouse.value.set(props.mouse.x, props.mouse.y);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={props.count} array={buffers.pos} itemSize={3} />
        <bufferAttribute attach="attributes-aSpeed" count={props.count} array={buffers.spd} itemSize={1} />
        <bufferAttribute attach="attributes-aSize" count={props.count} array={buffers.siz} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={props.count} array={buffers.phs} itemSize={1} />
        <bufferAttribute attach="attributes-aBaseAlpha" count={props.count} array={buffers.alp} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={props.fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </points>
  );
};

// ---- Main export ----
export const LivingParticles = ({ mouse }: { mouse: { x: number; y: number } }) => {
  const reducedMotionRef = useRef(false);
  if (typeof window !== 'undefined') {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  const rm = reducedMotionRef.current;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      {/* Far Dust — depth texture */}
      <ParticleLayer
        count={isMobile ? T.FAR_DUST_COUNT_MOBILE : T.FAR_DUST_COUNT_DESKTOP}
        zNear={T.FAR_DUST_Z_NEAR} zFar={T.FAR_DUST_Z_FAR}
        spreadX={T.FAR_DUST_SPREAD_X} spreadY={T.FAR_DUST_SPREAD_Y}
        sizeScale={T.FAR_DUST_SIZE_SCALE} sizeMin={T.FAR_DUST_SIZE_MIN} sizeMax={T.FAR_DUST_SIZE_MAX}
        alphaMin={T.FAR_DUST_ALPHA_MIN} alphaMax={T.FAR_DUST_ALPHA_MAX}
        rotationSpeed={T.ROTATION_Y_SPEED * 0.6}
        mouseInfluence={0.1}
        fragmentShader={makeDustFragment('vec3(0.55, 0.55, 0.57)')}
        mouse={mouse}
        reducedMotion={rm}
      />

      {/* Mid Snow — visible floating */}
      <ParticleLayer
        count={isMobile ? T.MID_SNOW_COUNT_MOBILE : T.MID_SNOW_COUNT_DESKTOP}
        zNear={T.MID_SNOW_Z_NEAR} zFar={T.MID_SNOW_Z_FAR}
        spreadX={T.MID_SNOW_SPREAD_X} spreadY={T.MID_SNOW_SPREAD_Y}
        sizeScale={T.MID_SNOW_SIZE_SCALE} sizeMin={T.MID_SNOW_SIZE_MIN} sizeMax={T.MID_SNOW_SIZE_MAX}
        alphaMin={T.MID_SNOW_ALPHA_MIN} alphaMax={T.MID_SNOW_ALPHA_MAX}
        rotationSpeed={T.ROTATION_Y_SPEED}
        mouseInfluence={0.4}
        fragmentShader={makeGlowFragment('vec3(0.78, 0.78, 0.80)')}
        mouse={mouse}
        reducedMotion={rm}
      />

      {/* Near Blur Flakes — depth-of-field */}
      <ParticleLayer
        count={isMobile ? T.NEAR_BLUR_COUNT_MOBILE : T.NEAR_BLUR_COUNT_DESKTOP}
        zNear={T.NEAR_BLUR_Z_NEAR} zFar={T.NEAR_BLUR_Z_FAR}
        spreadX={T.NEAR_BLUR_SPREAD_X} spreadY={T.NEAR_BLUR_SPREAD_Y}
        sizeScale={T.NEAR_BLUR_SIZE_SCALE} sizeMin={T.NEAR_BLUR_SIZE_MIN} sizeMax={T.NEAR_BLUR_SIZE_MAX}
        alphaMin={T.NEAR_BLUR_ALPHA_MIN} alphaMax={T.NEAR_BLUR_ALPHA_MAX}
        rotationSpeed={T.ROTATION_Y_SPEED * 0.4}
        mouseInfluence={0.8}
        fragmentShader={blurFragment}
        mouse={mouse}
        reducedMotion={rm}
        centerExclusion={T.NEAR_BLUR_CENTER_EXCLUSION}
      />

      {/* Blue Signals — cold accent */}
      <ParticleLayer
        count={isMobile ? T.BLUE_SIGNAL_COUNT_MOBILE : T.BLUE_SIGNAL_COUNT_DESKTOP}
        zNear={T.BLUE_SIGNAL_Z_NEAR} zFar={T.BLUE_SIGNAL_Z_FAR}
        spreadX={T.BLUE_SIGNAL_SPREAD_X} spreadY={T.BLUE_SIGNAL_SPREAD_Y}
        sizeScale={T.BLUE_SIGNAL_SIZE_SCALE} sizeMin={T.BLUE_SIGNAL_SIZE_MIN} sizeMax={T.BLUE_SIGNAL_SIZE_MAX}
        alphaMin={T.BLUE_SIGNAL_ALPHA_MIN} alphaMax={T.BLUE_SIGNAL_ALPHA_MAX}
        rotationSpeed={T.ROTATION_Y_SPEED * 0.8}
        mouseInfluence={0.3}
        fragmentShader={makeGlowFragment('vec3(0.48, 0.63, 0.97)')}
        mouse={mouse}
        reducedMotion={rm}
      />
    </>
  );
};
