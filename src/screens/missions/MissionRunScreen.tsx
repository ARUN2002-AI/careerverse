import React, { useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Screen,
  Text,
  Card,
  JoiningScene,
  WorkTimer,
  ProgressBar,
  TaskChecklist,
  FeedbackCard,
  ReviewCard,
  ErrorState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation, getMission } from '../../simulation';
import { buildFeedback, type WorkdayFeedback } from '../../utils/feedback';
import type { SimulationsStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<SimulationsStackParamList, 'MissionRun'>;

/**
 * Runs a single mission end-to-end: work (timer + checklist) → submit → AI + manager
 * evaluation. Completing awards XP/skills via the engine's completeMission (a safe no-op when
 * replaying an already-completed mission). Reuses the workday's scene frame and components.
 */
export function MissionRunScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { missionId } = route.params;
  const { state, career, companyType, completeMission } = useSimulation();

  const mission = useMemo(
    () => (career ? getMission(career, missionId) : undefined),
    [career, missionId],
  );

  const [phase, setPhase] = useState<'work' | 'review'>('work');
  const [checked, setChecked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<WorkdayFeedback | null>(null);
  const firedRef = useRef(false);
  const alreadyDoneRef = useRef(Boolean(state?.completedMissionIds.includes(missionId)));

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

  const items = mission.steps.map((s) => ({ id: s.id, label: s.prompt }));
  const ratio = items.length ? checked.length / items.length : 1;
  const manager = career.personas.find((p) => p.role === 'manager');
  const managerLine = manager
    ? career.dialogues.find((d) => d.personaId === manager.id)?.text
    : undefined;

  const submit = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    const fb = buildFeedback(mission, career, companyType, ratio);
    completeMission(missionId, fb.score); // no-op if already completed (replay)
    setFeedback(fb);
    setPhase('review');
  };

  const toggle = (id: string) =>
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  if (phase === 'review' && feedback) {
    return (
      <Screen gradient>
        <JoiningScene
          current={2}
          total={2}
          eyebrow="Mission review"
          title="Your work was reviewed"
          subtitle={mission.title}
          primary={{ label: 'Back to board', onPress: () => navigation.navigate('MissionBoard') }}
          secondary={{ label: 'Mission details', onPress: () => navigation.goBack() }}
        >
          <View style={{ gap: theme.spacing[5] }}>
            {alreadyDoneRef.current && (
              <Card variant="solid">
                <Text variant="sm" color="secondary">
                  Practice run — this mission was already completed, so no new XP was awarded.
                </Text>
              </Card>
            )}
            <FeedbackCard feedback={feedback} />
            <ReviewCard
              reviewer={manager}
              performance={feedback.score}
              approved={feedback.score >= 60}
              comment={
                managerLine ??
                (feedback.score >= 60
                  ? 'Approved. Nicely done.'
                  : 'Give it another pass using the review notes.')
              }
              recognition={feedback.score >= 85 ? 'Recognised for outstanding delivery.' : undefined}
            />
          </View>
        </JoiningScene>
      </Screen>
    );
  }

  return (
    <Screen gradient>
      <JoiningScene
        current={1}
        total={2}
        eyebrow="Mission"
        title={mission.title}
        subtitle={mission.brief}
        primary={{ label: 'Submit for review', onPress: submit }}
        secondary={{ label: 'Cancel', onPress: () => navigation.goBack() }}
      >
        <View style={{ gap: theme.spacing[5] }}>
          <WorkTimer />
          <ProgressBar value={ratio} label="Objectives" trailing={`${checked.length}/${items.length}`} />
          <TaskChecklist items={items} checkedIds={checked} onToggle={toggle} />
        </View>
      </JoiningScene>
    </Screen>
  );
}
