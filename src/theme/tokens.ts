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
//
// The app is dark-only. Bible Part 21 defines a single background set and names it
// "Background", not "Background (Dark)", so there is no light theme to switch to.
// ---------------------------------------------------------------------------

export const colors = {
  bg: p.bg,
  surface: p.surface,
  card: p.card,
  divider: p.divider,

  /**
   * Translucency effects, not hues — they tint whatever sits beneath them and
   * introduce no colour of their own, so Part 21's palette rule still holds.
   */
  glass: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.12)',
  /** Top edge highlight. Light always comes from above — never invert this. */
  lightEdge: 'rgba(255,255,255,0.10)',
  scrim: 'rgba(11,16,32,0.72)',

  brand: p.primary500,
  /**
   * Primary at low alpha, for selected-chip fills. Derived from Primary 500 rather
   * than a new hue. Replace with the documented tint once the 50–900 ramp lands.
   */
  brandSoft: 'rgba(108,92,231,0.16)',
  /** Text/icon colour that sits ON brand. */
  onBrand: p.textPrimary,

  accent: p.secondary,

  textPrimary: p.textPrimary,
  textSecondary: p.textSecondary,
  textCaption: p.textCaption,
  textDisabled: p.textDisabled,

  success: p.success,
  warning: p.warning,
  danger: p.error,
  info: p.secondary,
} as const;

export type Colors = typeof colors;

// ---------------------------------------------------------------------------
// Gradients — one only, until the official gradient library is supplied.
// Bible Part 21: hero banners, premium cards, career highlights, dashboard header.
// ---------------------------------------------------------------------------

export const gradients = {
  primary: {
    colors: [p.gradientStart, p.gradientEnd] as [string, string],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
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
    shadowColor: tokens.effects.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  e2: {
    shadowColor: tokens.effects.shadow,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  e3: {
    shadowColor: tokens.effects.shadow,
    shadowOpacity: 0.44,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  /** Reserved for the primary button only. */
  brand: {
    shadowColor: p.primary500,
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
