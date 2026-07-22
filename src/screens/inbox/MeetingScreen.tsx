import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Button, Card, Badge, SectionHeader, TeamCard, ErrorState } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { buildWorkplace, findMeeting } from '../../utils/workplace';
import type { InboxStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<InboxStackParamList, 'Meeting'>;

export function MeetingScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { meetingId } = route.params;
  const { state, career, companyType } = useSimulation();

  const workplace = useMemo(
    () => (state && career && companyType ? buildWorkplace(career, companyType, state) : null),
    [state, career, companyType],
  );
  const meeting = workplace ? findMeeting(workplace, meetingId) : undefined;

  if (!state || !career || !companyType || !meeting) {
    return (
      <Screen>
        <ErrorState
          title="Meeting not found"
          message="This meeting is no longer on your calendar."
          actionLabel="Back to workplace"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const attendees = meeting.attendeeIds
    .map((id) => career.personas.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // AI Meeting Assistant summary — derived from the meeting's own agenda + attendees.
  const assistantSummary = `${meeting.title} with ${attendees.length} attendee${
    attendees.length === 1 ? '' : 's'
  }. Focus: ${meeting.agenda.join('; ')}.`;

  return (
    <Screen scroll gradient>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back to workplace"
        style={{ alignSelf: 'flex-start', marginTop: theme.spacing[2] }}
      >
        <Text variant="sm" color="secondary">
          ‹ Workplace
        </Text>
      </Pressable>

      <View style={{ marginTop: theme.spacing[5], gap: theme.spacing[2] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
          <Text variant="display" style={{ flex: 1 }}>
            {meeting.title}
          </Text>
          <Badge label={meeting.when} tone="brand" glyph="◷" />
        </View>
      </View>

      {/* AI Meeting Assistant */}
      <Card variant="glass" style={{ marginTop: theme.spacing[5], gap: theme.spacing[2] }}>
        <Text variant="label" color="brand">
          AI meeting assistant
        </Text>
        <Text variant="sm" color="secondary">
          {assistantSummary}
        </Text>
      </Card>

      <View style={{ marginTop: theme.layout.sectionGap }}>
        <SectionHeader title="Agenda" />
        <Card variant="solid" style={{ gap: theme.spacing[2] }}>
          {meeting.agenda.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
              <Text variant="sm" color="brand">
                {i + 1}.
              </Text>
              <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                {item}
              </Text>
            </View>
          ))}
        </Card>
      </View>

      {meeting.notes && (
        <View style={{ marginTop: theme.layout.sectionGap }}>
          <SectionHeader title="Manager notes" />
          <Card variant="solid">
            <Text variant="sm" color="secondary">
              {meeting.notes}
            </Text>
          </Card>
        </View>
      )}

      <View style={{ marginTop: theme.layout.sectionGap }}>
        <SectionHeader title="Attendees" />
        <TeamCard personas={attendees} />
      </View>

      <Button
        label="End meeting"
        fullWidth
        variant="secondary"
        onPress={() => navigation.goBack()}
        style={{ marginTop: theme.layout.sectionGap }}
      />
    </Screen>
  );
}
