/**
 * Portfolio derivations (Phase surface: "The work you’ve delivered").
 *
 * Every completed mission is a delivered piece of work. This projection turns the run's mission
 * history into portfolio items — deliverable, category, the skills it demonstrated, and its XP in
 * the chosen company. It reuses the mission helpers rather than re-deriving them, reads only
 * career data + run state, and keeps completion order (the order the work was actually shipped).
 */

import {
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
  type Mission,
} from '../simulation';
import { missionCategory, companyImpact } from './missions';

export interface PortfolioItem {
  mission: Mission;
  /** What was produced, e.g. "Resolved incident". */
  deliverable: string;
  /** Human category from the mission type, e.g. "Project", "Emergency". */
  category: string;
  /** Names of the skills this piece of work demonstrated. */
  skillsDemonstrated: string[];
  /** XP the mission earned in this company environment. */
  xp: number;
}

export interface PortfolioReport {
  /** Delivered work, in the order it was shipped. */
  items: PortfolioItem[];
  delivered: number;
  totalMissions: number;
  /** Distinct skills demonstrated across all delivered work. */
  skillsDemonstrated: string[];
  /** XP earned from delivered work (company-adjusted). */
  totalXp: number;
  complete: boolean;
}

export function derivePortfolio(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
): PortfolioReport {
  const skillName = (id: string) => career.skills.find((s) => s.id === id)?.name ?? id;

  // completedMissionIds is stored in completion order — preserve it.
  const items: PortfolioItem[] = state.completedMissionIds
    .map((id) => career.missions.find((m) => m.id === id))
    .filter((m): m is Mission => Boolean(m))
    .map((mission) => ({
      mission,
      deliverable: mission.deliverableLabel,
      category: missionCategory(mission.type),
      skillsDemonstrated: mission.skillRewards.map((r) => skillName(r.skillId)),
      xp: companyImpact(mission, companyType).xp,
    }));

  const skillsDemonstrated = [...new Set(items.flatMap((i) => i.skillsDemonstrated))];
  const totalXp = items.reduce((sum, i) => sum + i.xp, 0);

  return {
    items,
    delivered: items.length,
    totalMissions: career.missions.length,
    skillsDemonstrated,
    totalXp,
    complete: state.status === 'completed',
  };
}
