import React, { useMemo } from 'react';
import { Alert, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  Screen,
  ScreenHeader,
  Text,
  Card,
  Badge,
  StatTile,
  ListRow,
  RadialProgress,
  EmployeeBadge,
  SectionHeader,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { deriveProfileSummary } from '../../utils/profile';
import { withThousands } from '../../utils/format';
import type {
  ProfileStackParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

/** The growth surfaces the Profile hub links to. Data-driven list, not hardcoded screens. */
const GROWTH_LINKS: {
  route: keyof ProfileStackParamList;
  glyph: string;
  title: string;
  caption: string;
}[] = [
  { route: 'Skills', glyph: '◆', title: 'Skills', caption: 'What you’re getting better at' },
  { route: 'Progression', glyph: '▲', title: 'Career progression', caption: 'Your ladder and promotions' },
  { route: 'Analytics', glyph: '◔', title: 'Performance analytics', caption: 'How your work is trending' },
  { route: 'Portfolio', glyph: '▣', title: 'Portfolio', caption: 'The work you’ve delivered' },
  { route: 'Resume', glyph: '≣', title: 'Resume', caption: 'Auto-built from your run' },
  { route: 'Certificate', glyph: '✦', title: 'Certificate', caption: 'Earned on completing the career' },
];

export function ProfileScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType, reset } = useSimulation();

  const tabNav = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
  const rootNav = tabNav?.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const summary = useMemo(
    () => (state && career && companyType ? deriveProfileSummary(career, companyType, state) : null),
    [state, career, companyType],
  );

  // ---- Guards --------------------------------------------------------------------------
  if (!state || !career || !companyType || !summary) {
    return (
      <Screen scroll>
        <ScreenHeader title="Profile" caption="Your badge, growth, and record." />
        <EmptyState
          title="No active career"
          message="Pick a career and join a company to build your profile."
          actionLabel="Browse careers"
          onAction={() => tabNav?.navigate('Careers', { screen: 'Catalogue' })}
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const confirmReset = () => {
    Alert.alert(
      'Reset simulation?',
      'This ends your current run and clears your saved progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            tabNav?.navigate('Careers', { screen: 'Catalogue' });
          },
        },
      ],
    );
  };

  const gap = theme.layout.sectionGap;

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow={`${summary.companyName} · ${summary.tenure}`}
        title="Profile"
        trailing={
          summary.complete ? <Badge label="Career complete" tone="success" glyph="✓" /> : undefined
        }
      />

      {/* Signature badge */}
      <View style={{ marginTop: theme.spacing[5] }}>
        <EmployeeBadge
          roleTitle={summary.roleTitle}
          companyName={summary.companyName}
          employeeId={summary.employeeId}
          levelTitle={summary.levelTitle}
        />
      </View>

      {/* Growth rings — progress to next level + performance */}
      <Card variant="glass" style={{ marginTop: theme.spacing[5], flexDirection: 'row', gap: theme.spacing[4] }}>
        <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing[2] }}>
          <RadialProgress
            value={summary.nextLevelTitle ? summary.progressRatio : 1}
            tone="brand"
            centerLabel={summary.levelTitle}
            centerCaption="Level"
            accessibilityLabel={
              summary.nextLevelTitle
                ? `${Math.round(summary.progressRatio * 100)}% toward ${summary.nextLevelTitle}`
                : 'Top of the ladder reached'
            }
          />
          <Text variant="xs" color="caption" align="center">
            {summary.nextLevelTitle
              ? `${withThousands(summary.xpToNext)} XP to ${summary.nextLevelTitle}`
              : 'Top of the ladder'}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing[2] }}>
          <RadialProgress
            value={summary.performanceScore / 100}
            tone="accent"
            centerLabel={`${summary.performanceScore}`}
            centerCaption="Score"
            accessibilityLabel={`Performance ${summary.performanceScore} out of 100`}
          />
          <Text variant="xs" color="caption" align="center">
            Performance out of 100
          </Text>
        </View>
      </Card>

      {/* Headline stats */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.spacing[3],
          marginTop: theme.spacing[5],
        }}
      >
        <StatTile label="XP" value={withThousands(summary.totalXp)} tone="brand" />
        <StatTile label="Missions" value={`${summary.missionsCompleted}`} />
        <StatTile label="Skills" value={`${summary.skillsStarted}/${summary.totalSkills}`} />
        <StatTile label="Badges" value={`${summary.badgesEarned}/${summary.totalBadges}`} />
      </View>

      {/* Identity record */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Employee record" />
        <Card variant="solid" style={{ gap: theme.spacing[1] }}>
          <RecordRow label="Employee ID" value={summary.employeeId} mono />
          <RecordRow label="Work email" value={summary.email} mono />
          <RecordRow label="Company" value={summary.companyName} />
          <RecordRow label="Current level" value={summary.levelTitle} />
          <RecordRow label="Joined" value={summary.joinedLabel} />
        </Card>
      </View>

      {/* Growth surfaces */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Your growth" caption="Everything you’ve built in this career." />
        <Card variant="solid">
          {GROWTH_LINKS.map((link, i) => (
            <View key={link.route}>
              {i > 0 && <Divider />}
              <ListRow
                glyph={link.glyph}
                title={link.title}
                caption={link.caption}
                onPress={() => navigation.navigate(link.route)}
              />
            </View>
          ))}
        </Card>
      </View>

      {/* Achievements preview */}
      <View style={{ marginTop: gap }}>
        <SectionHeader
          title="Achievements"
          trailing={<Badge label={`${summary.badgesEarned}`} tone="brand" glyph="★" />}
        />
        {summary.badgesEarned > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            {career.badges
              .filter((b) => state.earnedBadgeIds.includes(b.id))
              .map((b) => (
                <Badge key={b.id} label={b.name} tone="brand" glyph={b.glyph} />
              ))}
          </View>
        ) : (
          <Card variant="solid">
            <Text variant="sm" color="secondary">
              No badges yet. Complete missions and earn promotions to unlock them.
            </Text>
          </Card>
        )}
      </View>

      {/* Settings */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Settings" />
        <Card variant="solid">
          <ListRow
            glyph="◈"
            title="Switch career"
            caption="Explore a different career simulation"
            onPress={() => tabNav?.navigate('Careers', { screen: 'Catalogue' })}
          />
          <Divider />
          <ListRow
            glyph="⟲"
            title="Reset simulation"
            caption="End this run and clear saved progress"
            tone="danger"
            onPress={confirmReset}
            hideChevron
          />
        </Card>
      </View>

      <Text
        variant="xs"
        color="caption"
        align="center"
        style={{ marginTop: gap }}
      >
        CareerVerse · You are the employee.
      </Text>
    </Screen>
  );
}

/** A labelled record line inside the employee-record card. */
function RecordRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing[3],
        paddingVertical: theme.spacing[2],
      }}
    >
      <Text variant="sm" color="caption">
        {label}
      </Text>
      <Text variant={mono ? 'mono' : 'sm'} style={{ flexShrink: 1 }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  const theme = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.colors.divider }} />;
}
