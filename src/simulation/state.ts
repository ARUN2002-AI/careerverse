/**
 * Runtime state for a single career simulation run.
 *
 * This is the player's live save-file: which career and company they chose, where they are in
 * the journey, XP, level, skills, missions done, badges earned. It is plain data — the engine
 * (engine.ts) transforms it with pure functions, and the provider (SimulationProvider.tsx)
 * persists it. It is completely career-agnostic: the same shape holds any of the 1000+ careers.
 */

import type { JourneyPhase } from './defaults';

export interface SimulationState {
  /** Chosen career (Phase 1) and company environment (Phase 2). */
  careerId: string;
  companyTypeId: string;

  /** Where the user is in the ten-phase journey. */
  phase: JourneyPhase;
  status: 'active' | 'completed';

  /** Phase 8 progression. */
  totalXp: number;
  /** `order` of the current ladder level (0 = first rung). */
  currentLevelOrder: number;

  /** Phase 7 — accumulated points per skill id. */
  skillPoints: Record<string, number>;

  /** Phase 5 — mission progress. */
  activeMissionId: string | null;
  completedMissionIds: string[];

  /** Phase 3 & 4 — flow progress. */
  completedJoiningStepIds: string[];
  completedDailySegmentIds: string[];

  /** Phase 9 — achievements. */
  earnedBadgeIds: string[];
  /** Rolling performance score 0–100 across reviewed missions. */
  performanceScore: number;

  /** Simulated working day counter, advanced by the daily loop. */
  day: number;

  startedAt: number;
  updatedAt: number;
}

/**
 * Actions the reducer understands. Keeping these as a discriminated union means every state
 * transition is named and exhaustively handled — no screen mutates state directly.
 */
export type SimulationAction =
  /** Replaces the whole run with a persisted save-file on launch (see persistence.ts). */
  | { type: 'HYDRATE'; state: SimulationState | null }
  | { type: 'START'; careerId: string; companyTypeId: string; now: number }
  | { type: 'COMPLETE_JOINING_STEP'; stepId: string; now: number }
  | { type: 'COMPLETE_DAILY_SEGMENT'; segmentId: string; now: number }
  | { type: 'START_MISSION'; missionId: string; now: number }
  | { type: 'COMPLETE_MISSION'; missionId: string; score: number; now: number }
  | { type: 'ADVANCE_PHASE'; now: number }
  | { type: 'ADVANCE_DAY'; now: number }
  | { type: 'RESET' };
