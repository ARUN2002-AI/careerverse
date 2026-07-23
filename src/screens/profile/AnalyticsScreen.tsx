import React, { useMemo } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Screen,
  ScreenHeader,
  Text,
  Card,
  Badge,
  StatTile,
  ProgressBar,
  RadialProgress,
  SectionHeader,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { derivePerformanceReport } from '../../utils/analytics';
import { withThousands, titleCase } from '../../utils/format';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Analytics'>;

export function AnalyticsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();

  const report = useMemo(
    () =>
      state && career && companyType
        ? derivePerformanceReport(career, companyType, state)
        : null,
    [state, career, companyType],
  );

  if (!state || !career || !companyType || !report) {
    return (
      <Screen scroll>
        <ScreenHeader title="Performance" onBack={() => navigation.goBack()} backLabel="Profile" />
        <EmptyState
          title="No active career"
          message="Join a company to see how your work trends."
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const gap = theme.layout.sectionGap;
  const completionPct = Math.round(report.completionRatio * 100);

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow={`${career.overview.title} · ${report.tenure}`}
        title="Performance"
        caption="How your work is trending — scored by the AI review of every mission."
        onBack={() => navigation.goBack()}
        backLabel="Profile"
      />

      {/* Performance + completion rings */}
      <Card
        variant="glass"
        style={{ marginTop: theme.spacing[5], flexDirection: 'row', gap: theme.spacing[4] }}
      >
        <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing[2] }}>
          <RadialProgress
            value={report.performanceScore / 100}
            tone="accent"
            centerLabel={`${report.performanceScore}`}
            centerCaption="Score"
            accessibilityLabel={`Performance score ${report.performanceScore} out of 100`}
          />
          <Badge
            label={report.performanceBand}
            tone={report.reviewed === 0 ? 'neutral' : 'accent'}
            glyph="◔"
          />
        </View>
        <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing[2] }}>
          <RadialProgress
            value={report.completionRatio}
            tone="brand"
            centerLabel={`${completionPct}%`}
            centerCaption="Complete"
            accessibilityLabel={`Career ${completionPct} percent complete`}
          />
          <Text variant="xs" color="caption" align="center">
            {report.missionsCompleted}/{report.missionsTotal} missions
          </Text>
        </View>
      </Card>

      {/* Headline stats */}
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3], marginTop: theme.spacing[5] }}
      >
        <StatTile label="Total XP" value={withThousands(report.totalXp)} tone="brand" />
        <StatTile label="Reviewed" value={`${report.reviewed}`} caption="missions scored" />
        <StatTile label="Skills active" value={`${report.skillsStarted}/${report.skillsTotal}`} />
        <StatTile label="Badges" value={`${report.badgesEarned}/${report.badgesTotal}`} />
      </View>

      {/* Mission completion by difficulty */}
      {report.byDifficulty.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader
            title="Missions by difficulty"
            caption="Where your completed work sits on the difficulty curve."
          />
          <Card variant="solid" style={{ gap: theme.spacing[4] }}>
            {report.byDifficulty.map((d) => (
              <ProgressBar
                key={d.level}
                value={d.total > 0 ? d.done / d.total : 0}
                label={titleCase(d.level)}
                trailing={`${d.done}/${d.total}`}
              />
            ))}
          </Card>
        </View>
      )}

      {/* XP sources */}
      <View style={{ marginTop: gap }}>
        <SectionHeader
          title="Where your XP came from"
          caption="Missions carry the most weight in a real career."
        />
        <Card variant="solid" style={{ gap: theme.spacing[4] }}>
          <ProgressBar
            value={report.missionXpRatio}
            label="Missions"
            trailing={`${withThousands(report.missionXp)} XP`}
          />
          <ProgressBar
            value={report.totalXp > 0 ? report.onboardingXp / report.totalXp : 0}
            label="Onboarding & other"
            trailing={`${withThousands(report.onboardingXp)} XP`}
          />
        </Card>
      </View>

      <Text variant="xs" color="caption" align="center" style={{ marginTop: gap }}>
        Your score is the running average of every mission’s AI review in a {companyType.name}.
      </Text>
    </Screen>
  );
}
