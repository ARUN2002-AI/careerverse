import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface ProgressBarProps {
  /** 0–1. Clamped internally. */
  value: number;
  /** Optional caption on the left above the track. */
  label?: string;
  /** Optional caption on the right above the track. */
  trailing?: string;
  height?: number;
  style?: ViewStyle;
}

/**
 * Generic progress track. Reused for level progression, mission progress, and skill bars.
 * Distinct from JoiningProgress (which adds onboarding "Step X of Y" semantics).
 */
export function ProgressBar({ value, label, trailing, height = 6, style }: ProgressBarProps) {
  const theme = useTheme();
  const ratio = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;

  return (
    <View style={[{ gap: theme.spacing[2] }, style]}>
      {(label || trailing) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing[3] }}>
          {label && (
            <Text variant="sm" color="secondary" style={{ flex: 1 }}>
              {label}
            </Text>
          )}
          {trailing && (
            <Text variant="sm" color="caption">
              {trailing}
            </Text>
          )}
        </View>
      )}
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}
        style={{
          height,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.divider,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${ratio * 100}%`,
            height: '100%',
            borderRadius: theme.radius.full,
            backgroundColor: theme.colors.brand,
          }}
        />
      </View>
    </View>
  );
}
