import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface SegmentedOption {
  key: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (key: string) => void;
  style?: ViewStyle;
}

/**
 * A generic segmented control (tab switcher). Reused for the workplace hub sections and any
 * future view toggles (reports, profile). Accessible via tab roles + selected state.
 */
export function SegmentedControl({ options, value, onChange, style }: SegmentedControlProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        {
          flexDirection: 'row',
          padding: theme.spacing[1],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.divider,
          gap: theme.spacing[1],
        },
        style,
      ]}
    >
      {options.map((opt) => {
        const active = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onChange(opt.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 36,
              borderRadius: theme.radius.sm,
              backgroundColor: active ? theme.colors.brand : 'transparent',
              opacity: pressed && !active ? theme.opacity.pressed : 1,
            })}
          >
            <Text variant="sm" color={active ? 'onBrand' : 'secondary'}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
