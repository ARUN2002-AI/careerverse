/* eslint-env node */
// Reads the SAME primitives as src/theme/tokens.ts. Never hardcode a value here.
const t = require('./design-tokens.json');
const p = t.palette;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme is the default. Light variants are suffixed `-light`.
        bg: p.ink,
        surface: { 1: p.navy1, 2: p.navy2, 3: p.navy3 },
        line: p.navyBorder,
        brand: {
          DEFAULT: p.brass500,
          hover: p.brass400,
          pressed: p.brass600,
          muted: p.brassMuted,
          light: p.brassDark,
        },
        accent: { DEFAULT: p.cyan500, muted: p.cyanMuted, light: p.cyanDark },
        content: {
          primary: p.textDark,
          secondary: p.textDarkMuted,
          tertiary: p.textDarkFaint,
          inverse: p.ink,
        },
        state: {
          success: p.success,
          warning: p.warning,
          danger: p.danger,
          info: p.cyan500,
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
