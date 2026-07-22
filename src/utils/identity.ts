/**
 * Deterministic, data-derived identity for the onboarding artifacts (Employee ID, email).
 *
 * Nothing here is hardcoded per company or career — every value is derived from the active
 * run (career id, company id, start time). Deterministic so the same run always shows the same
 * ID/email, and no clock or RNG is read at render time.
 */

import type { ResolvedCareer, CompanyType, SimulationState } from '../simulation';

/** "Enterprise / MNC" -> "enterprise-mnc". */
export function companySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Stable 4-digit-ish number derived from when the run began. */
function runNumber(state: SimulationState): number {
  return (Math.abs(state.startedAt) % 9000) + 1000;
}

/** e.g. "CV-ST-TEM-4821" — company initials · career initials · run number. */
export function deriveEmployeeId(
  state: SimulationState,
  career: ResolvedCareer,
  companyType: CompanyType,
): string {
  const co = companyType.id.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase();
  const ca = career.overview.id.replace(/[^a-z0-9]/gi, '').slice(0, 3).toUpperCase();
  return `CV-${co}${ca}-${runNumber(state)}`;
}

/** Default email handle derived from the role, editable by the user. */
export function defaultEmailHandle(career: ResolvedCareer): string {
  return companySlug(career.overview.title).replace(/-/g, '.');
}

/** Builds the workspace email from a handle and the company environment. */
export function workspaceEmail(handle: string, companyType: CompanyType): string {
  const clean = handle.trim().toLowerCase().replace(/[^a-z0-9.]+/g, '') || 'new.hire';
  return `${clean}@${companySlug(companyType.name)}.cv.work`;
}
