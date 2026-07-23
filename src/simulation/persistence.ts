/**
 * Save-file persistence for the active simulation run.
 *
 * The engine already produces plain, serialisable state (see state.ts), so persistence is a
 * thin, career-agnostic layer: serialise the live run to device storage on every change, and
 * hydrate it back on launch. Nothing here knows about any specific career — it stores whatever
 * the engine hands it.
 *
 * Robustness rules (a save-file is untrusted input across app versions):
 *   1. Everything is wrapped in a versioned envelope so a future schema change can migrate or
 *      discard old saves instead of crashing on them.
 *   2. The payload is validated with Zod before it is allowed back into the reducer — a
 *      corrupt or partial file is dropped, never half-applied.
 *   3. The referenced career + company must still be registered; a save that points at a career
 *      removed from the manifest is discarded rather than loaded into a broken run.
 *   4. Storage failures are swallowed — a device storage error must never crash the app or lose
 *      the in-memory run.
 *
 * The storage backend is injectable (`setStorageAdapter`) so tests and non-device environments
 * can supply an in-memory adapter; the default is React Native AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { z } from 'zod';

import { getCareer, getCompanyType } from './registry';
import { JOURNEY_PHASES } from './defaults';
import type { SimulationState } from './state';

/** Bump when the persisted shape changes incompatibly. Old envelopes are then discarded. */
export const SAVE_VERSION = 1 as const;
export const STORAGE_KEY = 'careerverse.run.v1';

// ---------------------------------------------------------------------------
// Validation — mirrors SimulationState so persisted data is checked before it re-enters
// the engine. Kept next to persistence (not in state.ts) because it exists only to guard the
// storage boundary; the engine's own types remain the compile-time source of truth.
// ---------------------------------------------------------------------------

const journeyPhaseSchema = z.enum(JOURNEY_PHASES);

const simulationStateSchema = z.object({
  careerId: z.string().min(1),
  companyTypeId: z.string().min(1),
  phase: journeyPhaseSchema,
  status: z.enum(['active', 'completed']),
  totalXp: z.number(),
  currentLevelOrder: z.number().int().nonnegative(),
  skillPoints: z.record(z.string(), z.number()),
  activeMissionId: z.string().nullable(),
  completedMissionIds: z.array(z.string()),
  completedJoiningStepIds: z.array(z.string()),
  completedDailySegmentIds: z.array(z.string()),
  earnedBadgeIds: z.array(z.string()),
  performanceScore: z.number(),
  day: z.number().int().positive(),
  startedAt: z.number(),
  updatedAt: z.number(),
}) satisfies z.ZodType<SimulationState>;

const envelopeSchema = z.object({
  version: z.literal(SAVE_VERSION),
  state: simulationStateSchema,
});

// ---------------------------------------------------------------------------
// Injectable storage backend.
// ---------------------------------------------------------------------------

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

let adapter: StorageAdapter = AsyncStorage;

/** Swap the storage backend (tests, SSR, or a different device store). */
export function setStorageAdapter(next: StorageAdapter): void {
  adapter = next;
}

// ---------------------------------------------------------------------------
// Public API — used only by the provider.
// ---------------------------------------------------------------------------

/**
 * Loads and validates the saved run. Returns null (start fresh) when there is no save, the
 * save is corrupt/outdated, or it references a career/company that no longer exists.
 */
export async function loadSavedState(): Promise<SimulationState | null> {
  try {
    const raw = await adapter.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = envelopeSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;

    const state = parsed.data.state;

    // Referential integrity: a save that points at an unregistered career/company is stale.
    if (!getCareer(state.careerId) || !getCompanyType(state.companyTypeId)) return null;

    return state;
  } catch {
    // Malformed JSON or a storage read error — discard rather than crash.
    return null;
  }
}

/** Persists the live run, or clears the save when the run is reset to null. Best-effort. */
export async function persistState(state: SimulationState | null): Promise<void> {
  try {
    if (!state) {
      await adapter.removeItem(STORAGE_KEY);
      return;
    }
    await adapter.setItem(STORAGE_KEY, JSON.stringify({ version: SAVE_VERSION, state }));
  } catch {
    // A storage write failure must never surface to the user or drop the in-memory run.
  }
}

/** Clears any saved run. Exposed for a full account/data reset. */
export async function clearSavedState(): Promise<void> {
  await persistState(null);
}
