import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { PersonaAvatar } from './PersonaAvatar';
import type { AiPersona } from '../../simulation';

export interface PersonaCardProps {
  persona: AiPersona;
  /** Optional extra line, e.g. a role note or status. */
  detail?: string;
  style?: ViewStyle;
}

/** A person in the workplace: avatar + name + title. Fully data-driven from a persona. */
export function PersonaCard({ persona, detail, style }: PersonaCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[3],
          padding: theme.spacing[3],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.divider,
        },
        style,
      ]}
    >
      <PersonaAvatar glyph={persona.glyph} role={persona.role} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyMd">{persona.name}</Text>
        <Text variant="sm" color="secondary">
          {persona.title}
        </Text>
        {detail && (
          <Text variant="xs" color="caption">
            {detail}
          </Text>
        )}
      </View>
    </View>
  );
}
