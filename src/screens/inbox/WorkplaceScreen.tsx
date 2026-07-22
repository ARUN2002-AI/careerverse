import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import {
  Screen,
  Text,
  Card,
  SectionHeader,
  SegmentedControl,
  CoachingCard,
  ThreadRow,
  MeetingCard,
  ActivityCard,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { buildWorkplace } from '../../utils/workplace';
import type {
  InboxStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';

type Props = NativeStackScreenProps<InboxStackParamList, 'Workplace'>;

const SECTIONS = [
  { key: 'chats', label: 'Chats' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'alerts', label: 'Alerts' },
];

export function WorkplaceScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();
  const [section, setSection] = useState('chats');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const workplace = useMemo(
    () => (state && career && companyType ? buildWorkplace(career, companyType, state) : null),
    [state, career, companyType],
  );

  if (!state || !career || !companyType || !workplace) {
    const tabNav = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
    return (
      <Screen>
        <EmptyState
          title="No workplace yet"
          message="Join a company to meet your manager, mentor, and team."
          actionLabel="Browse careers"
          onAction={() => tabNav?.navigate('Careers', { screen: 'Catalogue' })}
        />
      </Screen>
    );
  }

  if (state.phase === 'joining') {
    const rootNav = navigation
      .getParent<BottomTabNavigationProp<MainTabParamList>>()
      ?.getParent<NativeStackNavigationProp<RootStackParamList>>();
    return (
      <Screen>
        <EmptyState
          title="Finish onboarding first"
          message="Complete joining the company to unlock your workplace."
          actionLabel="Continue onboarding"
          onAction={() => rootNav?.navigate('Joining')}
        />
      </Screen>
    );
  }

  const openThread = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
    navigation.navigate('Chat', { threadId: id });
  };

  const totalUnread = workplace.threads.reduce(
    (n, t) => n + (readIds.has(t.id) ? 0 : t.unread),
    0,
  );

  return (
    <Screen scroll gradient>
      <View style={{ marginTop: theme.spacing[4], gap: theme.spacing[1] }}>
        <Text variant="label" color="caption">
          {companyType.name}
        </Text>
        <Text variant="display">Workplace</Text>
        {totalUnread > 0 && (
          <Text variant="sm" color="secondary">
            {totalUnread} unread message{totalUnread === 1 ? '' : 's'}
          </Text>
        )}
      </View>

      <View style={{ marginTop: theme.spacing[5] }}>
        <CoachingCard tips={workplace.coaching} mentor={career.personas.find((p) => p.id === workplace.mentorId)} />
      </View>

      <SegmentedControl
        options={SECTIONS}
        value={section}
        onChange={setSection}
        style={{ marginTop: theme.spacing[5] }}
      />

      {section === 'chats' && (
        <View style={{ marginTop: theme.spacing[5], gap: theme.spacing[3] }}>
          {workplace.threads.map((thread) => (
            <ThreadRow
              key={thread.id}
              thread={thread}
              read={readIds.has(thread.id)}
              onPress={() => openThread(thread.id)}
            />
          ))}
        </View>
      )}

      {section === 'meetings' && (
        <View style={{ marginTop: theme.spacing[5], gap: theme.spacing[3] }}>
          {workplace.meetings.length > 0 ? (
            workplace.meetings.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                personas={career.personas}
                onPress={() => navigation.navigate('Meeting', { meetingId: m.id })}
              />
            ))
          ) : (
            <Card variant="solid">
              <Text variant="sm" color="secondary">
                No meetings scheduled.
              </Text>
            </Card>
          )}
        </View>
      )}

      {section === 'alerts' && (
        <View style={{ marginTop: theme.spacing[5] }}>
          <SectionHeader title="Notifications" />
          <ActivityCard
            items={workplace.notifications.map((n) => ({ glyph: n.glyph, text: n.text, when: n.when }))}
          />
        </View>
      )}
    </Screen>
  );
}
