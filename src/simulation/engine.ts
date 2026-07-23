/**
 * The simulation engine — pure, career-agnostic progression logic.
 *
 * Every function here takes the resolved career/company DATA plus the current state and
 * returns new state or a derived value. There is no career-specific branching anywhere: the
 * engine only knows the shapes in schema.ts. This is what lets CareerVerse scale from 10 to
 * 1000+ careers without a single engine change — a new career is just new data.
 *
 * Functions are pure (timestamps are passed in, never read from the clock), so the whole
 * engine is trivially testable and safe to run inside a reducer.
 */

import type {
  ResolvedCareer,
  CompanyType,
  CareerLevel,
  Mission,
  SkillCategory,
} from './schema';
import { JOURNEY_PHASES, type JourneyPhase } from './defaults';
import type { SimulationState, SimulationAction } from './state';

// ---------------------------------------------------------------------------
// Level / XP selectors
// ---------------------------------------------------------------------------

/** Ladder sorted ascending by `order`. */
function ladder(career: ResolvedCareer): CareerLevel[] {
  return [...career.ladder].sort((a, b) => a.order - b.order);
}

/** The highest level whose XP requirement the given total XP satisfies. */
export function getLevelForXp(career: ResolvedCareer, totalXp: number): CareerLevel {
  const levels = ladder(career);
  let reached = levels[0];
  for (const level of levels) {
    if (totalXp >= level.xpRequired) reached = level;
    else break;
  }
  return reached;
}

export function getCurrentLevel(career: ResolvedCareer, state: SimulationState): CareerLevel {
  const levels = ladder(career);
  return levels.find((l) => l.order === state.currentLevelOrder) ?? levels[0];
}

export function getNextLevel(
  career: ResolvedCareer,
  state: SimulationState,
): CareerLevel | null {
  const levels = ladder(career);
  return levels.find((l) => l.order === state.currentLevelOrder + 1) ?? null;
}

/** Progress toward the next promotion, for progress bars and the Employee Badge. */
export function getProgressToNextLevel(
  career: ResolvedCareer,
  state: SimulationState,
): { current: CareerLevel; next: CareerLevel | null; ratio: number } {
  const current = getCurrentLevel(career, state);
  const next = getNextLevel(career, state);
  if (!next) return { current, next: null, ratio: 1 };
  const span = next.xpRequired - current.xpRequired;
  const into = state.totalXp - current.xpRequired;
  const ratio = span <= 0 ? 1 : Math.max(0, Math.min(1, into / span));
  return { current, next, ratio };
}

// ---------------------------------------------------------------------------
// Missions
// ---------------------------------------------------------------------------

/** Mission ids unlocked by every level the user has reached (Phase 8 `unlocks`). */
function unlockedMissionIds(career: ResolvedCareer, state: SimulationState): Set<string> {
  const ids = new Set<string>();
  for (const level of ladder(career)) {
    if (level.order <= state.currentLevelOrder) level.unlocks.forEach((id) => ids.add(id));
  }
  return ids;
}

/**
 * Missions the user can start now: unlocked by level, prerequisites met, not yet completed.
 * A career whose missions declare no `unlocks` on any level treats all missions as unlocked,
 * so authors are never forced to wire the ladder to see their missions.
 */
export function getAvailableMissions(
  career: ResolvedCareer,
  state: SimulationState,
): Mission[] {
  const anyUnlocks = career.ladder.some((l) => l.unlocks.length > 0);
  const unlocked = unlockedMissionIds(career, state);
  const done = new Set(state.completedMissionIds);

  return career.missions.filter((m) => {
    if (done.has(m.id)) return false;
    if (anyUnlocks && !unlocked.has(m.id)) return false;
    return m.prerequisites.every((p) => done.has(p));
  });
}

export function getMission(career: ResolvedCareer, missionId: string): Mission | undefined {
  return career.missions.find((m) => m.id === missionId);
}

// ---------------------------------------------------------------------------
// Skills (Phase 7)
// ---------------------------------------------------------------------------

/** Total skill points grouped by category, for the skill report. */
export function getSkillPointsByCategory(
  career: ResolvedCareer,
  state: SimulationState,
): Record<SkillCategory, number> {
  const totals = {} as Record<SkillCategory, number>;
  for (const skill of career.skills) {
    const pts = state.skillPoints[skill.id] ?? 0;
    totals[skill.category] = (totals[skill.category] ?? 0) + pts;
  }
  return totals;
}

// ---------------------------------------------------------------------------
// Badges (Phase 9)
// ---------------------------------------------------------------------------

/**
 * Evaluates every badge's `criteria` against the state and returns all earned ids.
 * Criteria grammar is `rule:arg`:
 *   - `complete_missions:N`  → N missions completed
 *   - `reach_rank:<rank>`    → current level's rank order >= that rank's order
 *   - `performance:N`        → performance score >= N
 */
export function evaluateEarnedBadges(
  career: ResolvedCareer,
  state: SimulationState,
): string[] {
  const rankOrder = (rank: string): number =>
    ladder(career).find((l) => l.rank === rank)?.order ?? Number.POSITIVE_INFINITY;
  const currentRankOrder = getCurrentLevel(career, state).order;

  return career.badges
    .filter((badge) => {
      const [rule, arg] = badge.criteria.split(':');
      switch (rule) {
        case 'complete_missions':
          return state.completedMissionIds.length >= Number(arg);
        case 'reach_rank':
          return currentRankOrder >= rankOrder(arg);
        case 'performance':
          return state.performanceScore >= Number(arg);
        default:
          return false;
      }
    })
    .map((b) => b.id);
}

