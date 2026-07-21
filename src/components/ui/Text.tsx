import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { TypographyVariant } from '../../theme/tokens';

type ColorKey = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'brand' | 'accent'
  | 'success' | 'warning' | 'danger' | 'onBrand';

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorKey;
  align?: TextStyle['textAlign'];
  /** Renders the mono face regardless of variant. For IDs, codes, and timers. */
  mono?: boolean;
}

const COLOR_MAP: Record<ColorKey, keyof ReturnType<typeof useTheme>['colors']> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  tertiary: 'textTertiary',
  inverse: 'textInverse',
  brand: 'brand',
  accent: 'accent',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  onBrand: 'onBrand',
};

/**
 * The only way text is rendered in CareerVerse.
 *
 * Never pass fontSize, fontFamily, or a raw colour — pick a `variant` and a `color`.
 * This is what keeps typography identical across all 45 screens.
 */
export function Text({
  variant = 'body',
  color = 'primary',
  align,
  mono = false,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const base = theme.typography[variant];

  return (
    <RNText
      {...rest}
      // Respects the OS font-size setting, capped so layouts stay intact.
      maxFontSizeMultiplier={1.6}
      style={[
        base,
        mono && { fontFamily: theme.fonts.mono, letterSpacing: 0.5 },
        { color: theme.colors[COLOR_MAP[color]] },
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
