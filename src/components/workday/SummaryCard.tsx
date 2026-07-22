import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { StatTile } from '../ui/StatTile';

export interface SummaryStat {
  label: string;
  value: string;
  caption?: string;
}

export interface SummaryCardProps {
  title: string;
  stats: SummaryStat[];
  /** Optional achievement lines to celebrate. */
  achievements?: string[];
  style?: ViewStyle;
}

/** End-of-day / period summary: a titled block of stat tiles plus optional achievements. */
export function SummaryCard({ title, stats, achievements, style }: SummaryCardProps) {
  const theme = useTheme();

  return (
    <Card variant="solid" style={{ gap: theme.spacing[4], ...style }}>
      <Text variant="h3">{title}</Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[3] }}>
        {stats.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} caption={s.caption} />
        ))}
      </View>

      {achievements && achievements.length > 0 && (
        <View style={{ gap: theme.spacing[2] }}>
          <Text variant="label" color="caption">
            Achievements
          </Text>
          {achievements.map((a, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
              <Text variant="sm" color="warning">
                ★
              </Text>
              <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                {a}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
