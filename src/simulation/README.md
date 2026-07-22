# CareerVerse Simulation Engine

A **data-driven, plug-in simulation framework**. Every career — Software Developer, UI/UX
Designer, AI Engineer, Data Analyst, Product Manager, HR/Marketing/Sales Executive,
Mechanical/Civil/Electronics Engineer, Healthcare, Finance, Education, or any future role —
is a **JSON data file**, not code. The engine, screens, navigation, and app architecture are
completely career-agnostic and never change when you add a career.

> Aligns with the three governing documents: `PRODUCT_VISION.md`, the UI Experience Bible
> (`CareerVerse.pdf`), and `docs/DESIGN_SYSTEM.md`.

## The ten phases

Each career supplies data for the ten-phase blueprint:

| Phase | What it defines | Schema field(s) |
|---|---|---|
| 1 · Career Selection | Overview, skills, roadmap, salary, opportunities, learning path | `overview`, `requiredSkills`, `roadmap`, `salary`, `futureOpportunities`, `learningPath` |
| 2 · Company Selection | Which shared environments the career supports | `supportedCompanyTypes` → `data/company-types.json` |
| 3 · Joining | Offer → HR → tour → manager → team → setup … | `joining` (optional → `DEFAULT_JOINING_FLOW`) |
| 4 · Daily Work | Login → standup → tasks → execution → EOD | `dailyWork` (optional → `DEFAULT_DAILY_FLOW`) |
| 5 · Missions | Tutorial → easy → … → emergency, projects | `missions` |
| 6 · AI Workplace | Manager, mentor, HR, teammates + dialogue | `personas`, `dialogues` |
| 7 · Skill Development | Skill catalogue and categories | `skills` |
| 8 · Career Progression | Intern → … → Career Expert ladder | `ladder` |
| 9 · Achievements | Badges, certificates (XP/levels via engine) | `badges`, `certificates` |
| 10 · Completion | Summary, improvement plan, next-career loop | `completion` |

## Architecture

```
data/company-types.json   ← Phase 2, shared by all careers
data/careers/
  _template.career.json   ← the blueprint every career copies
  index.ts                ← the plug-in manifest (register careers here)
schema.ts                 ← Zod contracts; TS types inferred from them (single source of truth)
defaults.ts               ← reusable Phase 3/4 flows, XP curve, ladder ranks
registry.ts               ← validates + resolves data (data ↔ engine boundary)
state.ts                  ← runtime save-file shape + action union
engine.ts                 ← pure, career-agnostic progression logic + reducer
SimulationProvider.tsx    ← React context + useSimulation() hook
index.ts                  ← public API (import only from here)
```

**Data flows one way:** JSON → validated by Zod in the registry → resolved career → pure
engine transforms state → provider exposes it → screens render it. No career-specific code
exists anywhere in the engine.

## Adding a new career (the entire process)

1. **Copy** `data/careers/_template.career.json` → `data/careers/software-developer.career.json`.
2. **Fill in** the career-specific content (keep the same field shape; the schema enforces it).
3. **Register** it in `data/careers/index.ts`:
   ```ts
   import softwareDeveloper from './software-developer.career.json';
   export const CAREER_SOURCES: unknown[] = [template, softwareDeveloper];
   ```
4. Done. It appears in `listCareers()`, is playable end to end, and validates on load. If any
   field is wrong, the registry throws with the exact JSON path — bad data never reaches a screen.

You do **not** modify `engine.ts`, `schema.ts`, screens, navigation, or state to add a career.
That is the guarantee that lets CareerVerse scale from 10 to 1000+ careers.

## Using it in the app

Wrap the app once (inside `ThemeProvider`):

```tsx
import { SimulationProvider } from './src/simulation';
// <SimulationProvider>{/* navigator */}</SimulationProvider>
```

Then, in any screen:

```tsx
import { useSimulation, getProgressToNextLevel, getAvailableMissions } from '../simulation';

const { state, career, companyType, start, completeMission } = useSimulation();

start('software-developer', 'startup');           // Phase 1+2 → begins the run
const { current, next, ratio } = getProgressToNextLevel(career!, state!); // Phase 8
const missions = getAvailableMissions(career!, state!);                    // Phase 5
completeMission('m-tutorial', 90);                 // awards XP + skills, may promote/complete
```

## Design rules honoured

- **Never hardcode a career, company, mission, skill, level, or dialogue** — all data.
- **Every career is a plug-in** — add data, not code.
- **One source of truth** — Zod schemas generate the types; the registry is the only validator.
- **Pure engine** — timestamps are injected, so progression logic is deterministic and testable.
