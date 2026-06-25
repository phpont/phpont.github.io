export const mistVertexShader = `
  void main() {
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

export const mistFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uMistStrength;
  uniform float uBlueStrength;
  uniform float uGrainStrength;
  uniform float uVignetteStrength;

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                             + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                            dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 5; i++) {
      value += amp * snoise(st);
      st *= 2.05;
      amp *= 0.48;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 st = uv;
    st.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.08;
    float breath = sin(uTime * 0.4) * 0.5 + 0.5;
    vec2 mouseShift = uMouse * 0.06;

    // Domain-warped FBM — creates flowing mist streaks
    float q = fbm(st * 2.2 + t * 0.7 + mouseShift);
    float r = fbm(st * 2.2 + q * 0.8 + vec2(t * 0.3, t * 0.5));
    float n = fbm(st * 2.0 + r * 0.7 + mouseShift * 0.5);

    // Remap to 0..1
    n = n * 0.5 + 0.5;

    // Intensity with breathing
    float mist = smoothstep(0.28, 0.72, n) * uMistStrength;
    mist += breath * 0.025;

    // Colours — still overwhelmingly dark
    vec3 black    = vec3(0.008, 0.008, 0.012);
    vec3 coldGrey = vec3(0.09, 0.095, 0.11);
    vec3 coldBlue = vec3(0.14, 0.19, 0.32);

    vec3 fog = mix(black, coldGrey, mist);
    fog = mix(fog, coldBlue, mist * uBlueStrength);

    // Vignette — strong at edges, preserves some center
    vec2 vc = uv - 0.5;
    float vDist = length(vc);
    float vignette = 1.0 - smoothstep(0.35, 1.1, vDist * uVignetteStrength);
    fog *= vignette;

    // Film grain
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    fog += (grain - 0.5) * uGrainStrength;

    gl_FragColor = vec4(fog, 1.0);
  }
`;
