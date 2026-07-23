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
  ProgressTimeline,
  SectionHeader,
  EmptyState,
  type ProgressTimelineStep,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { deriveProgressionReport, type LevelProgress } from '../../utils/progression';
import { withThousands } from '../../utils/format';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Progression'>;

const STATUS_META = {
  reached: { tone: 'success', glyph: '✓', label: 'Reached' },
  current: { tone: 'brand', glyph: '◉', label: 'You are here' },
  locked: { tone: 'neutral', glyph: '○', label: 'Upcoming' },
} as const;

export function ProgressionScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career } = useSimulation();

  const report = useMemo(
    () => (state && career ? deriveProgressionReport(career, state) : null),
    [state, career],
  );

  if (!state || !career || !report) {
    return (
      <Screen scroll>
        <ScreenHeader title="Career progression" onBack={() => navigation.goBack()} backLabel="Profile" />
        <EmptyState
          title="No active career"
          message="Join a company to start climbing the ladder."
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const gap = theme.layout.sectionGap;
  const nextPct = Math.round(report.ratioToNext * 100);

  const timelineSteps: ProgressTimelineStep[] = report.levels.map((l) => ({
    id: l.level.id,
    title: l.level.title,
    caption:
      l.level.order === 0
        ? 'Starting rung'
        : `${withThousands(l.level.xpRequired)} XP · ${STATUS_META[l.status].label}`,
  }));

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow={career.overview.title}
        title="Career progression"
        caption="Your ladder, the promotions you’ve earned, and what each rung unlocks."
        onBack={() => navigation.goBack()}
        backLabel="Profile"
      />

      {/* Headline stats */}
      <View
        style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3], marginTop: theme.spacing[5] }}
      >
        <StatTile label="Current level" value={report.currentLevel.title} tone="brand" />
        <StatTile label="Promotions" value={`${report.promotionsEarned}`} />
        <StatTile label="Total XP" value={withThousands(state.totalXp)} />
      </View>

      {/* Next promotion / top of ladder */}
      <Card variant="glass" style={{ marginTop: theme.spacing[5], gap: theme.spacing[3] }}>
        {report.nextLevel ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
              <Text variant="label" color="caption" style={{ flex: 1 }}>
                Next promotion
              </Text>
              <Badge label={`${nextPct}%`} tone="brand" glyph="▲" />
            </View>
            <Text variant="h2">{report.nextLevel.title}</Text>
            <ProgressBar
              value={report.ratioToNext}
              label={report.currentLevel.title}
              trailing={`${withThousands(report.xpToNext)} XP to go`}
            />
            {report.nextLevel.responsibilities.length > 0 && (
              <View style={{ gap: theme.spacing[1], marginTop: theme.spacing[1] }}>
                <Text variant="xs" color="caption">
                  New responsibilities you’ll take on
                </Text>
                {report.nextLevel.responsibilities.map((r, i) => (
                  <Text key={i} variant="sm" color="secondary">
                    • {r}
                  </Text>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <Badge label="Top of the ladder" tone="success" glyph="★" />
            <Text variant="h2">{report.currentLevel.title}</Text>
            <Text variant="sm" color="secondary">
              You’ve reached the highest level in this career. Every rung has been climbed.
            </Text>
          </>
        )}
      </Card>

      {/* The ladder at a glance */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="The ladder" caption="Beginner to expert, the full arc of this role." />
        <Card variant="solid">
          <ProgressTimeline steps={timelineSteps} currentIndex={report.currentIndex} />
        </Card>
      </View>

      {/* Per-level detail */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Every level" />
        <View style={{ gap: theme.spacing[3] }}>
          {report.levels.map((l) => (
            <LevelCard key={l.level.id} entry={l} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

/** One rung: title, status, responsibilities, and the missions it unlocks. */
function LevelCard({ entry }: { entry: LevelProgress }) {
  const theme = useTheme();
  const meta = STATUS_META[entry.status];
  const { level } = entry;

  return (
    <Card
      variant={entry.status === 'current' ? 'glass' : 'solid'}
      style={{ gap: theme.spacing[3], opacity: entry.status === 'locked' ? 0.8 : 1 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="h3">{level.title}</Text>
          <Text variant="xs" color="caption">
            {withThousands(level.xpRequired)} XP required
          </Text>
        </View>
        <Badge label={meta.label} tone={meta.tone} glyph={meta.glyph} />
      </View>

      <View style={{ gap: theme.spacing[1] }}>
        {level.responsibilities.map((r, i) => (
          <Text key={i} variant="sm" color="secondary">
            • {r}
          </Text>
        ))}
      </View>

      {entry.unlockedMissionTitles.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
          {entry.unlockedMissionTitles.map((title, i) => (
            <Badge key={i} label={`Unlocks: ${title}`} tone="accent" glyph="◆" />
          ))}
        </View>
      )}
    </Card>
  );
}
