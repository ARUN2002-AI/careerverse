import React from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface CheckRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  /** Optional supporting line under the label. */
  description?: string;
  style?: ViewStyle;
}

/**
 * Accessible checkbox row. Reused by every onboarding step that asks the user to confirm,
 * acknowledge, or set up something (workstation, policies, checklist). State is never
 * colour-only — the tick glyph carries it too.
 */
export function CheckRow({ label, checked, onToggle, description, style }: CheckRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          borderWidth: checked ? 1.5 : StyleSheet.hairlineWidth,
          borderColor: checked ? theme.colors.brand : theme.colors.divider,
          opacity: pressed ? theme.opacity.pressed : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: theme.radius.sm,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: checked ? theme.colors.brand : 'transparent',
          borderWidth: checked ? 0 : 1.5,
          borderColor: theme.colors.divider,
        }}
      >
        {checked && (
          <Text variant="sm" color="onBrand">
            ✓
          </Text>
        )}
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyMd">{label}</Text>
        {description && (
          <Text variant="xs" color="caption">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
