import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  Screen,
  Text,
  Button,
  Card,
  Badge,
  SectionHeader,
  StatTile,
  ProgressBar,
  EmployeeBadge,
  PersonaCard,
  ChatMessage,
  MissionCard,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import {
  useSimulation,
  getCurrentLevel,
  getProgressToNextLevel,
  getAvailableMissions,
  getMission,
  type Mission,
  type DailyWorkSegment,
  type AiPersona,
} from '../../simulation';
import { deriveEmployeeId } from '../../utils/identity';
import { withThousands } from '../../utils/format';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

/** Deterministic, non-hardcoded "team activity" derived from persona index + the sim day. */
const ACTIVITY_POOL = ['Focusing', 'In a meeting', 'Reviewing work', 'Available', 'Heads-down'];

export function HomeScreen({ navigation }: Props) {
  const { state, career, companyType } = useSimulation();

  const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const goToSimulations = () => navigation.navigate('Simulations', { screen: 'MissionBoard' });

  // Narrowed per-name so each call hits the correct typed navigate overload.
  const onTab = (tab: keyof MainTabParamList) => {
    switch (tab) {
      case 'Careers':
        navigation.navigate('Careers', { screen: 'Catalogue' });
        break;
      case 'Simulations':
        navigation.navigate('Simulations', { screen: 'MissionBoard' });
        break;
      case 'Inbox':
        navigation.navigate('Inbox', { screen: 'Workplace' });
        break;
      case 'Profile':
        navigation.navigate('Profile');
        break;
      case 'Home':
        navigation.navigate('Home');
        break;
    }
  };

  // ---- Empty / transitional states -------------------------------------------------------
  if (!state || !career || !companyType) {
    return (
      <Screen>
        <EmptyState
          title="Your desk is empty"
          message="Pick a career and join a company to start working."
          actionLabel="Browse careers"
          onAction={() => navigation.navigate('Careers', { screen: 'Catalogue' })}
        />
      </Screen>
    );
  }

  if (state.phase === 'joining') {
    return (
      <Screen>
        <EmptyState
          title="Finish onboarding"
          message="You’re mid-way through joining. Complete onboarding to reach your desk."
          actionLabel="Continue onboarding"
          onAction={() => rootNav?.navigate('Joining')}
        />
      </Screen>
    );
  }

  return <HomeWorkspace onSimulations={goToSimulations} onTab={onTab} />;
}

/**
 * The workspace dashboard. Split from the guard component so the hooks below always run with a
 * guaranteed-active run. Every value shown is derived from the engine — nothing is hardcoded.
 */
