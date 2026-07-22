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
  Button,
  Card,
  Chip,
  SectionHeader,
  SegmentedControl,
  StatTile,
  ProgressBar,
  MissionCard,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import {
  annotateMissions,
  recommendMission,
  missionAnalytics,
  missionCategory,
  type MissionStatusKind,
} from '../../utils/missions';
import { titleCase, withThousands } from '../../utils/format';
import type {
  SimulationsStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';

type Props = NativeStackScreenProps<SimulationsStackParamList, 'MissionBoard'>;

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'completed', label: 'Done' },
  { key: 'locked', label: 'Locked' },
];

/** Maps engine status to the MissionCard status prop (locked has no card status). */
function cardStatus(status: MissionStatusKind): 'available' | 'active' | 'done' | undefined {
  return status === 'completed' ? 'done' : status === 'locked' ? undefined : status;
}

const ALL_CATS = '__all__';

export function MissionBoardScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();
  const [statusTab, setStatusTab] = useState('all');
  const [category, setCategory] = useState(ALL_CATS);

  const model = useMemo(() => {
    if (!state || !career || !companyType) return null;
    return {
      annotated: annotateMissions(career, state),
      recommended: recommendMission(career, state),
      analytics: missionAnalytics(career, state, companyType),
    };
  }, [state, career, companyType]);

  if (!state || !career || !companyType || !model) {
    const tabNav = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
    return (
      <Screen>
        <EmptyState
          title="No missions yet"
          message="Join a company to get your first assignments."
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
          message="Complete joining the company to unlock your missions."
          actionLabel="Continue onboarding"
          onAction={() => rootNav?.navigate('Joining')}
        />
      </Screen>
    );
  }

  const { annotated, recommended, analytics } = model;

  const categories = Array.from(new Set(career.missions.map((m) => missionCategory(m.type))));
  const filtered = annotated
    .filter((a) => (statusTab === 'all' ? true : a.status === statusTab))
    .filter((a) => (category === ALL_CATS ? true : missionCategory(a.mission.type) === category));

  return (
    <Screen scroll gradient>
      <View style={{ marginTop: theme.spacing[4], gap: theme.spacing[1] }}>
        <Text variant="label" color="caption">
          {companyType.name}
        </Text>
        <Text variant="display">Mission board</Text>
        <Text variant="body" color="secondary">
          Your assignments, projects, and challenges — do them in today’s work.
        </Text>
      </View>

      <Button
        label="Start today’s work"
        fullWidth
        onPress={() => navigation.navigate('Workday')}
        style={{ marginTop: theme.spacing[5] }}
      />

      {recommended && (
        <View style={{ marginTop: theme.layout.sectionGap }}>
          <SectionHeader title="Recommended for you" caption="Your best next mission." />
          <MissionCard
            mission={recommended}
            highlighted
            status="available"
            onPress={() => navigation.navigate('MissionDetail', { missionId: recommended.id })}
          />
        </View>
      )}

      {/* Analytics */}
      <View style={{ marginTop: theme.layout.sectionGap }}>
        <SectionHeader title="Mission analytics" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3] }}>
          <StatTile label="Completed" value={`${analytics.completed}/${analytics.total}`} tone="brand" />
          <StatTile label="Completion" value={`${Math.round(analytics.completionRatio * 100)}%`} />
          <StatTile label="Mission XP" value={withThousands(analytics.missionXp)} />
          <StatTile label="Avg rating" value={`${analytics.avgPerformance}`} caption="out of 100" />
        </View>
        {analytics.byDifficulty.length > 0 && (
          <Card variant="solid" style={{ marginTop: theme.spacing[3], gap: theme.spacing[3] }}>
            {analytics.byDifficulty.map((d) => (
              <ProgressBar
                key={d.level}
                value={d.total ? d.done / d.total : 0}
                label={titleCase(d.level)}
                trailing={`${d.done}/${d.total}`}
              />
            ))}
          </Card>
        )}
      </View>

      {/* Filters */}
      <SegmentedControl
        options={STATUS_TABS}
        value={statusTab}
        onChange={setStatusTab}
        style={{ marginTop: theme.layout.sectionGap }}
      />
      {categories.length > 1 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing[2],
            marginTop: theme.spacing[3],
          }}
        >
          <Chip label="All" selected={category === ALL_CATS} onPress={() => setCategory(ALL_CATS)} />
          {categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </View>
      )}

      {/* Mission list */}
      <View style={{ marginTop: theme.spacing[5], gap: theme.spacing[3] }}>
        {filtered.length > 0 ? (
          filtered.map((a) => (
            <View key={a.mission.id} style={{ opacity: a.status === 'locked' ? 0.6 : 1 }}>
              <MissionCard
                mission={a.mission}
                status={cardStatus(a.status)}
                onPress={() => navigation.navigate('MissionDetail', { missionId: a.mission.id })}
              />
            </View>
          ))
        ) : (
          <Card variant="solid">
            <Text variant="sm" color="secondary">
              Nothing here in this filter.
            </Text>
          </Card>
        )}
      </View>
    </Screen>
  );
}
