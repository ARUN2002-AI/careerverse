/**
 * Performance-analytics derivations (Phase surface: "How your work is trending").
 *
 * A read-only projection that composes the existing mission analytics with XP sourcing, a
 * performance band, and run-wide counts. It never re-implements mission math — it builds on
 * `missionAnalytics` — and reads only career data + run state, so nothing is hardcoded and the
 * output is deterministic per run.
 */

import {
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
} from '../simulation';
import { missionAnalytics, type DifficultyBreakdown } from './missions';
import { tenureLabel } from './format';

export interface PerformanceReport {
  /** Rolling AI-review score, 0–100. */
  performanceScore: number;
  /** Human band for the score, so it reads like a review, not a number. */
  performanceBand: string;
  /** Missions reviewed so far (the score's sample size). */
  reviewed: number;

  missionsCompleted: number;
  missionsTotal: number;
  completionRatio: number;
  byDifficulty: DifficultyBreakdown[];

  totalXp: number;
  /** XP from completed missions (company multiplier applied). */
  missionXp: number;
  /** Everything else — onboarding steps and any non-mission XP. Never negative. */
  onboardingXp: number;
  missionXpRatio: number;

  skillsStarted: number;
  skillsTotal: number;
  badgesEarned: number;
  badgesTotal: number;

  day: number;
  tenure: string;
}

export function performanceBand(score: number, reviewed: number): string {
  if (reviewed === 0) return 'Not yet reviewed';
  if (score >= 85) return 'Outstanding';
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Solid';
  return 'Developing';
}

export function derivePerformanceReport(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
): PerformanceReport {
  const missions = missionAnalytics(career, state, companyType);
  const reviewed = state.completedMissionIds.length;
  const missionXp = missions.missionXp;
  const onboardingXp = Math.max(0, state.totalXp - missionXp);
  const skillsStarted = Object.values(state.skillPoints).filter((p) => p > 0).length;

  return {
    performanceScore: state.performanceScore,
    performanceBand: performanceBand(state.performanceScore, reviewed),
    reviewed,

    missionsCompleted: missions.completed,
    missionsTotal: missions.total,
    completionRatio: missions.completionRatio,
    byDifficulty: missions.byDifficulty,

    totalXp: state.totalXp,
    missionXp,
    onboardingXp,
    missionXpRatio: state.totalXp > 0 ? missionXp / state.totalXp : 0,

    skillsStarted,
    skillsTotal: career.skills.length,
    badgesEarned: state.earnedBadgeIds.length,
    badgesTotal: career.badges.length,

    day: state.day,
    tenure: tenureLabel(state.day),
  };
}
