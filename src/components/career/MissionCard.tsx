import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Badge, type StatusTone } from '../ui/Badge';
import { DifficultyBadge } from './DifficultyBadge';
import type { Mission, MissionType } from '../../simulation';

const TYPE_LABEL: Record<MissionType, string> = {
  tutorial: 'Tutorial',
  easy: 'Easy',
  medium: 'Medium',
  advanced: 'Advanced',
  critical: 'Critical',
  emergency: 'Emergency',
  company_project: 'Project',
  multi_day: 'Multi-day',
  team: 'Team',
  individual: 'Solo',
};

export type MissionStatus = 'available' | 'active' | 'done';

const STATUS: Record<MissionStatus, { tone: StatusTone; glyph: string; label: string }> = {
  available: { tone: 'neutral', glyph: '○', label: 'Available' },
  active: { tone: 'brand', glyph: '◐', label: 'In progress' },
  done: { tone: 'success', glyph: '✓', label: 'Done' },
};

export interface MissionCardProps {
  mission: Mission;
  onPress?: () => void;
  /** Highlighted variant for the "current mission" hero. */
  highlighted?: boolean;
  status?: MissionStatus;
}

/**
 * Presentational card for a single mission. Reused by the Home workspace and the Mission
 * Engine (Phase 9). Renders any mission from data — no mission is hardcoded.
 */
export function MissionCard({ mission, onPress, highlighted, status }: MissionCardProps) {
  const theme = useTheme();

  const body = (
    <Card variant={highlighted ? 'glass' : 'solid'} style={{ gap: theme.spacing[3] }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] }}>
        <Text variant="h3" style={{ flex: 1 }}>
          {mission.title}
        </Text>
        <Text variant="mono" color="brand">
          +{mission.xpReward} XP
        </Text>
      </View>

      <Text variant="sm" color="secondary" numberOfLines={2}>
        {mission.brief}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
        <DifficultyBadge level={mission.difficulty} />
        <Badge label={TYPE_LABEL[mission.type]} tone="neutral" />
        <Badge label={mission.scope === 'team' ? 'Team' : 'Solo'} tone="neutral" />
        {status && (
          <Badge label={STATUS[status].label} tone={STATUS[status].tone} glyph={STATUS[status].glyph} />
        )}
      </View>
    </Card>
  );

  if (!onPress) return body;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}. ${mission.brief}`}
      style={({ pressed }) => ({ opacity: pressed ? theme.opacity.pressed : 1 })}
    >
      {body}
    </Pressable>
  );
}
