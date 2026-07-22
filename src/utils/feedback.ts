/**
 * Deterministic AI feedback generation.
 *
 * Feedback is NOT random — it is derived from the mission's own rubric and skill rewards plus
 * the user's work-session completion ratio, then scored. The same submission always yields the
 * same feedback. Motivation lines are generic, score-banded UI copy (not fabricated persona
 * dialogue). This is the "use structured data, never fabricate" rule made concrete.
 */

import type { ResolvedCareer, CompanyType, Mission } from '../simulation';

export interface SkillGain {
  skill: string;
  points: number;
}

export interface WorkdayFeedback {
  /** 0–100. */
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skillGains: SkillGain[];
  /** XP that will be awarded (mission base × company multiplier). */
  xp: number;
  motivation: string;
}

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);

export function buildFeedback(
  mission: Mission,
  career: ResolvedCareer,
  companyType: CompanyType,
  workRatio: number,
): WorkdayFeedback {
  // Score scales with how much of the work the user actually completed.
  const score = Math.round(55 + 45 * clamp01(workRatio));
  const strong = score >= 70;

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  // Each rubric criterion becomes a strength or a growth area, graded by the score.
  for (const criterion of mission.rubric) {
    const line = `${criterion.label}: ${criterion.description}`;
    if (strong) strengths.push(line);
    else weaknesses.push(line);
    suggestions.push(`Next time, sharpen your ${criterion.label.toLowerCase()}.`);
  }
  if (strengths.length === 0) {
    strengths.push('You completed the task and submitted your work on time.');
  }

  const skillNameById = new Map(career.skills.map((s) => [s.id, s.name]));
  const skillGains: SkillGain[] = mission.skillRewards.map((r) => ({
    skill: skillNameById.get(r.skillId) ?? r.skillId,
    points: r.points,
  }));

  const xp = Math.round(mission.xpReward * companyType.modifiers.xpMultiplier);

  const motivation =
    score >= 85
      ? 'Excellent work — this is the standard we want.'
      : score >= 70
        ? 'Solid work. A couple of refinements and it’s great.'
        : 'Good start. Apply this feedback and you’ll level up fast.';

  return { score, strengths, weaknesses, suggestions, skillGains, xp, motivation };
}
