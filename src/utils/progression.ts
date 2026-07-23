/**
 * Career-progression derivations (Phase 8 surface): the ladder, promotions earned, and what the
 * next promotion unlocks.
 *
 * A read-only projection over the engine. The ladder, its XP thresholds, responsibilities, and
 * unlocks all come from the career data; the current position and XP come from the run. No level
 * or title is hardcoded — a 3-rung career and a 9-rung career both render from the same shape.
 */

import {
  getCurrentLevel,
  getNextLevel,
  getProgressToNextLevel,
  type ResolvedCareer,
  type SimulationState,
  type CareerLevel,
} from '../simulation';

export type LevelStatus = 'reached' | 'current' | 'locked';

export interface LevelProgress {
  level: CareerLevel;
  status: LevelStatus;
  /** Titles of the missions this level unlocks (unresolved ids fall through as-is). */
  unlockedMissionTitles: string[];
}

export interface ProgressionReport {
  /** Levels ascending by ladder order. */
  levels: LevelProgress[];
  currentLevel: CareerLevel;
  nextLevel: CareerLevel | null;
  /** Index of the current level within `levels` — feeds ProgressTimeline's `currentIndex`. */
  currentIndex: number;
  /** Progress toward the next promotion, 0–1. */
  ratioToNext: number;
  xpToNext: number;
  /** Promotions earned so far (every rung climbed above the starting rung). */
  promotionsEarned: number;
  totalLevels: number;
  atTop: boolean;
}

/** Resolve a level's `unlocks` ids to mission titles for human-readable "what this grants". */
function unlockTitles(career: ResolvedCareer, level: CareerLevel): string[] {
  return level.unlocks.map((id) => career.missions.find((m) => m.id === id)?.title ?? id);
}

export function deriveProgressionReport(
  career: ResolvedCareer,
  state: SimulationState,
): ProgressionReport {
  const ordered = [...career.ladder].sort((a, b) => a.order - b.order);
  const currentLevel = getCurrentLevel(career, state);
  const nextLevel = getNextLevel(career, state);
  const progress = getProgressToNextLevel(career, state);

  const levels: LevelProgress[] = ordered.map((level) => ({
    level,
    status:
      level.order < currentLevel.order
        ? 'reached'
        : level.order === currentLevel.order
          ? 'current'
          : 'locked',
    unlockedMissionTitles: unlockTitles(career, level),
  }));

  const currentIndex = Math.max(
    0,
    levels.findIndex((l) => l.level.order === currentLevel.order),
  );

  // The lowest ladder order is the starting rung; every rung above it that's been reached is a
  // promotion. Using order relative to the ladder's own base keeps this correct for any ladder.
  const baseOrder = ordered[0]?.order ?? 0;

  return {
    levels,
    currentLevel,
    nextLevel,
    currentIndex,
    ratioToNext: progress.ratio,
    xpToNext: nextLevel ? Math.max(0, nextLevel.xpRequired - state.totalXp) : 0,
    promotionsEarned: Math.max(0, currentLevel.order - baseOrder),
    totalLevels: ordered.length,
    atTop: nextLevel === null,
  };
}
