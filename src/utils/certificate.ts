/**
 * Certificate derivation (Phase 10 surface: "Earned on completing the career").
 *
 * The certificate is the capstone: it exists in career data (`certificates` + `completion`) and
 * is *earned* only when the run is complete. This projection returns either the awarded
 * certificate (with the run's real record on it) or the exact requirements still outstanding —
 * never a fabricated award. Reads only career data + run state; deterministic per run.
 */

import {
  getCurrentLevel,
  isCareerComplete,
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
  type Certificate,
} from '../simulation';
import { formatDate } from './format';
import { deriveProfileSummary } from './profile';
import { deriveSkillsReport } from './skills';

export interface CertificateRequirement {
  label: string;
  met: boolean;
  detail: string;
}

export interface CertificateReport {
  certificate: Certificate | null;
  earned: boolean;

  // The record printed on the awarded certificate.
  recipientRole: string;
  company: string;
  levelTitle: string;
  employeeId: string;
  performanceScore: number;
  awardedDate: string;
  missionsCompleted: number;
  missionsTotal: number;
  skillsMastered: number;
  skillsStarted: number;
  summaryHeadline: string;
  improvementAreas: string[];

  // The path to earning it, when not yet complete.
  requirements: CertificateRequirement[];
  progressRatio: number;
}

/** Resolve the completion certificate, falling back to the first defined certificate. */
function resolveCertificate(career: ResolvedCareer): Certificate | null {
  return (
    career.certificates.find((c) => c.id === career.completion.certificateId) ??
    career.certificates[0] ??
    null
  );
}

export function deriveCertificate(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
): CertificateReport {
  const profile = deriveProfileSummary(career, companyType, state);
  const skills = deriveSkillsReport(career, state);
  const earned = isCareerComplete(career, state);

  const missionsTotal = career.missions.length;
  const missionsCompleted = state.completedMissionIds.length;

  const topOrder = Math.max(...career.ladder.map((l) => l.order));
  const topLevel = career.ladder.find((l) => l.order === topOrder);
  const currentOrder = getCurrentLevel(career, state).order;

  const skillsMastered = skills.skills.filter((s) => s.ratio >= 1).length;

  const requirements: CertificateRequirement[] = [
    {
      label: 'Complete every mission',
      met: missionsCompleted >= missionsTotal,
      detail: `${missionsCompleted} of ${missionsTotal} missions completed`,
    },
    {
      label: `Reach ${topLevel?.title ?? 'the top level'}`,
      met: currentOrder >= topOrder,
      detail: `Currently ${profile.levelTitle}`,
    },
  ];

  // Progress blends mission completion (the bulk of the work) with ladder climb toward the top.
  const missionRatio = missionsTotal > 0 ? missionsCompleted / missionsTotal : 0;
  const levelRatio = topOrder > 0 ? Math.min(1, currentOrder / topOrder) : 1;
  const progressRatio = earned ? 1 : Math.max(0, Math.min(1, missionRatio * 0.7 + levelRatio * 0.3));

  return {
    certificate: resolveCertificate(career),
    earned,

    recipientRole: career.overview.title,
    company: companyType.name,
    levelTitle: profile.levelTitle,
    employeeId: profile.employeeId,
    performanceScore: state.performanceScore,
    // updatedAt is the last transition — on a completed run that's the completion moment.
    awardedDate: formatDate(state.updatedAt),
    missionsCompleted,
    missionsTotal,
    skillsMastered,
    skillsStarted: skills.startedCount,
    summaryHeadline: career.completion.summaryHeadline,
    improvementAreas: career.completion.improvementAreas,

    requirements,
    progressRatio,
  };
}
