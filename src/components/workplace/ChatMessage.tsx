import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { PersonaAvatar } from './PersonaAvatar';
import type { AiPersona, CommChannel } from '../../simulation';

export interface ChatMessageProps {
  persona: AiPersona;
  text: string;
  /** Where the message came from — shown as a small caption. */
  channel?: CommChannel;
  style?: ViewStyle;
}

const CHANNEL_LABEL: Record<CommChannel, string> = {
  slack: 'Team chat',
  email: 'Email',
  meeting: 'Meeting',
  call: 'Call',
  system: 'System',
};

/**
 * A Slack/email-style message from a workplace persona. The message text always comes from
 * career `dialogues` data — never fabricated in the UI. Reused across onboarding and the AI
 * workplace (Phase 6).
 */
export function ChatMessage({ persona, text, channel, style }: ChatMessageProps) {
  const theme = useTheme();

  return (
    <View style={[{ flexDirection: 'row', gap: theme.spacing[3] }, style]}>
      <PersonaAvatar glyph={persona.glyph} role={persona.role} size={40} />
      <View style={{ flex: 1, gap: theme.spacing[1] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}>
          <Text variant="bodyMd">{persona.name}</Text>
          {channel && (
            <Text variant="xs" color="caption">
              {CHANNEL_LABEL[channel]}
            </Text>
          )}
        </View>
        <View
          style={{
            padding: theme.spacing[3],
            borderRadius: theme.radius.md,
            borderTopLeftRadius: theme.radius.sm,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.divider,
          }}
        >
          <Text variant="sm" color="secondary">
            {text}
          </Text>
        </View>
      </View>
    </View>
  );
}
