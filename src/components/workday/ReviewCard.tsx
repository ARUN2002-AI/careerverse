import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PersonaCard } from '../workplace/PersonaCard';
import type { AiPersona } from '../../simulation';

export interface ReviewCardProps {
  reviewer?: AiPersona;
  /** 0–100. */
  performance: number;
  approved: boolean;
  comment: string;
  recognition?: string;
  style?: ViewStyle;
}

/** A manager review: verdict, performance, comment, and optional recognition. Data-driven. */
export function ReviewCard({
  reviewer,
  performance,
  approved,
  comment,
  recognition,
  style,
}: ReviewCardProps) {
  const theme = useTheme();

  return (
    <Card variant="solid" style={{ gap: theme.spacing[4], ...style }}>
      {reviewer && <PersonaCard persona={reviewer} detail={reviewer.tone} />}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[3] }}>
        <Badge
          label={approved ? 'Approved' : 'Revision requested'}
          tone={approved ? 'success' : 'warning'}
          glyph={approved ? '✓' : '↻'}
        />
        <Text variant="sm" color="caption">
          Performance {performance}/100
        </Text>
      </View>

      <Text variant="sm" color="secondary">
        {comment}
      </Text>

      {recognition && (
        <View
          style={{
            padding: theme.spacing[3],
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.brandSoft,
          }}
        >
          <Text variant="sm" color="primary">
            ★ {recognition}
          </Text>
        </View>
      )}
    </Card>
  );
}
