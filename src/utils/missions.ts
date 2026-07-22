/**
 * Mission Engine derivations (Phase 9).
 *
 * A read-only projection over the simulation engine that adds the "mission system" layer:
 * status, categories, dependencies/unlocks, rewards, company impact, analytics, and a
 * recommendation. Everything is computed from engine data (career missions + ladder + run
 * state) — no mission/career/company is hardcoded, and the engine is not modified.
 */

import {
  getAvailableMissions,
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
  type Mission,
  type MissionType,
  type DifficultyLevel,
} from '../simulation';

export type MissionStatusKind = 'available' | 'active' | 'completed' | 'locked';

export interface AnnotatedMission {
  mission: Mission;
  status: MissionStatusKind;
}

/** Annotates every career mission with its current status. Computes availability once. */
export function annotateMissions(
  career: ResolvedCareer,
  state: SimulationState,
): AnnotatedMission[] {
  const availableIds = new Set(getAvailableMissions(career, state).map((m) => m.id));
  return career.missions.map((mission) => {
    const status: MissionStatusKind = state.completedMissionIds.includes(mission.id)
      ? 'completed'
      : state.activeMissionId === mission.id
        ? 'active'
        : availableIds.has(mission.id)
          ? 'available'
          : 'locked';
    return { mission, status };
  });
}

export function missionStatus(
  career: ResolvedCareer,
  state: SimulationState,
  mission: Mission,
): MissionStatusKind {
  return annotateMissions(career, state).find((a) => a.mission.id === mission.id)?.status ?? 'locked';
}

const DIFFICULTY_ORDER: Record<DifficultyLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

/** Recommends the best next available mission: easiest first, higher reward as tiebreak. */
export function recommendMission(
  career: ResolvedCareer,
  state: SimulationState,
): Mission | undefined {
  const available = getAvailableMissions(career, state);
  if (available.length === 0) return undefined;
  return [...available].sort(
    (a, b) =>
      DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || b.xpReward - a.xpReward,
  )[0];
}

export function estimatedTimeLabel(mission: Mission): string {
  return mission.durationDays <= 1 ? '~1 day' : `~${mission.durationDays} days`;
}

/** XP after the company multiplier — the mission's impact in the chosen environment. */
export function companyImpact(
  mission: Mission,
  companyType: CompanyType,
): { xp: number; label: string } {
  const xp = Math.round(mission.xpReward * companyType.modifiers.xpMultiplier);
  return { xp, label: `+${xp} XP in a ${companyType.name}` };
}

/** Maps the engine's mission type to a human category for grouping/filtering. */
const CATEGORY: Record<MissionType, string> = {
  tutorial: 'Onboarding',
  easy: 'Daily',
  medium: 'Daily',
  advanced: 'Story',
  critical: 'Critical',
  emergency: 'Emergency',
  company_project: 'Client project',
  multi_day: 'Project',
  team: 'Team',
  individual: 'Solo',
};

export function missionCategory(type: MissionType): string {
  return CATEGORY[type];
}

/** The ladder level whose unlocks include this mission (for locked-mission messaging). */
export function unlockLevelTitle(career: ResolvedCareer, missionId: string): string | undefined {
  return career.ladder.find((l) => l.unlocks.includes(missionId))?.title;
}

export interface DifficultyBreakdown {
  level: DifficultyLevel;
  total: number;
  done: number;
}

export interface MissionAnalytics {
  total: number;
  completed: number;
  completionRatio: number;
  missionXp: number;
  avgPerformance: number;
  byDifficulty: DifficultyBreakdown[];
}

/** Mission analytics for the board: completion, XP earned from missions, per-difficulty. */
export function missionAnalytics(
  career: ResolvedCareer,
  state: SimulationState,
  companyType: CompanyType,
): MissionAnalytics {
  const total = career.missions.length;
  const completedSet = new Set(state.completedMissionIds);
  const completed = state.completedMissionIds.length;

  const missionXp = career.missions
    .filter((m) => completedSet.has(m.id))
    .reduce((sum, m) => sum + Math.round(m.xpReward * companyType.modifiers.xpMultiplier), 0);

  const levels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  const byDifficulty = levels
    .map((level) => ({
      level,
      total: career.missions.filter((m) => m.difficulty === level).length,
      done: career.missions.filter((m) => m.difficulty === level && completedSet.has(m.id)).length,
    }))
    .filter((d) => d.total > 0);

  return {
    total,
    completed,
    completionRatio: total ? completed / total : 0,
    missionXp,
    avgPerformance: state.performanceScore,
    byDifficulty,
  };
}
