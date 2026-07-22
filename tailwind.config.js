/* eslint-env node */
// Reads the SAME primitives as src/theme/tokens.ts. Never hardcode a value here.
const t = require('./design-tokens.json');
const p = t.palette;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // The app is dark-only (Bible Part 21 defines one background set), so there is no
  // `dark:` variant to toggle and no light-suffixed colours.
  theme: {
    extend: {
      colors: {
        bg: p.bg,
        surface: p.surface,
        card: p.card,
        line: p.divider,
        brand: { DEFAULT: p.primary500, on: p.textPrimary },
        accent: p.secondary,
        content: {
          primary: p.textPrimary,
          secondary: p.textSecondary,
          caption: p.textCaption,
          disabled: p.textDisabled,
        },
        state: {
          success: p.success,
          warning: p.warning,
          danger: p.error,
          info: p.secondary,
        },
      },
      spacing: t.spacing,
      borderRadius: t.radius,
      fontSize: Object.fromEntries(
        Object.keys(t.fontSize).map((k) => [k, [`${t.fontSize[k]}px`, `${t.lineHeight[k]}px`]]),
      ),
      fontFamily: {
        display: ['SpaceGrotesk_700Bold'],
        'display-semi': ['SpaceGrotesk_600SemiBold'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-semi': ['Inter_600SemiBold'],
        mono: ['JetBrainsMono_500Medium'],
      },
      maxWidth: { content: `${t.layout.maxContentWidth}px` },
      transitionDuration: {
        fast: `${t.motion.fast}ms`,
        base: `${t.motion.base}ms`,
        slow: `${t.motion.slow}ms`,
      },
    },
  },
  plugins: [],
};
