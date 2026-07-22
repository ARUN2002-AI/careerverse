import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { PersonaAvatar } from './PersonaAvatar';
import type { WorkThread } from '../../utils/workplace';

export interface ThreadRowProps {
  thread: WorkThread;
  onPress: () => void;
  /** When true, the unread indicator is hidden (already opened this session). */
  read?: boolean;
}

/** A conversation list item: avatar, title, last message preview, and unread indicator. */
export function ThreadRow({ thread, onPress, read }: ThreadRowProps) {
  const theme = useTheme();
  const last = thread.messages[thread.messages.length - 1];
  const showUnread = !read && thread.unread > 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${thread.title}. ${thread.subtitle}. ${
        showUnread ? `${thread.unread} unread.` : ''
      }`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing[3],
        padding: theme.spacing[3],
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.divider,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}
    >
      <PersonaAvatar glyph={thread.glyph} role={thread.role} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}>
          <Text variant="bodyMd" style={{ flex: 1 }} numberOfLines={1}>
            {thread.title}
          </Text>
          {showUnread && <Badge label={`${thread.unread}`} tone="brand" />}
        </View>
        <Text variant="sm" color="secondary" numberOfLines={1}>
          {last ? last.text : thread.subtitle}
        </Text>
      </View>
    </Pressable>
  );
}
