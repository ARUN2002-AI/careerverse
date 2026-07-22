import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import type { AiRole } from '../../simulation';

export interface PersonaAvatarProps {
  glyph: string;
  role: AiRole;
  size?: number;
  style?: ViewStyle;
}

/** Maps an AI workplace role to a tint. Kept here so every surface renders a persona alike. */
function roleColor(role: AiRole, theme: ReturnType<typeof useTheme>): string {
  switch (role) {
    case 'manager':
      return theme.colors.brand;
    case 'mentor':
      return theme.colors.accent;
    case 'hr':
      return theme.colors.success;
    case 'teammate':
    default:
      return theme.colors.textSecondary;
  }
}

/**
 * A persona's avatar — a glyph in a tinted disc. Reused by PersonaCard, ChatMessage, and the
 * AI workplace surfaces (Phase 6). No persona is hardcoded; the glyph/role come from data.
 */
export function PersonaAvatar({ glyph, role, size = 44, style }: PersonaAvatarProps) {
  const theme = useTheme();
  const color = roleColor(role, theme);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: theme.radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: color,
        },
        style,
      ]}
    >
      <Text variant="body" style={{ color }}>
        {glyph}
      </Text>
    </View>
  );
}
