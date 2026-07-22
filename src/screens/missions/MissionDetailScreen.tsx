import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  SectionHeader,
  DifficultyBadge,
  FeedbackCard,
  ReviewCard,
  ErrorState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation, getMission } from '../../simulation';
import {
  missionStatus,
  estimatedTimeLabel,
  companyImpact,
  missionCategory,
  unlockLevelTitle,
} from '../../utils/missions';
import { buildFeedback } from '../../utils/feedback';
import type { SimulationsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SimulationsStackParamList, 'MissionDetail'>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ marginTop: theme.layout.sectionGap }}>
      <SectionHeader title={title} />
      {children}
    </View>
  );
}

export function MissionDetailScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { missionId } = route.params;
  const { state, career, companyType } = useSimulation();

  const mission = useMemo(
    () => (career ? getMission(career, missionId) : undefined),
    [career, missionId],
  );

  if (!state || !career || !companyType || !mission) {
    return (
      <Screen>
        <ErrorState
          title="Mission not found"
          message="This mission is no longer available."
          actionLabel="Back to board"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const status = missionStatus(career, state, mission);
  const impact = companyImpact(mission, companyType);
  const skillNames = new Map(career.skills.map((s) => [s.id, s.name]));
  const manager = career.personas.find((p) => p.role === 'manager');
  const managerLine = manager
    ? career.dialogues.find((d) => d.personaId === manager.id)?.text
    : undefined;
  const unlockedBy = unlockLevelTitle(career, mission.id);

  const isCompleted = status === 'completed';
  const evaluation = isCompleted
    ? buildFeedback(mission, career, companyType, state.performanceScore / 100)
    : null;

  const primaryLabel =
    status === 'locked'
      ? 'Locked'
      : status === 'completed'
        ? 'Replay (practice)'
        : status === 'active'
          ? 'Continue mission'
          : 'Start mission';

  return (
    <Screen scroll gradient>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Back to board"
        style={{ alignSelf: 'flex-start', marginTop: theme.spacing[2] }}
      >
        <Text variant="sm" color="secondary">
          ‹ Board
        </Text>
      </Pressable>

      {/* Hero */}
      <View style={{ marginTop: theme.spacing[5], gap: theme.spacing[2] }}>
        <Text variant="label" color="caption">
          {missionCategory(mission.type)}
        </Text>
        <Text variant="display">{mission.title}</Text>
        <Text variant="body" color="secondary">
          {mission.brief}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2], marginTop: theme.spacing[2] }}>
          <DifficultyBadge level={mission.difficulty} />
          <Badge label={estimatedTimeLabel(mission)} tone="neutral" glyph="◷" />
          <Badge label={mission.scope === 'team' ? 'Team' : 'Solo'} tone="neutral" />
          {isCompleted && <Badge label="Completed" tone="success" glyph="✓" />}
        </View>
      </View>

      {/* Objectives */}
      <Section title="Objectives">
        <Card variant="solid" style={{ gap: theme.spacing[2] }}>
          {mission.steps.map((s, i) => (
            <Text key={s.id} variant="sm" color="secondary">
              {i + 1}. {s.prompt}
            </Text>
          ))}
        </Card>
      </Section>

      {/* Acceptance criteria */}
      {mission.rubric.length > 0 && (
        <Section title="Acceptance criteria">
          <Card variant="solid" style={{ gap: theme.spacing[2] }}>
            {mission.rubric.map((r) => (
              <Text key={r.id} variant="sm" color="secondary">
                • {r.label} — {r.description}
              </Text>
            ))}
          </Card>
        </Section>
      )}

      {/* Rewards + company impact */}
      <Section title="Rewards & impact">
        <Card variant="solid" style={{ gap: theme.spacing[3] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            <Badge label={`+${mission.xpReward} XP`} tone="brand" glyph="★" />
            {mission.skillRewards.map((r) => (
              <Badge
                key={r.skillId}
                label={`${skillNames.get(r.skillId) ?? r.skillId} +${r.points}`}
                tone="accent"
                glyph="◆"
              />
            ))}
          </View>
          <Text variant="sm" color="secondary">
            Company impact: {impact.label}
          </Text>
        </Card>
      </Section>

      {/* Dependencies / unlock */}
      <Section title="Dependencies">
        <Card variant="solid" style={{ gap: theme.spacing[2] }}>
          {mission.prerequisites.length > 0 ? (
            mission.prerequisites.map((pid) => {
              const prereq = getMission(career, pid);
              const done = state.completedMissionIds.includes(pid);
              return (
                <View key={pid} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}>
                  <Text variant="sm" color={done ? 'success' : 'caption'}>
                    {done ? '✓' : '○'}
                  </Text>
                  <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                    {prereq?.title ?? pid}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text variant="sm" color="secondary">
              No prerequisites.
            </Text>
          )}
          {status === 'locked' && unlockedBy && (
            <Text variant="sm" color="warning">
              Unlocks at {unlockedBy}.
            </Text>
          )}
        </Card>
      </Section>

      {/* Evaluation (completed only) */}
      {evaluation ? (
        <>
          <Section title="AI evaluation">
            <FeedbackCard feedback={evaluation} />
          </Section>
          <Section title="Manager evaluation">
            <ReviewCard
              reviewer={manager}
              performance={evaluation.score}
              approved={evaluation.score >= 60}
              comment={
                managerLine ??
                (evaluation.score >= 60
                  ? 'Approved. Good work on this one.'
                  : 'Needs another pass — see the review notes.')
              }
              recognition={evaluation.score >= 85 ? 'Recognised for outstanding delivery.' : undefined}
            />
          </Section>
        </>
      ) : (
        <Section title="Evaluation">
          <Card variant="solid">
            <Text variant="sm" color="secondary">
              Complete this mission to see your AI and manager evaluation.
            </Text>
          </Card>
        </Section>
      )}

      <Button
        label={primaryLabel}
        fullWidth
        disabled={status === 'locked'}
        variant={isCompleted ? 'secondary' : 'primary'}
        onPress={() => navigation.navigate('MissionRun', { missionId: mission.id })}
        style={{ marginTop: theme.layout.sectionGap }}
      />
    </Screen>
  );
}