// ---------------------------------------------------------------------------
// Completion (Phase 10)
// ---------------------------------------------------------------------------

/** A career is complete when every mission is done and the top of the ladder is reached. */
export function isCareerComplete(career: ResolvedCareer, state: SimulationState): boolean {
  const allMissionsDone = career.missions.every((m) =>
    state.completedMissionIds.includes(m.id),
  );
  const topOrder = Math.max(...career.ladder.map((l) => l.order));
  return allMissionsDone && state.currentLevelOrder >= topOrder;
}

// ---------------------------------------------------------------------------
// Core transitions (used by the reducer). All pure.
// ---------------------------------------------------------------------------

export function createSimulation(
  career: ResolvedCareer,
  companyType: CompanyType,
  now: number,
): SimulationState {
  return {
    careerId: career.overview.id,
    companyTypeId: companyType.id,
    phase: 'joining',
    status: 'active',
    totalXp: 0,
    currentLevelOrder: getLevelForXp(career, 0).order,
    skillPoints: {},
    activeMissionId: null,
    completedMissionIds: [],
    completedJoiningStepIds: [],
    completedDailySegmentIds: [],
    earnedBadgeIds: [],
    performanceScore: 0,
    day: 1,
    startedAt: now,
    updatedAt: now,
  };
}

/** Awards XP with the company multiplier applied, then recomputes level and badges. */
function applyXp(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
  baseXp: number,
): SimulationState {
  const gained = Math.round(baseXp * companyType.modifiers.xpMultiplier);
  const totalXp = state.totalXp + gained;
  const currentLevelOrder = getLevelForXp(career, totalXp).order;
  const next: SimulationState = { ...state, totalXp, currentLevelOrder };
  return { ...next, earnedBadgeIds: mergeBadges(next, evaluateEarnedBadges(career, next)) };
}

function mergeBadges(state: SimulationState, earned: string[]): string[] {
  const set = new Set(state.earnedBadgeIds);
  earned.forEach((id) => set.add(id));
  return [...set];
}

function nextPhase(phase: JourneyPhase): JourneyPhase {
  const i = JOURNEY_PHASES.indexOf(phase);
  return i < 0 || i >= JOURNEY_PHASES.length - 1 ? phase : JOURNEY_PHASES[i + 1];
}

/**
 * The reducer. The single, exhaustive place state changes. `career` and `companyType` are
 * looked up by the provider from the registry and passed in, keeping this engine free of any
 * data-loading concern.
 */
export function reduce(
  state: SimulationState | null,
  action: SimulationAction,
  career: ResolvedCareer | null,
  companyType: CompanyType | null,
): SimulationState | null {
  if (action.type === 'RESET') return null;

  // Rehydration from persistence — the save-file is already validated (persistence.ts), so it
  // replaces state wholesale without touching career/company (which the provider re-resolves).
  if (action.type === 'HYDRATE') return action.state;

  if (action.type === 'START') {
    if (!career || !companyType) return state;
    return createSimulation(career, companyType, action.now);
  }

  // Every remaining action needs an active run and its resolved data.
  if (!state || !career || !companyType) return state;

  const stamp = (s: SimulationState): SimulationState => ({ ...s, updatedAt: action.now });

  switch (action.type) {
    case 'COMPLETE_JOINING_STEP': {
      if (state.completedJoiningStepIds.includes(action.stepId)) return state;
      const step = career.joining.find((j) => j.id === action.stepId);
      const withXp = step ? applyXp(career, companyType, state, step.xpReward) : state;
      return stamp({
        ...withXp,
        completedJoiningStepIds: [...state.completedJoiningStepIds, action.stepId],
      });
    }

    case 'COMPLETE_DAILY_SEGMENT': {
      if (state.completedDailySegmentIds.includes(action.segmentId)) return state;
      return stamp({
        ...state,
        completedDailySegmentIds: [...state.completedDailySegmentIds, action.segmentId],
      });
    }

    case 'START_MISSION':
      return stamp({ ...state, activeMissionId: action.missionId });

    case 'COMPLETE_MISSION': {
      if (state.completedMissionIds.includes(action.missionId)) return state;
      const mission = getMission(career, action.missionId);
      if (!mission) return state;

      // Skill points.
      const skillPoints = { ...state.skillPoints };
      for (const reward of mission.skillRewards) {
        skillPoints[reward.skillId] = (skillPoints[reward.skillId] ?? 0) + reward.points;
      }

      // Rolling performance score.
      const done = state.completedMissionIds.length;
      const performanceScore = Math.round(
        (state.performanceScore * done + action.score) / (done + 1),
      );

      let updated: SimulationState = {
        ...state,
        skillPoints,
        performanceScore,
        activeMissionId: null,
        completedMissionIds: [...state.completedMissionIds, action.missionId],
      };
      updated = applyXp(career, companyType, updated, mission.xpReward);

      if (isCareerComplete(career, updated)) {
        updated = { ...updated, status: 'completed', phase: 'completion' };
      }
      return stamp(updated);
    }

    case 'ADVANCE_PHASE':
      return stamp({ ...state, phase: nextPhase(state.phase) });

    case 'ADVANCE_DAY':
      return stamp({ ...state, day: state.day + 1, completedDailySegmentIds: [] });

    default:
      return state;
  }
}
