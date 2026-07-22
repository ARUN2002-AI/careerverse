import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';

export interface ActivityItem {
  glyph: string;
  text: string;
  when?: string;
}

export interface ActivityCardProps {
  items: ActivityItem[];
  style?: ViewStyle;
}

/** A compact activity feed. Reused for team activity, notifications, and history. */
export function ActivityCard({ items, style }: ActivityCardProps) {
  const theme = useTheme();

  return (
    <Card variant="solid" style={{ gap: theme.spacing[3], ...style }}>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing[3] }}>
          <Text variant="sm" color="brand">
            {item.glyph}
          </Text>
          <Text variant="sm" color="secondary" style={{ flex: 1 }}>
            {item.text}
          </Text>
          {item.when && (
            <Text variant="xs" color="caption">
              {item.when}
            </Text>
          )}
        </View>
      ))}
    </Card>
  );
}
