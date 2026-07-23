/**
 * Profile derivation — the read-only identity + headline summary for the active run.
 *
 * A projection over the engine: it composes existing selectors (level, progress, badges) and
 * the identity helpers into the shape the Profile hub renders. Nothing here is hardcoded per
 * career or company, and it reads no clock — every value comes from the run's own data.
 */

import {
  getCurrentLevel,
  getNextLevel,
  getProgressToNextLevel,
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
} from '../simulation';
import { deriveEmployeeId, defaultEmailHandle, workspaceEmail } from './identity';
import { formatDate, tenureLabel } from './format';

export interface ProfileSummary {
  roleTitle: string;
  companyName: string;
  levelTitle: string;
  employeeId: string;
  email: string;
  joinedLabel: string;
  tenure: string;
  day: number;
  totalXp: number;
  performanceScore: number;
  /** Progress toward the next promotion (ratio 0–1) and the next level's title, if any. */
  progressRatio: number;
  nextLevelTitle: string | null;
  xpToNext: number;
  missionsCompleted: number;
  /** Distinct skills that have earned at least one point. */
  skillsStarted: number;
  totalSkills: number;
  badgesEarned: number;
  totalBadges: number;
  complete: boolean;
}

export function deriveProfileSummary(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
): ProfileSummary {
  const level = getCurrentLevel(career, state);
  const next = getNextLevel(career, state);
  const progress = getProgressToNextLevel(career, state);
  const email = workspaceEmail(defaultEmailHandle(career), companyType);

  const skillsStarted = Object.values(state.skillPoints).filter((p) => p > 0).length;

  return {
    roleTitle: career.overview.title,
    companyName: companyType.name,
    levelTitle: level.title,
    employeeId: deriveEmployeeId(state, career, companyType),
    email,
    joinedLabel: formatDate(state.startedAt),
    tenure: tenureLabel(state.day),
    day: state.day,
    totalXp: state.totalXp,
    performanceScore: state.performanceScore,
    progressRatio: progress.ratio,
    nextLevelTitle: next?.title ?? null,
    xpToNext: next ? Math.max(0, next.xpRequired - state.totalXp) : 0,
    missionsCompleted: state.completedMissionIds.length,
    skillsStarted,
    totalSkills: career.skills.length,
    badgesEarned: state.earnedBadgeIds.length,
    totalBadges: career.badges.length,
    complete: state.status === 'completed',
  };
}
