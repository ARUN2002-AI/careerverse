import React, { useMemo } from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  Screen,
  ScreenHeader,
  Text,
  Card,
  Badge,
  ProgressBar,
  RadialProgress,
  SectionHeader,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { deriveSkillsReport, type SkillProgress } from '../../utils/skills';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Skills'>;

const IMPORTANCE_TONE = { core: 'brand', important: 'accent', optional: 'neutral' } as const;

export function SkillsScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career } = useSimulation();

  const report = useMemo(
    () => (state && career ? deriveSkillsReport(career, state) : null),
    [state, career],
  );

  if (!state || !career || !report) {
    return (
      <Screen scroll>
        <ScreenHeader title="Skills" onBack={() => navigation.goBack()} backLabel="Profile" />
        <EmptyState
          title="No active career"
          message="Join a company to start growing skills."
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const gap = theme.layout.sectionGap;
  const masteryPct = Math.round(report.overallRatio * 100);

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow={career.overview.title}
        title="Skills"
        caption="What you’re getting better at — earned by doing the work, not studying it."
        onBack={() => navigation.goBack()}
        backLabel="Profile"
      />

      {/* Overall mastery */}
      <Card
        variant="glass"
        style={{ marginTop: theme.spacing[5], flexDirection: 'row', alignItems: 'center', gap: theme.spacing[4] }}
      >
        <RadialProgress
          value={report.overallRatio}
          tone="brand"
          centerLabel={`${masteryPct}%`}
          centerCaption="Mastery"
          accessibilityLabel={`Overall skill mastery ${masteryPct} percent`}
        />
        <View style={{ flex: 1, gap: theme.spacing[2] }}>
          <Text variant="bodyMd">
            {report.topSkill
              ? `Strongest: ${report.topSkill.name}`
              : 'Complete missions to start building skills.'}
          </Text>
          <Text variant="sm" color="secondary">
            {report.startedCount} of {report.totalCount} skills started · {report.totalPoints} of{' '}
            {report.totalPotential} skill points earned.
          </Text>
        </View>
      </Card>

      {/* Category rollups */}
      {report.categories.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader
            title="By skill family"
            caption="How your growth spreads across the role’s skill areas."
          />
          <Card variant="solid" style={{ gap: theme.spacing[4] }}>
            {report.categories.map((cat) => (
              <ProgressBar
                key={cat.category}
                value={cat.ratio}
                label={cat.label}
                trailing={
                  cat.potential > 0 ? `${cat.points}/${cat.potential}` : 'Not trained yet'
                }
              />
            ))}
          </Card>
        </View>
      )}

      {/* Per-skill detail */}
      <View style={{ marginTop: gap }}>
        <SectionHeader
          title="Every skill"
          trailing={<Badge label={`${report.startedCount}/${report.totalCount}`} tone="brand" glyph="◆" />}
        />
        <View style={{ gap: theme.spacing[3] }}>
          {report.skills.map((skill) => (
            <SkillRow key={skill.id} skill={skill} />
          ))}
        </View>
      </View>

      <Text variant="xs" color="caption" align="center" style={{ marginTop: gap }}>
        Skill points are awarded by the AI review of every mission you complete.
      </Text>
    </Screen>
  );
}

/** One skill's growth: name, proficiency band, importance, and a progress track. Local to this
 *  screen (composition of shared primitives), matching the codebase's local-helper pattern. */
function SkillRow({ skill }: { skill: SkillProgress }) {
  const theme = useTheme();
  return (
    <Card variant="solid" style={{ gap: theme.spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="bodyMd">{skill.name}</Text>
          <Text variant="xs" color="caption">
            {skill.categoryLabel}
            {skill.description ? ` · ${skill.description}` : ''}
          </Text>
        </View>
        <Badge
          label={skill.levelLabel}
          tone={skill.ratio >= 1 ? 'success' : skill.points > 0 ? 'brand' : 'neutral'}
          glyph={skill.ratio >= 1 ? '✓' : skill.points > 0 ? '◆' : '○'}
        />
      </View>

      <ProgressBar
        value={skill.ratio}
        trailing={skill.trainable ? `${skill.points}/${skill.potential} pts` : undefined}
      />

      {skill.importance && (
        <Badge
          label={`${skill.importance[0].toUpperCase()}${skill.importance.slice(1)} skill`}
          tone={IMPORTANCE_TONE[skill.importance]}
          glyph="●"
        />
      )}
    </Card>
  );
}
