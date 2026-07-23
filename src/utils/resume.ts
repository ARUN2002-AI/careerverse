/**
 * Résumé derivation (Phase surface: "Auto-built from your run").
 *
 * This is pure composition: it assembles a résumé model from the derivations already built
 * (profile, progression, skills, portfolio) rather than re-deriving anything. Everything comes
 * from career data + run state, so the résumé is a faithful, deterministic record of what the
 * user actually did — no invented employers, dates, or credentials.
 */

import {
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
} from '../simulation';
import { formatDate } from './format';
import { deriveProfileSummary } from './profile';
import { deriveProgressionReport } from './progression';
import { deriveSkillsReport } from './skills';
import { derivePortfolio } from './portfolio';

export interface ResumeExperienceEntry {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface ResumeSkillEntry {
  name: string;
  levelLabel: string;
}

export interface ResumeProject {
  title: string;
  deliverable: string;
}

export interface ResumeModel {
  /** The role, used as the résumé headline. */
  headline: string;
  levelTitle: string;
  company: string;
  employeeId: string;
  email: string;
  period: string;
  summary: string;
  experience: ResumeExperienceEntry[];
  keySkills: ResumeSkillEntry[];
  projects: ResumeProject[];
  certifications: string[];
  complete: boolean;
}

export function deriveResume(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
): ResumeModel {
  const profile = deriveProfileSummary(career, companyType, state);
  const progression = deriveProgressionReport(career, state);
  const skills = deriveSkillsReport(career, state);
  const portfolio = derivePortfolio(career, companyType, state);

  const period = `${formatDate(state.startedAt)} – ${profile.complete ? 'Present · completed' : 'Present'}`;

  // Responsibilities held: every reached (or current) level's responsibilities, in ladder order,
  // de-duplicated so the same duty isn't listed twice as the ladder repeats a theme.
  const heldResponsibilities: string[] = [];
  for (const entry of progression.levels) {
    if (entry.status === 'locked') continue;
    for (const r of entry.level.responsibilities) {
      if (!heldResponsibilities.includes(r)) heldResponsibilities.push(r);
    }
  }

  const deliveredBullet =
    portfolio.delivered > 0
      ? [
          `Delivered ${portfolio.delivered} ${portfolio.delivered === 1 ? 'project' : 'projects'}${
            portfolio.items.length > 0 ? `, including ${portfolio.items.slice(0, 3).map((i) => i.mission.title).join(', ')}` : ''
          }.`,
        ]
      : [];

  const experience: ResumeExperienceEntry[] = [
    {
      title: profile.levelTitle,
      company: `${companyType.name} · ${career.overview.title}`,
      period,
      bullets: [...heldResponsibilities, ...deliveredBullet],
    },
  ];

  const reviewedSentence =
    profile.missionsCompleted > 0
      ? `Completed ${profile.missionsCompleted} ${profile.missionsCompleted === 1 ? 'mission' : 'missions'} with a ${profile.performanceScore}/100 performance score.`
      : '';

  const summaryParts = [
    `${profile.levelTitle} experiencing the ${career.overview.title} career hands-on in a ${companyType.name} environment.`,
    reviewedSentence,
    career.overview.tagline,
  ];
  if (profile.complete) summaryParts.push(career.completion.summaryHeadline);

  const keySkills: ResumeSkillEntry[] = skills.skills
    .filter((s) => s.points > 0)
    .slice(0, 6)
    .map((s) => ({ name: s.name, levelLabel: s.levelLabel }));

  const projects: ResumeProject[] = portfolio.items.map((i) => ({
    title: i.mission.title,
    deliverable: i.deliverable,
  }));

  const certifications = profile.complete
    ? career.certificates.map((c) => c.title)
    : [];

  return {
    headline: career.overview.title,
    levelTitle: profile.levelTitle,
    company: companyType.name,
    employeeId: profile.employeeId,
    email: profile.email,
    period,
    summary: summaryParts.filter(Boolean).join(' '),
    experience,
    keySkills,
    projects,
    certifications,
    complete: profile.complete,
  };
}