function HomeWorkspace({
  onSimulations,
  onTab,
}: {
  onSimulations: () => void;
  onTab: (tab: keyof MainTabParamList) => void;
}) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();

  // These are guaranteed by the caller's guard, but narrow for TS.
  const derived = useMemo(() => {
    if (!state || !career || !companyType) return null;
    const level = getCurrentLevel(career, state);
    const progress = getProgressToNextLevel(career, state);
    const missions = getAvailableMissions(career, state);
    const active = state.activeMissionId ? getMission(career, state.activeMissionId) : undefined;
    const currentMission: Mission | undefined = active ?? missions[0];
    const manager = career.personas.find((p) => p.role === 'manager');
    const managerLine = manager
      ? career.dialogues.find((d) => d.personaId === manager.id)?.text
      : undefined;
    const team = career.personas.filter((p) => p.role === 'teammate' || p.role === 'mentor');
    const employeeId = deriveEmployeeId(state, career, companyType);
    return { level, progress, missions, active, currentMission, manager, managerLine, team, employeeId };
  }, [state, career, companyType]);

  if (!state || !career || !companyType || !derived) return null;

  const {
    level,
    progress,
    missions,
    active,
    currentMission,
    manager,
    managerLine,
    team,
    employeeId,
  } = derived;

  const completedSegments = new Set(state.completedDailySegmentIds);
  const gap = theme.layout.sectionGap;

  const xpInto = state.totalXp - progress.current.xpRequired;
  const xpSpan = progress.next ? progress.next.xpRequired - progress.current.xpRequired : 0;

  const notifications = buildNotifications(missions.length, manager, managerLine, level.title, state.totalXp);

  return (
    <Screen scroll gradient>
      {/* Header */}
      <View style={{ marginTop: theme.spacing[4], gap: theme.spacing[1] }}>
        <Text variant="label" color="caption">
          {companyType.name} · Day {state.day}
        </Text>
        <Text variant="display">Your desk</Text>
      </View>

      {/* Employee Badge */}
      <View style={{ marginTop: theme.spacing[5] }}>
        <EmployeeBadge
          roleTitle={career.overview.title}
          companyName={companyType.name}
          employeeId={employeeId}
          levelTitle={level.title}
        />
      </View>

      {/* Stats: XP / Level / Performance / Day */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.spacing[3],
          marginTop: theme.spacing[5],
        }}
      >
        <StatTile label="Level" value={level.title} tone="brand" />
        <StatTile label="XP" value={withThousands(state.totalXp)} />
        <StatTile label="Performance" value={`${state.performanceScore}`} caption="out of 100" />
        <StatTile label="Missions done" value={`${state.completedMissionIds.length}`} />
      </View>

      {/* Level progress */}
      <View style={{ marginTop: theme.spacing[5] }}>
        {progress.next ? (
          <ProgressBar
            value={progress.ratio}
            label={`Progress to ${progress.next.title}`}
            trailing={`${withThousands(xpInto)}/${withThousands(xpSpan)} XP`}
          />
        ) : (
          <Text variant="sm" color="secondary">
            You’ve reached the top of the ladder.
          </Text>
        )}
      </View>

      {/* Current mission */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Current mission" />
        {currentMission ? (
          <MissionCard
            mission={currentMission}
            highlighted
            status={active ? 'active' : 'available'}
            onPress={onSimulations}
          />
        ) : (
          <Card variant="solid">
            <Text variant="sm" color="secondary">
              No missions waiting right now. Great work — check back on the next working day.
            </Text>
          </Card>
        )}
        <Button
          label="Continue working"
          fullWidth
          onPress={onSimulations}
          style={{ marginTop: theme.spacing[4] }}
        />
      </View>

      {/* Today's schedule (the day's calendar) */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Today’s schedule" caption={`Your day-${state.day} rhythm.`} />
        <Card variant="solid" style={{ gap: theme.spacing[3] }}>
          {career.dailyWork.map((segment: DailyWorkSegment) => {
            const done = completedSegments.has(segment.id);
            return (
              <View
                key={segment.id}
                style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}
              >
                <Text variant="sm" color={done ? 'success' : 'caption'}>
                  {done ? '✓' : '○'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyMd">{segment.title}</Text>
                  <Text variant="xs" color="caption">
                    {segment.summary}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>
      </View>

      {/* Today's tasks */}
      <View style={{ marginTop: gap }}>
        <SectionHeader
          title="Today’s tasks"
          caption="What’s in your queue."
          trailing={<Badge label={`${missions.length}`} tone="brand" glyph="◆" />}
        />
        {missions.length > 0 ? (
          <View style={{ gap: theme.spacing[3] }}>
            {missions.slice(0, 4).map((m) => (
              <MissionCard key={m.id} mission={m} status="available" onPress={onSimulations} />
            ))}
          </View>
        ) : (
          <Card variant="solid">
            <Text variant="sm" color="secondary">
              Your queue is clear.
            </Text>
          </Card>
        )}
      </View>

      {/* AI Manager */}
      {manager && (
        <View style={{ marginTop: gap }}>
          <SectionHeader
            title="Your manager"
            trailing={
              <Pressable
                onPress={() => onTab('Inbox')}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Message your manager"
              >
                <Text variant="sm" color="brand">
                  Message
                </Text>
              </Pressable>
            }
          />
          <View style={{ gap: theme.spacing[3] }}>
            <PersonaCard persona={manager} detail={manager.tone} />
            {managerLine && <ChatMessage persona={manager} text={managerLine} channel="slack" />}
          </View>
        </View>
      )}

      {/* Team activity */}
      {team.length > 0 && (
        <View style={{ marginTop: gap }}>
          <SectionHeader title="Team activity" />
          <View style={{ gap: theme.spacing[3] }}>
            {team.map((member, i) => (
              <PersonaCard
                key={member.id}
                persona={member}
                detail={ACTIVITY_POOL[(i + state.day) % ACTIVITY_POOL.length]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Notifications */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Notifications" />
        <Card variant="solid" style={{ gap: theme.spacing[3] }}>
          {notifications.map((n, i) => (
            <View
              key={i}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] }}
            >
              <Text variant="sm" color="brand">
                {n.glyph}
              </Text>
              <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                {n.text}
              </Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Quick actions */}
      <View style={{ marginTop: gap }}>
        <SectionHeader title="Quick actions" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3] }}>
          <QuickAction glyph="▶" label="Missions" onPress={onSimulations} />
          <QuickAction glyph="◈" label="Careers" onPress={() => onTab('Careers')} />
          <QuickAction glyph="✉" label="Inbox" onPress={() => onTab('Inbox')} />
          <QuickAction glyph="◉" label="Profile" onPress={() => onTab('Profile')} />
        </View>
      </View>
    </Screen>
  );
}

function QuickAction({
  glyph,
  label,
  onPress,
}: {
  glyph: string;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexGrow: 1,
        flexBasis: 140,
        minWidth: 140,
        gap: theme.spacing[2],
        padding: theme.spacing[4],
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.divider,
        opacity: pressed ? theme.opacity.pressed : 1,
      })}
    >
      <Text variant="h3" color="brand">
        {glyph}
      </Text>
      <Text variant="bodyMd">{label}</Text>
    </Pressable>
  );
}

interface Notification {
  glyph: string;
  text: string;
}

/** Notifications are derived facts about the run, never hardcoded copy. */
function buildNotifications(
  missionCount: number,
  manager: AiPersona | undefined,
  managerLine: string | undefined,
  levelTitle: string,
  xp: number,
): Notification[] {
  const items: Notification[] = [];
  if (missionCount > 0) {
    items.push({ glyph: '◆', text: `${missionCount} task${missionCount === 1 ? '' : 's'} waiting in your queue.` });
  }
  if (manager && managerLine) {
    items.push({ glyph: '◉', text: `${manager.name}: ${managerLine}` });
  }
  items.push({ glyph: '★', text: `You’re a ${levelTitle} with ${withThousands(xp)} XP.` });
  return items;
}
