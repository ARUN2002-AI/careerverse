/**
 * The registry — turns raw career/company JSON into validated, resolved objects the rest of
 * the app can trust. This is the boundary between "data" and "engine".
 *
 * Everything is loaded and validated once, lazily, on first access. If a career is malformed
 * it throws with a precise Zod path, so bad plug-in data can never reach a screen.
 */

import companyData from './data/company-types.json';
import { CAREER_SOURCES } from './data/careers';
import { DEFAULT_JOINING_FLOW, DEFAULT_DAILY_FLOW } from './defaults';
import {
  careerDefinitionSchema,
  companyTypeSchema,
  type CompanyType,
  type ResolvedCareer,
} from './schema';

// ---------------------------------------------------------------------------
// Company types (Phase 2)
// ---------------------------------------------------------------------------

let companyCache: CompanyType[] | null = null;

function loadCompanyTypes(): CompanyType[] {
  if (companyCache) return companyCache;
  const raw = (companyData as { companyTypes: unknown[] }).companyTypes;
  companyCache = raw.map((c, i) => {
    const result = companyTypeSchema.safeParse(c);
    if (!result.success) {
      throw new Error(`Invalid company type at index ${i}: ${result.error.message}`);
    }
    return result.data;
  });
  return companyCache;
}

export function listCompanyTypes(): CompanyType[] {
  return loadCompanyTypes();
}

export function getCompanyType(id: string): CompanyType | undefined {
  return loadCompanyTypes().find((c) => c.id === id);
}

// ---------------------------------------------------------------------------
// Careers (all ten phases), resolved with default flows filled in
// ---------------------------------------------------------------------------

let careerCache: ResolvedCareer[] | null = null;

function resolveCareer(raw: unknown, index: number): ResolvedCareer {
  const result = careerDefinitionSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`Invalid career at index ${index}: ${result.error.message}`);
  }
  const { joining, dailyWork, ...rest } = result.data;
  // Fill Phase 3/4 from the shared defaults when a career omits them.
  return {
    ...rest,
    joining: joining ?? DEFAULT_JOINING_FLOW,
    dailyWork: dailyWork ?? DEFAULT_DAILY_FLOW,
  };
}

function loadCareers(): ResolvedCareer[] {
  if (careerCache) return careerCache;
  careerCache = CAREER_SOURCES.map(resolveCareer);
  return careerCache;
}

export function listCareers(): ResolvedCareer[] {
  return loadCareers();
}

export function getCareer(id: string): ResolvedCareer | undefined {
  return loadCareers().find((c) => c.overview.id === id);
}

/** Company types a specific career supports, resolved to full objects. */
export function getCompanyTypesForCareer(careerId: string): CompanyType[] {
  const career = getCareer(careerId);
  if (!career) return [];
  return career.supportedCompanyTypes
    .map((id) => getCompanyType(id))
    .filter((c): c is CompanyType => Boolean(c));
}

/**
 * Validates every registered career and company type. Call once at startup (dev) to fail
 * fast on bad plug-in data. Returns the counts so a caller can log them.
 */
export function validateRegistry(): { careers: number; companyTypes: number } {
  return { careers: loadCareers().length, companyTypes: loadCompanyTypes().length };
}
