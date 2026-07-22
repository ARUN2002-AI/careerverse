import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PersonaAvatar } from './PersonaAvatar';
import type { AiPersona } from '../../simulation';
import type { WorkMeeting } from '../../utils/workplace';

export interface MeetingCardProps {
  meeting: WorkMeeting;
  /** All personas, used to resolve attendee avatars. */
  personas: AiPersona[];
  onPress?: () => void;
}

/** A meeting summary: title, time, attendee avatars, agenda preview. Data-driven. */
export function MeetingCard({ meeting, personas, onPress }: MeetingCardProps) {
  const theme = useTheme();
  const attendees = meeting.attendeeIds
    .map((id) => personas.find((p) => p.id === id))
    .filter((p): p is AiPersona => Boolean(p));

  const body = (
    <Card variant="solid" style={{ gap: theme.spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
        <Text variant="h3" style={{ flex: 1 }}>
          {meeting.title}
        </Text>
        <Badge label={meeting.when} tone="brand" glyph="◷" />
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
        {attendees.slice(0, 5).map((p) => (
          <PersonaAvatar key={p.id} glyph={p.glyph} role={p.role} size={32} />
        ))}
      </View>

      <Text variant="sm" color="secondary" numberOfLines={1}>
        {meeting.agenda.join(' · ')}
      </Text>
    </Card>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${meeting.title} at ${meeting.when}`}
      style={({ pressed }) => ({ opacity: pressed ? theme.opacity.pressed : 1 })}
    >
      {body}
    </Pressable>
  );
}
