// ============================================================
// visualTuning.ts — Black Signal Living Hero
// All visual tuning constants in one place.
// ============================================================

// ---- Mist / Fog ----
export const MIST_STRENGTH = 0.35;
export const BLUE_STRENGTH = 0.22;
export const GRAIN_STRENGTH = 0.028;
export const VIGNETTE_STRENGTH = 0.85;
export const MOUSE_WARP = 0.06;
export const BREATH_AMOUNT = 0.04;

// ---- Far Dust ----
export const FAR_DUST_COUNT_DESKTOP = 1400;
export const FAR_DUST_COUNT_MOBILE = 500;
export const FAR_DUST_Z_NEAR = -18;
export const FAR_DUST_Z_FAR = -42;
export const FAR_DUST_SPREAD_X = 50;
export const FAR_DUST_SPREAD_Y = 40;
export const FAR_DUST_SIZE_MIN = 0.5;
export const FAR_DUST_SIZE_MAX = 2.2;
export const FAR_DUST_ALPHA_MIN = 0.08;
export const FAR_DUST_ALPHA_MAX = 0.20;
export const FAR_DUST_SIZE_SCALE = 35.0;

// ---- Mid Snow ----
export const MID_SNOW_COUNT_DESKTOP = 650;
export const MID_SNOW_COUNT_MOBILE = 250;
export const MID_SNOW_Z_NEAR = -8;
export const MID_SNOW_Z_FAR = -28;
export const MID_SNOW_SPREAD_X = 36;
export const MID_SNOW_SPREAD_Y = 28;
export const MID_SNOW_SIZE_MIN = 1.4;
export const MID_SNOW_SIZE_MAX = 6.5;
export const MID_SNOW_ALPHA_MIN = 0.18;
export const MID_SNOW_ALPHA_MAX = 0.44;
export const MID_SNOW_SIZE_SCALE = 60.0;

// ---- Near Blur Flakes ----
export const NEAR_BLUR_COUNT_DESKTOP = 55;
export const NEAR_BLUR_COUNT_MOBILE = 20;
export const NEAR_BLUR_Z_NEAR = -4;
export const NEAR_BLUR_Z_FAR = -12;
export const NEAR_BLUR_SPREAD_X = 30;
export const NEAR_BLUR_SPREAD_Y = 22;
export const NEAR_BLUR_SIZE_MIN = 6.0;
export const NEAR_BLUR_SIZE_MAX = 24.0;
export const NEAR_BLUR_ALPHA_MIN = 0.025;
export const NEAR_BLUR_ALPHA_MAX = 0.07;
export const NEAR_BLUR_SIZE_SCALE = 80.0;
export const NEAR_BLUR_CENTER_EXCLUSION = 3.5;

// ---- Blue Signals ----
export const BLUE_SIGNAL_COUNT_DESKTOP = 35;
export const BLUE_SIGNAL_COUNT_MOBILE = 12;
export const BLUE_SIGNAL_Z_NEAR = -7;
export const BLUE_SIGNAL_Z_FAR = -30;
export const BLUE_SIGNAL_SPREAD_X = 40;
export const BLUE_SIGNAL_SPREAD_Y = 30;
export const BLUE_SIGNAL_SIZE_MIN = 2.0;
export const BLUE_SIGNAL_SIZE_MAX = 12.0;
export const BLUE_SIGNAL_ALPHA_MIN = 0.20;
export const BLUE_SIGNAL_ALPHA_MAX = 0.44;
export const BLUE_SIGNAL_SIZE_SCALE = 65.0;

// ---- Global rotation / Orbit speeds ----
export const ROTATION_Y_SPEED = 0.012;
export const ROTATION_X_AMP = 0.025;

// ---- Mouse ----
export const MOUSE_TEXT_STRENGTH_X_DESKTOP = 16; // px translation
export const MOUSE_TEXT_STRENGTH_Y_DESKTOP = 10;
export const MOUSE_TEXT_STRENGTH_X_MOBILE = 8;
export const MOUSE_TEXT_STRENGTH_Y_MOBILE = 5;
export const MOUSE_TILT_MAX_DESKTOP = 2.5; // degrees
export const MOUSE_TILT_MAX_MOBILE = 1.25;
export const MOUSE_LERP = 0.06;

// ---- Wordmark effects ----
export const WORDMARK_GHOST_PARALLAX_REVERSE = -24; // pushes ghost in opposite direction
export const WORDMARK_GHOST_BLUR = 16;
export const WORDMARK_GHOST_OPACITY_MIN = 0.05;
export const WORDMARK_GHOST_OPACITY_MAX = 0.16;
export const WORDMARK_BLUE_OPACITY = 0.08;
export const WORDMARK_BLUE_OFFSET = 3;
