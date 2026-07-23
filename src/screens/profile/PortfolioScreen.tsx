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
  DifficultyBadge,
  SectionHeader,
  EmptyState,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { useSimulation } from '../../simulation';
import { derivePortfolio, type PortfolioItem } from '../../utils/portfolio';
import { withThousands } from '../../utils/format';
import type {
  ProfileStackParamList,
  MainTabParamList,
} from '../../navigation/types';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Portfolio'>;

export function PortfolioScreen({ navigation }: Props) {
  const theme = useTheme();
  const { state, career, companyType } = useSimulation();
  const tabNav = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();

  const report = useMemo(
    () =>
      state && career && companyType ? derivePortfolio(career, companyType, state) : null,
    [state, career, companyType],
  );

  if (!state || !career || !companyType || !report) {
    return (
      <Screen scroll>
        <ScreenHeader title="Portfolio" onBack={() => navigation.goBack()} backLabel="Profile" />
        <EmptyState
          title="No active career"
          message="Join a company and complete missions to build a portfolio."
          style={{ marginTop: theme.spacing[8] }}
        />
      </Screen>
    );
  }

  const gap = theme.layout.sectionGap;

  return (
    <Screen scroll gradient>
      <ScreenHeader
        eyebrow={`${career.overview.title} · ${companyType.name}`}
        title="Portfolio"
        caption="The real work you’ve delivered — every completed mission, shown as a deliverable."
        onBack={() => navigation.goBack()}
        backLabel="Profile"
      />

      {report.delivered === 0 ? (
        <EmptyState
          title="Nothing delivered yet"
          message="Complete your first mission and it will appear here as delivered work."
          actionLabel="Go to missions"
          onAction={() => tabNav?.navigate('Simulations', { screen: 'MissionBoard' })}
          style={{ marginTop: theme.spacing[8] }}
        />
      ) : (
        <>
          {/* Summary */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: theme.spacing[3],
              marginTop: theme.spacing[5],
            }}
          >
            <StatTile
              label="Delivered"
              value={`${report.delivered}/${report.totalMissions}`}
              tone="brand"
            />
            <StatTile label="Skills shown" value={`${report.skillsDemonstrated.length}`} />
            <StatTile label="XP earned" value={withThousands(report.totalXp)} />
          </View>

          {/* Delivered work */}
          <View style={{ marginTop: gap }}>
            <SectionHeader title="Delivered work" caption="Shown in the order you shipped it." />
            <View style={{ gap: theme.spacing[3] }}>
              {report.items.map((item, i) => (
                <PortfolioCard key={item.mission.id} item={item} index={i + 1} />
              ))}
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

/** A single delivered piece of work: what was produced, its class, and the skills it showed. */
function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const theme = useTheme();
  const { mission } = item;

  return (
    <Card variant="solid" style={{ gap: theme.spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="label" color="caption">
            Deliverable {index}
          </Text>
          <Text variant="h3">{item.deliverable}</Text>
          <Text variant="sm" color="secondary">
            {mission.title}
          </Text>
        </View>
        <Text variant="mono" color="brand">
          +{item.xp} XP
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
        <DifficultyBadge level={mission.difficulty} />
        <Badge label={item.category} tone="neutral" />
        <Badge label={mission.scope === 'team' ? 'Team' : 'Solo'} tone="neutral" />
      </View>

      {item.skillsDemonstrated.length > 0 && (
        <View style={{ gap: theme.spacing[1] }}>
          <Text variant="xs" color="caption">
            Skills demonstrated
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            {item.skillsDemonstrated.map((name, i) => (
              <Badge key={i} label={name} tone="accent" glyph="◆" />
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}
