import React, { createContext, useContext, useMemo } from 'react';
import { useWindowDimensions, AccessibilityInfo } from 'react-native';

import {
  colors,
  gradients,
  spacing,
  layout,
  radius,
  typography,
  fonts,
  elevation,
  motion,
  opacity,
  type Colors,
} from './tokens';

export interface Theme {
  colors: Colors;
  gradients: typeof gradients;
  spacing: typeof spacing;
  layout: typeof layout;
  radius: typeof radius;
  typography: typeof typography;
  fonts: typeof fonts;
  elevation: typeof elevation;
  motion: typeof motion;
  opacity: typeof opacity;
  /** Screen is narrower than 360pt — tighten horizontal padding. */
  isCompact: boolean;
  /** Screen is at least 600pt — cap the content column. */
  isTablet: boolean;
  /** Horizontal screen padding for the current width. */
  screenX: number;
  /** True when the OS asks for reduced motion. Collapse transforms to opacity. */
  reduceMotion: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (alive) setReduceMotion(v);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const value = useMemo<Theme>(() => {
    const isCompact = width < layout.compactBreakpoint;
    const isTablet = width >= layout.tabletBreakpoint;

    return {
      colors,
      gradients,
      spacing,
      layout,
      radius,
      typography,
      fonts,
      elevation,
      motion,
      opacity,
      isCompact,
      isTablet,
      screenX: isCompact ? layout.screenXCompact : layout.screenX,
      reduceMotion,
    };
  }, [width, reduceMotion]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>. Wrap the app root.');
  }
  return ctx;
}

/**
 * Builds a StyleSheet from the theme and memoises it per theme identity.
 * Keeps components free of inline colour lookups.
 */
export function useThemedStyles<T>(factory: (t: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
