/**
 * SimulationProvider — the app-facing entry point to the engine.
 *
 * Screens never touch the registry or the reducer directly. They read `useSimulation()` to
 * get the live run and dispatch named actions. This mirrors `ThemeProvider`: one context that
 * owns the concern so no screen re-implements it.
 *
 * The provider resolves the chosen career/company from the registry (cached) and injects the
 * clock, so the engine underneath stays pure and career-agnostic.
 */

import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { getCareer, getCompanyType } from './registry';
import { reduce } from './engine';
import type { SimulationState, SimulationAction } from './state';
import type { ResolvedCareer, CompanyType } from './schema';

function rootReducer(
  state: SimulationState | null,
  action: SimulationAction,
): SimulationState | null {
  const careerId = action.type === 'START' ? action.careerId : state?.careerId;
  const companyTypeId =
    action.type === 'START' ? action.companyTypeId : state?.companyTypeId;

  const career = careerId ? getCareer(careerId) ?? null : null;
  const companyType = companyTypeId ? getCompanyType(companyTypeId) ?? null : null;

  return reduce(state, action, career, companyType);
}

export interface SimulationContextValue {
  /** The live run, or null when no career has been started. */
  state: SimulationState | null;
  /** Resolved career for the active run (null when idle). */
  career: ResolvedCareer | null;
  /** Resolved company environment for the active run (null when idle). */
  companyType: CompanyType | null;

  /** Phase 1 + 2 → 3: begin a run for a chosen career + company. */
  start: (careerId: string, companyTypeId: string) => void;
  /** Phase 3. */
  completeJoiningStep: (stepId: string) => void;
  /** Phase 4. */
  completeDailySegment: (segmentId: string) => void;
  /** Phase 5. */
  startMission: (missionId: string) => void;
  completeMission: (missionId: string, score: number) => void;
  /** Journey control. */
  advancePhase: () => void;
  advanceDay: () => void;
  /** Abandon the run. */
  reset: () => void;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  // TODO: hydrate initial state from persistence (AsyncStorage/SecureStore) once the
  // storage layer lands, and persist on every change. The engine already produces plain
  // serialisable state, so this is a drop-in.
  const [state, dispatch] = useReducer(rootReducer, null);

  const now = () => Date.now();

  const start = useCallback((careerId: string, companyTypeId: string) => {
    dispatch({ type: 'START', careerId, companyTypeId, now: now() });
  }, []);

  const completeJoiningStep = useCallback((stepId: string) => {
    dispatch({ type: 'COMPLETE_JOINING_STEP', stepId, now: now() });
  }, []);

  const completeDailySegment = useCallback((segmentId: string) => {
    dispatch({ type: 'COMPLETE_DAILY_SEGMENT', segmentId, now: now() });
  }, []);

  const startMission = useCallback((missionId: string) => {
    dispatch({ type: 'START_MISSION', missionId, now: now() });
  }, []);

  const completeMission = useCallback((missionId: string, score: number) => {
    dispatch({ type: 'COMPLETE_MISSION', missionId, score, now: now() });
  }, []);

  const advancePhase = useCallback(() => {
    dispatch({ type: 'ADVANCE_PHASE', now: now() });
  }, []);

  const advanceDay = useCallback(() => {
    dispatch({ type: 'ADVANCE_DAY', now: now() });
  }, []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const career = useMemo(
    () => (state ? getCareer(state.careerId) ?? null : null),
    [state],
  );
  const companyType = useMemo(
    () => (state ? getCompanyType(state.companyTypeId) ?? null : null),
    [state],
  );

  const value = useMemo<SimulationContextValue>(
    () => ({
      state,
      career,
      companyType,
      start,
      completeJoiningStep,
      completeDailySegment,
      startMission,
      completeMission,
      advancePhase,
      advanceDay,
      reset,
    }),
    [
      state,
      career,
      companyType,
      start,
      completeJoiningStep,
      completeDailySegment,
      startMission,
      completeMission,
      advancePhase,
      advanceDay,
      reset,
    ],
  );

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used inside <SimulationProvider>. Wrap the app root.');
  }
  return ctx;
}
