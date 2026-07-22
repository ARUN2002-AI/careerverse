/**
 * CareerVerse Simulation Engine — public API.
 *
 * The rest of the app imports only from here. Screens use the provider + hook and the pure
 * selectors; nothing imports the reducer or the raw JSON directly.
 */

// Provider + hook (app integration)
export { SimulationProvider, useSimulation } from './SimulationProvider';
export type { SimulationContextValue } from './SimulationProvider';

// Registry (catalogue + lookups)
export {
  listCareers,
  getCareer,
  listCompanyTypes,
  getCompanyType,
  getCompanyTypesForCareer,
  validateRegistry,
} from './registry';

// Pure selectors (safe to call in render)
export {
  getCurrentLevel,
  getNextLevel,
  getLevelForXp,
  getProgressToNextLevel,
  getAvailableMissions,
  getMission,
  getSkillPointsByCategory,
  evaluateEarnedBadges,
  isCareerComplete,
} from './engine';

// Reusable defaults
export {
  DEFAULT_JOINING_FLOW,
  DEFAULT_DAILY_FLOW,
  JOURNEY_PHASES,
  LADDER_RANKS,
  DEFAULT_XP_CURVE,
} from './defaults';
export type { JourneyPhase } from './defaults';

// State
export type { SimulationState, SimulationAction } from './state';

// Data contracts + inferred types (for screens that render career content)
export * from './schema';
