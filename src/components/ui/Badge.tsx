import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export type StatusTone = 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps {
  label: string;
  tone?: StatusTone;
  /**
   * A short glyph rendered before the label. Required for non-neutral tones so status is
   * never communicated by colour alone (DESIGN_SYSTEM.md §8).
   */
  glyph?: string;
  style?: ViewStyle;
}

/** Small non-interactive status pill. Semantic colours may only appear here. */
export function Badge({ label, tone = 'neutral', glyph, style }: BadgeProps) {
  const theme = useTheme();

  const fg = {
    neutral: theme.colors.textSecondary,
    brand: theme.colors.brand,
    accent: theme.colors.accent,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
  }[tone];

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[1],
          alignSelf: 'flex-start',
          paddingHorizontal: theme.spacing[2],
          paddingVertical: theme.spacing[1],
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.surface2,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: fg,
        },
        style,
      ]}
    >
      {glyph && (
        <Text variant="xs" style={{ color: fg }}>
          {glyph}
        </Text>
      )}
      <Text variant="xs" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

/** Interactive filter pill. Used for career categories and mission filters. */
export function Chip({ label, selected = false, onPress, style }: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [
        {
          minHeight: 36,
          justifyContent: 'center',
          paddingHorizontal: theme.spacing[4],
          borderRadius: theme.radius.full,
          backgroundColor: selected ? theme.colors.brandMuted : theme.colors.surface2,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: selected ? theme.colors.brand : theme.colors.border,
          opacity: pressed ? theme.opacity.pressed : 1,
        },
        style,
      ]}
    >
      <Text variant="sm" color={selected ? 'brand' : 'secondary'}>
        {label}
      </Text>
    </Pressable>
  );
}
