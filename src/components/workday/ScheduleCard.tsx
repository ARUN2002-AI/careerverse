import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import type { DailyWorkSegment } from '../../simulation';

export interface ScheduleCardProps {
  segments: DailyWorkSegment[];
  /** Ids of segments already completed today. */
  completedIds: string[];
  style?: ViewStyle;
}

/** The day's schedule (from career.dailyWork), with completed segments ticked. Reusable. */
export function ScheduleCard({ segments, completedIds, style }: ScheduleCardProps) {
  const theme = useTheme();
  const done = new Set(completedIds);

  return (
    <Card variant="solid" style={{ gap: theme.spacing[3], ...style }}>
      {segments.map((segment) => {
        const complete = done.has(segment.id);
        return (
          <View
            key={segment.id}
            style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}
          >
            <Text variant="sm" color={complete ? 'success' : 'caption'}>
              {complete ? '✓' : '○'}
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
  );
}
