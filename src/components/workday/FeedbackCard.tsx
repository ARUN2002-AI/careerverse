import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { WorkdayFeedback } from '../../utils/feedback';

export interface FeedbackCardProps {
  feedback: WorkdayFeedback;
  style?: ViewStyle;
}

function List({ label, items, tone }: { label: string; items: string[]; tone: 'success' | 'warning' | 'brand' }) {
  const theme = useTheme();
  if (items.length === 0) return null;
  return (
    <View style={{ gap: theme.spacing[2] }}>
      <Text variant="label" color="caption">
        {label}
      </Text>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
          <Text variant="sm" color={tone}>
            •
          </Text>
          <Text variant="sm" color="secondary" style={{ flex: 1 }}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Structured AI feedback. Every field comes from the deterministic feedback generator
 * (mission rubric + skills + score) — never fabricated. Reused wherever AI review appears.
 */
export function FeedbackCard({ feedback, style }: FeedbackCardProps) {
  const theme = useTheme();

  return (
    <Card variant="glass" style={{ gap: theme.spacing[5], ...style }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ gap: 2 }}>
          <Text variant="label" color="caption">
            AI review score
          </Text>
          <Text variant="display" color="brand" mono>
            {feedback.score}
          </Text>
        </View>
        <Badge label={`+${feedback.xp} XP`} tone="brand" glyph="★" />
      </View>

      <List label="Strengths" items={feedback.strengths} tone="success" />
      <List label="Areas to improve" items={feedback.weaknesses} tone="warning" />
      <List label="Suggestions" items={feedback.suggestions} tone="brand" />

      {feedback.skillGains.length > 0 && (
        <View style={{ gap: theme.spacing[2] }}>
          <Text variant="label" color="caption">
            Skill improvement
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            {feedback.skillGains.map((g) => (
              <Badge key={g.skill} label={`${g.skill} +${g.points}`} tone="accent" glyph="◆" />
            ))}
          </View>
        </View>
      )}

      <View
        style={{
          padding: theme.spacing[3],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.brandSoft,
        }}
      >
        <Text variant="sm" color="primary">
          {feedback.motivation}
        </Text>
      </View>
    </Card>
  );
}
