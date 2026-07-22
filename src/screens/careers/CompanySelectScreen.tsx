import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { Screen, Text, Button, CompanyCard, ErrorState } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { getCareer, getCompanyTypesForCareer, useSimulation } from '../../simulation';
import type { CareersStackParamList, RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<CareersStackParamList, 'CompanySelect'>;

function BackRow({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={{ alignSelf: 'flex-start', marginTop: theme.spacing[2] }}
    >
      <Text variant="sm" color="secondary">
        ‹ Back
      </Text>
    </Pressable>
  );
}

export function CompanySelectScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { careerId } = route.params;
  const { start } = useSimulation();

  const career = useMemo(() => getCareer(careerId), [careerId]);
  // Company options are data-driven: the career declares which shared environments it supports.
  const companies = useMemo(() => getCompanyTypesForCareer(careerId), [careerId]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!career) {
    return (
      <Screen>
        <ErrorState
          title="Career not found"
          message="This career is no longer available."
          actionLabel="Back to catalogue"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const onJoin = () => {
    if (!selectedId) return;
    // Phase 1 + 2 → begin the run in the engine, then hand off to the immersive onboarding
    // (Phase 3), which reads this active run. Joining lives at the root, above the tabs.
    const rootNav = navigation
      .getParent()
      ?.getParent<NativeStackNavigationProp<RootStackParamList>>();
    start(careerId, selectedId);
    rootNav?.navigate('Joining');
  };

  return (
    <Screen scroll gradient>
      <BackRow onPress={() => navigation.goBack()} />

      <View style={{ marginTop: theme.spacing[6], gap: theme.spacing[2] }}>
        <Text variant="label" color="caption">
          Choose your workplace
        </Text>
        <Text variant="display">Same role, different worlds</Text>
        <Text variant="body" color="secondary">
          Experience {career.overview.title} inside the company type that fits what you want to
          learn. Each one changes the culture, pace, and what you own.
        </Text>
      </View>

      <View style={{ marginTop: theme.spacing[8], gap: theme.spacing[4] }}>
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            selected={selectedId === company.id}
            onPress={() => setSelectedId(company.id)}
          />
        ))}
      </View>

      <Button
        label={selectedId ? `Join as ${career.overview.title}` : 'Select a company to continue'}
        fullWidth
        disabled={!selectedId}
        onPress={onJoin}
        style={{ marginTop: theme.spacing[8] }}
      />
    </Screen>
  );
}
