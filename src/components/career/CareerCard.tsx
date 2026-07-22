import React from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { DifficultyBadge } from './DifficultyBadge';
import { titleCase } from '../../utils/format';
import type { ResolvedCareer } from '../../simulation';

export interface CareerCardProps {
  career: ResolvedCareer;
  onPress: () => void;
}

/**
 * Catalogue tile for a single career. Presentational only — it renders whatever career data
 * it is handed, so any of the 1000+ future careers displays without a code change.
 */
export function CareerCard({ career, onPress }: CareerCardProps) {
  const theme = useTheme();
  const { overview } = career;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${overview.title}. ${overview.tagline}`}
      style={({ pressed }) => ({ opacity: pressed ? theme.opacity.pressed : 1 })}
    >
      <Card variant="glass">
        <View style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.card,
              borderWidth: 1,
              borderColor: theme.colors.glassBorder,
            }}
          >
            <Text variant="h3" color="brand">
              {overview.glyph}
            </Text>
          </View>

          <View style={{ flex: 1, gap: theme.spacing[1] }}>
            <Text variant="label" color="caption">
              {titleCase(overview.category)}
            </Text>
            <Text variant="h3">{overview.title}</Text>
            <Text variant="sm" color="secondary" numberOfLines={2}>
              {overview.tagline}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: theme.spacing[3],
          }}
        >
          <DifficultyBadge level={overview.difficulty} />
          <Text variant="sm" color="caption">
            {career.missions.length} missions · {career.roadmap.length} stages
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
