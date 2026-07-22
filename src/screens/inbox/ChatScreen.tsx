import React, { useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, ChatMessage, ChatComposer, ErrorState } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { buildWorkplace, findThread, nextReply, type WorkMessage } from '../../utils/workplace';
import type { InboxStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<InboxStackParamList, 'Chat'>;

export function ChatScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { threadId } = route.params;
  const { state, career, companyType } = useSimulation();

  const thread = useMemo(
    () =>
      state && career && companyType
        ? findThread(buildWorkplace(career, companyType, state), threadId)
        : undefined,
    [state, career, companyType, threadId],
  );

  const [messages, setMessages] = useState<WorkMessage[]>(() => thread?.messages ?? []);
  const replyCount = useRef(0);
  const scrollRef = useRef<ScrollView>(null);

  if (!state || !career || !companyType || !thread) {
    return (
      <Screen>
        <ErrorState
          title="Conversation not found"
          message="This thread is no longer available."
          actionLabel="Back to workplace"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const send = (text: string) => {
    const selfMsg: WorkMessage = {
      id: `self-${messages.length}`,
      fromSelf: true,
      text,
      channel: thread.channel,
      when: 'Now',
    };
    const reply: WorkMessage = {
      id: `reply-${messages.length}`,
      fromSelf: false,
      fromPersonaId: thread.personaId,
      text: nextReply(thread, replyCount.current),
      channel: thread.channel,
      when: 'Now',
    };
    replyCount.current += 1;
    setMessages((prev) => [...prev, selfMsg, reply]);
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={{ gap: theme.spacing[1], paddingVertical: theme.spacing[3] }}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back to workplace"
            style={{ alignSelf: 'flex-start' }}
          >
            <Text variant="sm" color="secondary">
              ‹ Workplace
            </Text>
          </Pressable>
          <Text variant="h2">{thread.title}</Text>
          <Text variant="sm" color="secondary">
            {thread.subtitle}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ gap: theme.spacing[4], paddingVertical: theme.spacing[4] }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: !theme.reduceMotion })}
        >
          {messages.map((m) => {
            if (m.fromSelf) {
              return (
                <View key={m.id} style={{ alignItems: 'flex-end' }}>
                  <View
                    style={{
                      maxWidth: '82%',
                      padding: theme.spacing[3],
                      borderRadius: theme.radius.md,
                      borderTopRightRadius: theme.radius.sm,
                      backgroundColor: theme.colors.brandSoft,
                      borderWidth: 1,
                      borderColor: theme.colors.brand,
                    }}
                  >
                    <Text variant="sm">{m.text}</Text>
                  </View>
                </View>
              );
            }
            const persona = career.personas.find((p) => p.id === m.fromPersonaId);
            return persona ? (
              <ChatMessage key={m.id} persona={persona} text={m.text} channel={m.channel} />
            ) : null;
          })}
        </ScrollView>

        <ChatComposer onSend={send} style={{ marginBottom: theme.spacing[2] }} />
      </KeyboardAvoidingView>
    </Screen>
  );
}
