/**
 * Skill-development derivations (Phase 7 surface).
 *
 * A read-only projection over the engine that turns raw skill points into a growth report:
 * per-skill proficiency, per-category rollups, and an overall mastery figure. "Potential" for a
 * skill is the total points every mission in the career could award it — so proficiency is
 * "how much of what this career can teach you have you earned", never an invented number.
 *
 * Nothing is hardcoded per career: skills, categories, and rewards all come from the career data
 * and the run state. No clock or RNG is read, so a given run always derives the same report.
 */

import {
  getSkillPointsByCategory,
  type ResolvedCareer,
  type SimulationState,
  type SkillCategory,
  type SkillDefinition,
} from '../simulation';
import { titleCase } from './format';

export type SkillImportance = 'core' | 'important' | 'optional';

export interface SkillProgress {
  id: string;
  name: string;
  category: SkillCategory;
  categoryLabel: string;
  description?: string;
  /** Points earned so far. */
  points: number;
  /** Total points the career's missions could ever award this skill. */
  potential: number;
  /** points / potential, clamped 0–1. Zero when the skill has no trainable missions yet. */
  ratio: number;
  /** Human proficiency band derived from `ratio`. */
  levelLabel: string;
  /** Whether any mission trains this skill at all. */
  trainable: boolean;
  /** From the career's required-skills list, when the ids match. */
  importance?: SkillImportance;
}

export interface CategoryProgress {
  category: SkillCategory;
  label: string;
  points: number;
  potential: number;
  ratio: number;
  skillCount: number;
}

export interface SkillsReport {
  skills: SkillProgress[];
  categories: CategoryProgress[];
  totalPoints: number;
  totalPotential: number;
  /** Overall mastery across every trainable skill. */
  overallRatio: number;
  startedCount: number;
  totalCount: number;
  /** The strongest skill so far (highest ratio, then most points). Undefined before any points. */
  topSkill?: SkillProgress;
}

/** Proficiency band for a 0–1 ratio. Bands, not raw percentages, read like a real skill report. */
export function skillLevelLabel(ratio: number, trainable: boolean): string {
  if (!trainable) return 'Not trained here';
  if (ratio <= 0) return 'Not started';
  if (ratio >= 1) return 'Mastered';
  if (ratio >= 0.75) return 'Advanced';
  if (ratio >= 0.5) return 'Proficient';
  if (ratio >= 0.25) return 'Developing';
  return 'Novice';
}

/** Total points every mission in the career could award, keyed by skill id. */
function potentialBySkill(career: ResolvedCareer): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const mission of career.missions) {
    for (const reward of mission.skillRewards) {
      totals[reward.skillId] = (totals[reward.skillId] ?? 0) + reward.points;
    }
  }
  return totals;
}

function importanceBySkill(career: ResolvedCareer): Record<string, SkillImportance> {
  const map: Record<string, SkillImportance> = {};
  for (const req of career.requiredSkills) map[req.id] = req.importance;
  return map;
}

function toSkillProgress(
  skill: SkillDefinition,
  points: number,
  potential: number,
  importance?: SkillImportance,
): SkillProgress {
  const trainable = potential > 0;
  const ratio = trainable ? Math.max(0, Math.min(1, points / potential)) : 0;
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category,
    categoryLabel: titleCase(skill.category),
    description: skill.description,
    points,
    potential,
    ratio,
    levelLabel: skillLevelLabel(ratio, trainable),
    trainable,
    importance,
  };
}

export function deriveSkillsReport(
  career: ResolvedCareer,
  state: SimulationState,
): SkillsReport {
  const potentials = potentialBySkill(career);
  const importances = importanceBySkill(career);

  const skills = career.skills.map((skill) =>
    toSkillProgress(
      skill,
      state.skillPoints[skill.id] ?? 0,
      potentials[skill.id] ?? 0,
      importances[skill.id],
    ),
  );

  // Sort: highest proficiency first, then most points, then alphabetical — started skills float up.
  const sortedSkills = [...skills].sort(
    (a, b) => b.ratio - a.ratio || b.points - a.points || a.name.localeCompare(b.name),
  );

  // Category rollups. Points come from the engine selector; potential is summed the same way.
  const pointsByCategory = getSkillPointsByCategory(career, state);
  const categoryMap = new Map<SkillCategory, CategoryProgress>();
  for (const skill of skills) {
    const existing =
      categoryMap.get(skill.category) ??
      {
        category: skill.category,
        label: skill.categoryLabel,
        points: 0,
        potential: 0,
        ratio: 0,
        skillCount: 0,
      };
    existing.potential += skill.potential;
    existing.skillCount += 1;
    categoryMap.set(skill.category, existing);
  }
  const categories = [...categoryMap.values()]
    .map((c) => {
      const points = pointsByCategory[c.category] ?? 0;
      return {
        ...c,
        points,
        ratio: c.potential > 0 ? Math.max(0, Math.min(1, points / c.potential)) : 0,
      };
    })
    .sort((a, b) => b.ratio - a.ratio || b.points - a.points || a.label.localeCompare(b.label));

  const totalPoints = skills.reduce((sum, s) => sum + s.points, 0);
  const totalPotential = skills.reduce((sum, s) => sum + s.potential, 0);
  const startedCount = skills.filter((s) => s.points > 0).length;
  const topSkill = sortedSkills.find((s) => s.points > 0);

  return {
    skills: sortedSkills,
    categories,
    totalPoints,
    totalPotential,
    overallRatio: totalPotential > 0 ? Math.max(0, Math.min(1, totalPoints / totalPotential)) : 0,
    startedCount,
    totalCount: skills.length,
    topSkill,
  };
}
