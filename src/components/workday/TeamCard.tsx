import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { PersonaCard } from '../workplace/PersonaCard';
import type { AiPersona } from '../../simulation';

export interface TeamCardProps {
  personas: AiPersona[];
  /** Optional per-persona detail line, keyed by persona id. */
  details?: Record<string, string>;
  style?: ViewStyle;
}

/** A roster of workplace personas. Reused by collaboration, team activity, and directories. */
export function TeamCard({ personas, details, style }: TeamCardProps) {
  const theme = useTheme();
  return (
    <View style={[{ gap: theme.spacing[3] }, style]}>
      {personas.map((p) => (
        <PersonaCard key={p.id} persona={p} detail={details?.[p.id] ?? p.title} />
      ))}
    </View>
  );
}
