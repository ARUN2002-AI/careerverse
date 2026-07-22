import React from 'react';

import { Badge, type StatusTone } from '../ui/Badge';
import type { DifficultyLevel } from '../../simulation';

/**
 * Maps a career's difficulty (engine data) to a Badge. The glyph carries the level with an
 * increasingly filled disc, so difficulty is never communicated by colour alone
 * (DESIGN_SYSTEM.md §8). Purely data-driven — no career is hardcoded.
 */
const DIFFICULTY: Record<DifficultyLevel, { tone: StatusTone; glyph: string; label: string }> = {
  beginner: { tone: 'success', glyph: '○', label: 'Beginner' },
  intermediate: { tone: 'accent', glyph: '◐', label: 'Intermediate' },
  advanced: { tone: 'warning', glyph: '◑', label: 'Advanced' },
  expert: { tone: 'danger', glyph: '●', label: 'Expert' },
};

export function DifficultyBadge({ level }: { level: DifficultyLevel }) {
  const d = DIFFICULTY[level];
  return <Badge label={d.label} tone={d.tone} glyph={d.glyph} />;
}
