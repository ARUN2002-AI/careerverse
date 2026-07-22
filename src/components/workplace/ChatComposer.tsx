import React, { useState } from 'react';
import { Pressable, TextInput, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface ChatComposerProps {
  onSend: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

/** Message composer: an input plus a send action. Reused by every chat surface. */
export function ChatComposer({ onSend, placeholder = 'Message…', style }: ChatComposerProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const trimmed = text.trim();

  const send = () => {
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2],
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.divider,
        },
        style,
      ]}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textCaption}
        selectionColor={theme.colors.brand}
        onSubmitEditing={send}
        returnKeyType="send"
        maxFontSizeMultiplier={1.6}
        accessibilityLabel="Message input"
        style={[
          theme.typography.body,
          { flex: 1, color: theme.colors.textPrimary, paddingVertical: theme.spacing[2] },
        ]}
      />
      <Pressable
        onPress={send}
        disabled={!trimmed}
        accessibilityRole="button"
        accessibilityLabel="Send message"
        accessibilityState={{ disabled: !trimmed }}
        hitSlop={8}
        style={{
          width: 36,
          height: 36,
          borderRadius: theme.radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: trimmed ? theme.colors.brand : theme.colors.divider,
        }}
      >
        <Text variant="bodyMd" color={trimmed ? 'onBrand' : 'caption'}>
          ↑
        </Text>
      </Pressable>
    </View>
  );
}
