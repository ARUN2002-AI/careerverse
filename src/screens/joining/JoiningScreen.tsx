import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Button, EmployeeBadge, ErrorState } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation, getCurrentLevel } from '../../simulation';
import { deriveEmployeeId } from '../../utils/identity';
import { getStepRenderer } from './stepRenderers';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Joining'>;

/**
 * Phase 3 container — drives the user through the active run's joining steps, one immersive
 * scene at a time, then lands on the Welcome Completion finale. It is career/company-agnostic:
 * it renders whatever steps `career.joining` contains (career data or the shared default flow).
 */
export function JoiningScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType, completeJoiningStep, advancePhase } = useSimulation();
  const [index, setIndex] = useState(0);

  const goToWorkspace = useCallback(() => {
    // Move past onboarding and reset the stack so Back can't return into it.
    advancePhase();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  }, [advancePhase, navigation]);

  // No active run (e.g. opened out of order) — send the user to pick a career.
  if (!state || !career || !companyType) {
    return (
      <Screen>
        <ErrorState
          title="No active simulation"
          message="Choose a career and company to begin onboarding."
          actionLabel="Go to careers"
          onAction={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        />
      </Screen>
    );
  }

  const steps = career.joining;
  const total = steps.length;

  const handleComplete = () => {
    const step = steps[index];
    if (step) completeJoiningStep(step.id);
    setIndex((i) => i + 1);
  };

  // Welcome Completion finale.
  if (index >= total) {
    const level = getCurrentLevel(career, state);
    const employeeId = deriveEmployeeId(state, career, companyType);

    return (
      <Screen scroll gradient>
        <Animated.View
          entering={theme.reduceMotion ? undefined : FadeIn.duration(theme.motion.slow)}
          style={{ flex: 1 }}
        >
          <CompletionBody
            roleTitle={career.overview.title}
            companyName={companyType.name}
            employeeId={employeeId}
            levelTitle={level.title}
            xp={state.totalXp}
            onEnter={goToWorkspace}
          />
        </Animated.View>
      </Screen>
    );
  }

  const step = steps[index];
  const Renderer = getStepRenderer(step.type);

  return (
    <Screen gradient>
      <Renderer
        key={index}
        step={step}
        current={index + 1}
        total={total}
        career={career}
        companyType={companyType}
        state={state}
        onComplete={handleComplete}
      />
    </Screen>
  );
}

function CompletionBody({
  roleTitle,
  companyName,
  employeeId,
  levelTitle,
  xp,
  onEnter,
}: {
  roleTitle: string;
  companyName: string;
  employeeId: string;
  levelTitle: string;
  xp: number;
  onEnter: () => void;
}) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, gap: theme.spacing[6], paddingTop: theme.spacing[8] }}>
      <View style={{ gap: theme.spacing[2] }}>
        <Text variant="label" color="brand">
          Onboarding complete
        </Text>
        <Text variant="display">You’ve officially joined</Text>
        <Text variant="body" color="secondary">
          You’re now {roleTitle} at a {companyName}. Your badge is live and your desk is ready.
        </Text>
      </View>

      <EmployeeBadge
        roleTitle={roleTitle}
        companyName={companyName}
        employeeId={employeeId}
        levelTitle={levelTitle}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing[4],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.card,
        }}
      >
        <Text variant="sm" color="secondary">
          Onboarding XP earned
        </Text>
        <Text variant="mono" color="brand">
          +{xp} XP
        </Text>
      </View>

      <View style={{ flex: 1 }} />

      <Button label="Enter your workspace" fullWidth onPress={onEnter} />
    </View>
  );
}
