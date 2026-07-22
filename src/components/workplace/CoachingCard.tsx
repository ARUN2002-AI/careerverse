import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { PersonaAvatar } from './PersonaAvatar';
import type { AiPersona } from '../../simulation';
import type { CoachingTip } from '../../utils/workplace';

export interface CoachingCardProps {
  tips: CoachingTip[];
  mentor?: AiPersona;
  style?: ViewStyle;
}

/** AI mentor coaching: daily coaching, skill, and career tips — all derived from run data. */
export function CoachingCard({ tips, mentor, style }: CoachingCardProps) {
  const theme = useTheme();

  return (
    <Card variant="glass" style={{ gap: theme.spacing[4], ...style }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
        {mentor ? (
          <PersonaAvatar glyph={mentor.glyph} role={mentor.role} size={36} />
        ) : (
          <PersonaAvatar glyph="◈" role="mentor" size={36} />
        )}
        <View style={{ flex: 1 }}>
          <Text variant="bodyMd">{mentor ? mentor.name : 'AI Mentor'}</Text>
          <Text variant="xs" color="caption">
            Your coach
          </Text>
        </View>
      </View>

      <View style={{ gap: theme.spacing[3] }}>
        {tips.map((tip) => (
          <View key={tip.id} style={{ gap: 2 }}>
            <Text variant="label" color="brand">
              {tip.label}
            </Text>
            <Text variant="sm" color="secondary">
              {tip.text}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}
