import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface StatTileProps {
  label: string;
  value: string;
  /** Optional supporting line under the value. */
  caption?: string;
  /** Tints the value — e.g. 'brand' for the headline metric. */
  tone?: 'primary' | 'brand' | 'success' | 'warning' | 'danger';
  style?: ViewStyle;
}

/**
 * A compact metric tile (value + label). Reused wherever the app surfaces stats — the Home
 * workspace, Performance (Phase 12), Profile (Phase 18). Grows to fill a wrapping row.
 */
export function StatTile({ label, value, caption, tone = 'primary', style }: StatTileProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel={`${label}: ${value}`}
      style={[
        {
          flexGrow: 1,
          flexBasis: 140,
          minWidth: 140,
          gap: theme.spacing[1],
          padding: theme.spacing[4],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.divider,
        },
        style,
      ]}
    >
      <Text variant="h2" color={tone}>
        {value}
      </Text>
      <Text variant="label" color="caption">
        {label}
      </Text>
      {caption && (
        <Text variant="xs" color="secondary">
          {caption}
        </Text>
      )}
    </View>
  );
}
