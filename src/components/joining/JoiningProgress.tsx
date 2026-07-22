import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface JoiningProgressProps {
  /** 1-based current step. */
  current: number;
  total: number;
  style?: ViewStyle;
}

/** Top-of-screen onboarding progress: a filled track plus a "Step X of Y" caption. */
export function JoiningProgress({ current, total, style }: JoiningProgressProps) {
  const theme = useTheme();
  const ratio = total <= 0 ? 0 : Math.max(0, Math.min(1, current / total));

  return (
    <View style={[{ gap: theme.spacing[2] }, style]}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: total, now: current }}
        accessibilityLabel={`Onboarding step ${current} of ${total}`}
        style={{
          height: 4,
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
      <Text variant="xs" color="caption">
        Step {current} of {total}
      </Text>
    </View>
  );
}
