import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import type { ElevationKey } from '../../theme/tokens';

export type CardVariant = 'solid' | 'glass' | 'outline';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  elevation?: ElevationKey;
  /** Adds the standard 16pt internal padding. Turn off for edge-to-edge media. */
  padded?: boolean;
  style?: ViewStyle;
}

/**
 * The base surface. Every card, sheet, and panel in the app is built from this.
 *
 * `glass` carries the top light edge described in DESIGN_SYSTEM.md §3 — light always
 * falls from above, so the highlight is on `borderTopColor` only.
 */
export function Card({
  variant = 'solid',
  elevation = 'e1',
  padded = true,
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();

  return (
    <View
      {...rest}
      style={[
        {
          borderRadius: theme.radius.lg,
          padding: padded ? theme.layout.cardPadding : 0,
          overflow: 'hidden',
        },
        variant === 'solid' && {
          backgroundColor: theme.colors.surface,
        },
        variant === 'glass' && {
          backgroundColor: theme.colors.glass,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.glassBorder,
          borderTopColor: theme.colors.lightEdge,
          borderTopWidth: 1,
        },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.divider,
        },
        variant !== 'outline' && theme.elevation[elevation],
        style,
      ]}
    >
      {children}
    </View>
  );
}
