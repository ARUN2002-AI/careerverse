/**
 * CareerVerse design tokens — the single source of truth for TypeScript consumers.
 *
 * Primitive values live in `design-tokens.json` at the repo root, which is ALSO read by
 * `tailwind.config.js`. That is what keeps NativeWind utility classes and StyleSheet
 * styles from drifting apart — there is exactly one place a hex value is written.
 *
 * Nothing else in `src/` may contain a raw hex or a magic spacing number.
 * See `docs/DESIGN_SYSTEM.md` for the reasoning behind each value.
 */

import tokens from '../../design-tokens.json';

const p = tokens.palette;

// ---------------------------------------------------------------------------
// Semantic colour — what components actually consume.
// ---------------------------------------------------------------------------

export const darkColors = {
  bg: p.ink,
  surface1: p.navy1,
  surface2: p.navy2,
  surface3: p.navy3,
  border: p.navyBorder,

  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.12)',
  /** Top edge highlight. Light always comes from above — never invert this. */
  lightEdge: 'rgba(255,255,255,0.10)',
  scrim: 'rgba(4,7,13,0.72)',

  brand: p.brass500,
  brandHover: p.brass400,
  brandPressed: p.brass600,
  brandMuted: p.brassMuted,
  /** Text/icon colour that sits ON brand. */
  onBrand: p.ink,

  accent: p.cyan500,
  accentMuted: p.cyanMuted,

  textPrimary: p.textDark,
  textSecondary: p.textDarkMuted,
  textTertiary: p.textDarkFaint,
  textInverse: p.ink,

  success: p.success,
  warning: p.warning,
  danger: p.danger,
  info: p.cyan500,
} as const;

/** Semantic colour contract. Both themes must supply every key. */
export type Colors = Record<keyof typeof darkColors, string>;

export const lightColors: Colors = {
  bg: p.paper,
  surface1: p.white,
  surface2: p.paper2,
  surface3: p.paper3,
  border: p.paperBorder,

  glass: 'rgba(12,18,32,0.04)',
  glassBorder: 'rgba(12,18,32,0.10)',
  lightEdge: 'rgba(255,255,255,0.80)',
  scrim: 'rgba(12,18,32,0.40)',

  // Brass is darkened in light mode to hold 4.5:1 against white.
  brand: p.brassDark,
  brandHover: p.brass600,
  brandPressed: p.brassDarker,
  brandMuted: p.brassMutedLight,
  onBrand: p.white,

  accent: p.cyanDark,
  accentMuted: p.cyanMutedLight,

  textPrimary: p.textLight,
  textSecondary: p.textLightMuted,
  textTertiary: p.textLightFaint,
  textInverse: p.white,

  success: p.successDark,
  warning: p.warningDark,
  danger: p.dangerDark,
  info: p.cyanDark,
};

// ---------------------------------------------------------------------------
// Gradients — three only. See DESIGN_SYSTEM.md §3.
// ---------------------------------------------------------------------------

export const gradients = {
  brass: {
    colors: [p.brass400, p.brass600] as [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  glow: {
    colors: ['rgba(79,209,224,0.18)', 'rgba(79,209,224,0)'] as [string, string],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  depth: {
    colors: [p.navy1, p.ink] as [string, string],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
} as const;

// ---------------------------------------------------------------------------
// Spacing — 4pt base.
// ---------------------------------------------------------------------------

export const spacing = tokens.spacing;
export type SpacingKey = keyof typeof spacing;

/** Layout constants. */
export const layout = {
  ...tokens.layout,
  sectionGap: tokens.spacing[8],
  cardPadding: tokens.spacing[4],
  cardGap: tokens.spacing[3],
} as const;

// ---------------------------------------------------------------------------
// Radius
// ---------------------------------------------------------------------------

export const radius = tokens.radius;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displaySemi: 'SpaceGrotesk_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_500Medium',
} as const;

const fs = tokens.fontSize;
const lh = tokens.lineHeight;

/**
 * Type scale. Weight is baked into the font file rather than set via `fontWeight`,
 * which renders inconsistently on Android.
 */
export const typography = {
  display: { fontFamily: fonts.display, fontSize: fs.display, lineHeight: lh.display },
  h1: { fontFamily: fonts.display, fontSize: fs.h1, lineHeight: lh.h1 },
  h2: { fontFamily: fonts.displaySemi, fontSize: fs.h2, lineHeight: lh.h2 },
  h3: { fontFamily: fonts.bodySemi, fontSize: fs.h3, lineHeight: lh.h3 },
  body: { fontFamily: fonts.body, fontSize: fs.body, lineHeight: lh.body },
  bodyMd: { fontFamily: fonts.bodyMedium, fontSize: fs.body, lineHeight: lh.body },
  sm: { fontFamily: fonts.body, fontSize: fs.sm, lineHeight: lh.sm },
  xs: { fontFamily: fonts.bodyMedium, fontSize: fs.xs, lineHeight: lh.xs },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fs.mono,
    lineHeight: lh.mono,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: fs.label,
    lineHeight: lh.label,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

// ---------------------------------------------------------------------------
// Elevation — iOS shadow + Android elevation in one token.
// ---------------------------------------------------------------------------

export const elevation = {
  e0: {},
  e1: {
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  e2: {
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  e3: {
    shadowColor: '#000',
    shadowOpacity: 0.44,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  /** Reserved for the primary button only. */
  brass: {
    shadowColor: p.brass500,
    shadowOpacity: 0.32,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
} as const;

export type ElevationKey = keyof typeof elevation;

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

export const motion = {
  ...tokens.motion,
  spring: { damping: 18, stiffness: 180, mass: 1 },
  pressScale: 0.97,
} as const;

export const opacity = {
  disabled: 0.4,
  pressed: 0.85,
  scrim: 0.72,
} as const;
