import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';

export interface AttendanceCardProps {
  checkInTime: string;
  /** Consecutive working days. */
  streak: number;
  workingHours: string;
  status?: string;
  style?: ViewStyle;
}

/** Attendance state for the day: check-in time, working hours, and streak. Data-driven. */
export function AttendanceCard({
  checkInTime,
  streak,
  workingHours,
  status = 'On the clock',
  style,
}: AttendanceCardProps) {
  const theme = useTheme();

  return (
    <Card variant="glass" style={{ gap: theme.spacing[4], ...style }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
        <Text variant="h3" color="success">
          ✓
        </Text>
        <View style={{ flex: 1 }}>
          <Text variant="bodyMd">Checked in</Text>
          <Text variant="sm" color="secondary">
            {checkInTime}
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: theme.colors.divider }} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ gap: 2 }}>
          <Text variant="label" color="caption">
            Working hours
          </Text>
          <Text variant="bodyMd">{workingHours}</Text>
        </View>
        <View style={{ gap: 2, alignItems: 'center' }}>
          <Text variant="label" color="caption">
            Streak
          </Text>
          <Text variant="bodyMd" color="brand">
            {streak} day{streak === 1 ? '' : 's'}
          </Text>
        </View>
        <View style={{ gap: 2, alignItems: 'flex-end' }}>
          <Text variant="label" color="caption">
            Status
          </Text>
          <Text variant="bodyMd">{status}</Text>
        </View>
      </View>
    </Card>
  );
}
