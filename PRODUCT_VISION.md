# CareerVerse — Product Vision & Product Reference v2.0

> **Status:** Canonical. This is the north-star **and** the as-built reference for CareerVerse.
> Together with the **UI Experience Document** (`CareerVerse.pdf` — the Frontend UI Experience
> Bible) and the **Design System Document** (`docs/DESIGN_SYSTEM.md` + `design-tokens.json`), it forms
> the **three governing documents**. Every screen, component, workflow, animation, and feature must
> be checked against all three before it is built. Nothing in the product may contradict the vision
> in **Part I**; **Part II** describes exactly what exists today; **Part III** is the forward plan.
>
> **Last verified:** 2026-07-23 · Phases 1–20 complete · `npm run typecheck` clean ·
> `npm run verify` 20/20 WCAG pairs pass · ~12,300 LOC across 28 screens, 39 components,
> 5 navigators, 14 util modules, 11 engine files.

---

## Table of contents

**Part I — Vision (the unchanging why & what)**
1. One-line vision
2. What CareerVerse is — and is not
3. Core philosophy & design mandate
4. The core experience model — "You are now an employee"
5. The canonical career journey (Software Developer reference)
6. The universal career structure
7. Career catalogue
8. Learning-by-doing & the AI mentor
9. Career progression & promotions
10. Experience & UX principles
11. Product non-negotiables (guardrails)
12. The three governing documents

**Part II — The product as built (implementation reference)**
13. Technology stack
14. System architecture overview
15. The Simulation Engine (data-driven core)
16. Data model & content schema
17. State management & persistence
18. Navigation structure
19. Implemented features by module (Phases 1–20)
20. Reusable component kit
21. Design-system integration & accessibility
22. Key end-to-end workflows
23. Verification & quality status

**Part III — Reality & the road ahead**
24. Current limitations & technical debt (honest)
25. Future roadmap
26. Definition of success

---

# Part I — Vision

## 1. One-line vision

**CareerVerse is an AI-powered career simulation platform where students and professionals
*experience* a career before choosing it — by becoming an employee, not by reading about the job.**

> **"Don't just read about a career. Experience it."**

---

## 2. What CareerVerse is — and is not

CareerVerse is an **immersive career simulation platform**. When a user picks a career, they stop
browsing an app and start *working a job*. The application transforms into a realistic workplace: a
company, a manager, a team, an inbox, a backlog, meetings, real tasks, reviews, and promotions.

**CareerVerse is NOT:**

| It is not… | Because… |
|---|---|
| ❌ A learning app | Users don't study lessons — they do the job. |
| ❌ An online course | There are no modules to "complete for a certificate" by watching. |
| ❌ A job portal | It doesn't list openings — it *simulates* holding the role. |
| ❌ A career quiz | It doesn't tell you who you are — it lets you *feel* the work. |
| ❌ A generic education product | It never looks or behaves like edtech. |

**CareerVerse IS:**

- ✅ A realistic **workplace simulator** — you feel like you joined a real company.
- ✅ A **learning-by-doing** engine — you learn by completing real tasks.
- ✅ An **AI-mentored experience** — an AI manager assigns work, reviews it, and grows you.
- ✅ A **career-growth journey** — from beginner to expert, with promotions and rising responsibility.

The ultimate goal: become **the world's most realistic AI-powered career experience platform, where
users don't just learn about careers — they live them.**

---

## 3. Core philosophy & design mandate

Everything exists to answer questions that **no video, book, or job description can answer**:
*"What does this role actually do every day? What happens after I join a startup vs. an enterprise?
What skills are actually used? What changes after a promotion?"* — answered **through experience**,
never a paragraph of text.

**Three unbreakable rules:**

1. **Realism over instruction.** Show the work, don't describe it.
2. **Immersion over navigation.** The user should forget they are in an app and feel they are inside a company.
3. **Doing over reading.** Every screen is an interactive task or a workplace surface — never a quiz, never a lesson page.

---

## 4. The core experience model — "You are now an employee"

When a user selects a career, the app becomes their workplace, reproducing the mental model of
onboarding into a real company and living a full career arc. It should feel like the tools
professionals use daily:

> **Slack · Notion · Jira · Linear · Google Workspace · Microsoft Teams · a company HR portal · an
> employee dashboard.**

The signature object that carries this premise is the **Employee Badge**: a glass card with a lit
violet edge holding the user's role, company, tenure, and monospaced employee ID. It is the hero of
Home, the header of Profile, and the face of the Certificate.

---

## 5. The canonical career journey (reference: Software Developer)

Every career is modelled as a **complete A-to-Z arc**. The Software Developer track is the reference
that defines the realism bar for all careers:

```
Select Career → Choose Company Type (Startup · Medium · Enterprise) → Company Intro → HR Welcome →
Office Tour → Manager Intro → Meet the Team → Workspace Setup → Slack → Email → Sprint Planning →
Daily Standup → Task Assignment → Coding Mission (AI-reviewed) → Code Review → Testing → Deployment →
Bug Fix → Production Issues → Performance Review → Promotion (Senior → Tech Lead → Eng Manager) →
Career Completed → Portfolio + Skill Report + Certificate
```

**The company type changes the entire experience**, not just a label — Startup (many hats, informal,
ship fast), Medium (defined roles, structured sprints), Enterprise (approvals, compliance, scale).
The same task feels *different* inside each — that difference is the lesson. This is implemented as
numeric **modifiers** (xpMultiplier, formality, autonomy, pace) on each company type.

---

## 6. The universal career structure (the template every career follows)

Every career — regardless of field — is built from the same skeleton:

1. **Beginner Journey** — joining, onboarding, HR welcome, office tour, meeting the team.
2. **Daily Work** — the real recurring tasks of the role, done interactively.
3. **Team Communication** — Slack-style chat with teammates and an AI manager.
4. **Company Culture** — the feel, rituals, and norms of the chosen company type.
5. **Meetings** — standups, planning, reviews, retros.
6. **Documents** — briefs, specs, tickets, reports the role produces/consumes.
7. **Challenges** — problems, blockers, and production incidents.
8. **Real Projects** — substantive deliverables completed across missions.
9. **Promotions** — advancement gated by demonstrated performance.
10. **Career Growth** — rising responsibility, new skills, expert-level arc.

Each career also delivers, by the end: a tracked **skill-development path**, **responsibilities that
increase with each promotion**, a **portfolio**, a **performance/skill report**, and a **certificate**.

---

## 7. Career catalogue (each a full A-to-Z simulation)

Target catalogue (each must reach the Software-Developer realism bar): Software Developer · UI/UX
Designer · Hardware Engineer · Cyber Security Analyst · AI Engineer · Mechanical Engineer · Civil
Engineer · Electronics Engineer · Business Analyst · Data Analyst · Product Manager · HR Executive ·
Marketing Executive · Sales Executive. *(The catalogue is extensible; new careers adopt the §6
structure by adding data — see Part II.)*

---

## 8. Learning-by-doing & the AI mentor

The loop for every mission:

```
Receive a real task → Do the actual work → AI reviews it → Get specific feedback → Improve →
Skill grows → Next task / promotion
```

The **AI manager / mentor** is a first-class character: assigns tasks the way a real manager would,
reviews submitted work with **concrete, actionable feedback** (never generic praise), tracks skill
growth, triggers promotions, and adapts tone/expectations to the company type. **Never** generate
quiz-based learning, multiple-choice "lessons", passive reading pages, or generic educational
screens. *(Today the AI review is a deterministic rubric-based engine; see Part III for the LLM path.)*

---

## 9. Career progression & promotions

Progress is earned, visible, and consequential: **Levels** map to real titles; **promotions** unlock
new responsibilities, harder missions, and larger scope; **performance reviews** feel like sitting
with your manager, not a score screen; the **Employee Badge** and Profile evolve as the user advances.

---

## 10. Experience & UX principles (how it must always feel)

- **Premium, mobile-first, immersive.** The app is the building, not a course.
- **Dark-only, violet-lit.** Brand violet `#6C5CE7` is the single loudest element; everything else
  stays quiet. Glass = office glazing, gradients = light on a surface, glow = the screen.
- **Workplace-tool fidelity.** Chat feels like Slack; docs like Notion; tasks like Jira/Linear;
  dashboards like an employee portal.
- **One primary action per screen.**
- **Every screen handles empty / loading / error / success.**
- **Accessible by construction** — WCAG-gated contrast, screen-reader support, reduced motion, 44pt
  targets, OS font scaling.
- **Consistent by construction** — all colour, spacing, type, and motion come from
  `design-tokens.json` via the theme. Nothing hardcoded, nothing duplicated.

---

## 11. Product non-negotiables (the guardrails)

**Always:** prioritise realism/immersion/learning-by-doing; make the user feel they joined a real
company; build interactive tasks with AI feedback; give every career a complete beginner-to-expert
roadmap; reuse the shared component kit (build new primitives before screens); defer to the three
governing documents.

**Never:** build generic educational screens; create quiz-based learning; build reading pages; make
the UI feel like edtech; deviate from the vision/design language/branding; hardcode careers,
companies, missions, skills, AI responses, or business logic; guess or invent undocumented behavior.

---

## 12. The three governing documents

1. **Product Vision & Product Reference** — `PRODUCT_VISION.md` *(this file)* — *why*, *what*, and *as-built*.
2. **UI Experience Document** — `CareerVerse.pdf` — *how it feels, flows, and behaves*.
3. **Design System Document** — `docs/DESIGN_SYSTEM.md` + `design-tokens.json` — *the exact visual language*.

If two documents conflict, resolve it explicitly against the vision here and the newest authoritative
spec — never silently pick one.

---

# Part II — The product as built

> Everything in this part reflects the codebase at the last-verified date. It is descriptive
> (what *is*), not aspirational.

## 13. Technology stack

- **Runtime:** Expo SDK 57, React Native 0.86, React 19.
- **Language:** TypeScript (strict), `tsc --noEmit` clean.
- **Styling:** NativeWind 4 + a token layer; **dark-only** theme.
- **Navigation:** React Navigation 7 (native-stack + bottom-tabs).
- **Validation/Types:** Zod 4 (runtime schemas; TS types are `z.infer`'d from them).
- **Forms:** react-hook-form + `@hookform/resolvers` (Zod).
- **Storage:** `@react-native-async-storage/async-storage` (injectable adapter).
- **Motion:** react-native-reanimated 4 (reduced-motion aware).
- **Graphics/UI:** react-native-svg, expo-linear-gradient, expo-blur, FlashList, safe-area-context.
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (IDs/timers).

## 14. System architecture overview

Strict, one-way layering — each layer depends only on those below it:

```
Screens  ─────────────►  consume useSimulation() + selectors + derivation utils only
  │
Navigation (5 stacks)    typed param lists; root → auth / joining / tabs → nested stacks
  │
Derivation utils (14)    read-only projections over engine data (no state mutation)
  │
Simulation Engine        pure reducer + selectors + registry + provider (career-agnostic)
  │
Data (career JSON)       Zod-validated content; "careers are data, not code"
  │
Design tokens            design-tokens.json → theme/tokens.ts + tailwind.config.js (one source)
```

**Core principle:** the engine, screens, navigation, and component kit are **career-agnostic**.
Adding a career never touches code — it adds one validated JSON file.

## 15. The Simulation Engine (data-driven core) — `src/simulation/`

- **`schema.ts`** — Zod contracts for all 10 career phases; every TS type is `z.infer`'d (single
  source of truth for runtime validation and compile-time types).
- **`defaults.ts`** — reusable `DEFAULT_JOINING_FLOW` (15 steps), `DEFAULT_DAILY_FLOW` (11 segments),
  `JOURNEY_PHASES`, `LADDER_RANKS`, `DEFAULT_XP_CURVE`.
- **`engine.ts`** — **pure** progression logic + the reducer: level/XP selectors, mission
  availability (level unlocks + prerequisites), skill-point rollups, badge criteria evaluation,
  completion detection, and all state transitions. Timestamps are injected, never read from a clock,
  so the engine is deterministic and trivially testable.
- **`state.ts`** — the runtime save-file (`SimulationState`) + the discriminated-union action set.
- **`registry.ts`** — validates + resolves career data (fills default flows), lists/looks up careers
  and company types.
- **`SimulationProvider.tsx` / `useSimulation()`** — the one context screens use; owns hydration and
  persistence, injects the clock.
- **`persistence.ts`** — versioned, Zod-validated save/load with referential-integrity checks and an
  injectable storage backend.
- **`data/`** — `company-types.json` (shared startup/medium/enterprise environments with modifiers),
  `careers/_template.career.json` (the copy-me blueprint), `careers/index.ts` (the plug-in manifest).

**To add a career:** copy `_template.career.json`, fill content, add one import line to
`careers/index.ts`. Nothing else changes.

## 16. Data model & content schema

There is **no server database**. Two data shapes exist:

**A. Content model** — the Zod `careerDefinitionSchema` (`schemaVersion: "1.0"`), one document per
career, covering the 10 phases:

| Phase | Fields |
|---|---|
| 1 Selection | `overview`, `requiredSkills`, `roadmap`, `salary`, `futureOpportunities`, `learningPath` |
| 2 Company | `supportedCompanyTypes` (→ shared `company-types.json` with `modifiers`) |
| 3 Joining | `joining[]` (optional; falls back to default flow) |
| 4 Daily work | `dailyWork[]` (optional; falls back to default flow) |
| 5 Missions | `missions[]` — brief, type, difficulty, scope, XP, `skillRewards`, `steps`, `rubric`, `prerequisites` |
| 6 AI workplace | `personas[]`, `dialogues[]` |
| 7 Skills | `skills[]` (id, name, category) |
| 8 Progression | `ladder[]` — rank, order, title, `xpRequired`, `responsibilities`, `unlocks` |
| 9 Achievements | `badges[]` (machine-checkable `criteria`), `certificates[]` |
| 10 Completion | `completion` — headline, improvement areas, certificate id, next-career suggestions |

**B. Runtime save-file** — `SimulationState`: chosen career/company, journey phase, status, totalXp,
current level order, per-skill points, active/completed missions, completed joining/daily steps,
earned badges, rolling performance score (0–100), simulated day, timestamps.

## 17. State management & persistence

- **Single `useReducer`** over the pure `reduce()`; every transition is a named action
  (`START`, `HYDRATE`, `COMPLETE_JOINING_STEP`, `COMPLETE_DAILY_SEGMENT`, `START_MISSION`,
  `COMPLETE_MISSION`, `ADVANCE_PHASE`, `ADVANCE_DAY`, `RESET`). No screen mutates state directly.
- **Persistence lifecycle:** on launch, `loadSavedState()` validates the versioned envelope (Zod +
  referential integrity) and dispatches `HYDRATE`; a `hydrated` guard prevents the first render from
  overwriting a real save; every subsequent change is persisted best-effort (failures swallowed).
- **Save-file is treated as untrusted input** — validated before it re-enters the engine; a corrupt
  or stale save (career no longer registered) is discarded, never half-applied.
- The storage backend is injectable (`setStorageAdapter`) — the seam a real backend plugs into.

## 18. Navigation structure (`src/navigation/`, fully typed)

```
Root (native stack)
├── Splash            boot + routing (session check currently stubbed)
├── Auth (stack)      Onboarding → Login → Register → ForgotPassword → Otp
├── Joining           full-screen Phase-3 onboarding flow (presented after company select)
└── Main (bottom tabs)
    ├── Home                          employee workspace dashboard
    ├── Careers (stack)               Catalogue → CareerDetail → CompanySelect
    ├── Simulations (stack)           MissionBoard → MissionDetail → MissionRun → Workday
    ├── Inbox (stack)                 Workplace → Chat → Meeting
    └── Profile (stack)               ProfileHome → Skills · Progression · Analytics ·
                                      Portfolio · Resume · Certificate
```

Every param list is typed and the `RootParamList` is globally augmented; cross-tab navigation uses
typed nested params. All stacks are header-less (full-bleed); each screen owns its own back via
`ScreenHeader`.

## 19. Implemented features by module (Phases 1–20)

- **1 · Auth & Onboarding** — Splash routing; 3-slide onboarding carousel; Login/Register/Forgot/OTP
  with react-hook-form + Zod, masked email, OTP auto-advance + resend countdown. *(Submit handlers
  are fake-latency stubs awaiting a real auth service.)*
- **2 · Careers + Company Selection** — Data-driven catalogue with category filters; full career
  detail (overview, required skills, roadmap, salary tiers, opportunities, learning path); company
  selection that starts the run via the engine.
- **3 · Joining** — Data-driven 14-type step registry (offer → verification → HR welcome → intros →
  workstation/email setup → policies → checklist) each an interactive `JoiningScene`; awards XP;
  finale Employee Badge; advances phase and enters the app.
- **6 · Home / Employee Workspace** — Employee Badge, level/XP/performance/mission tiles, level
  progress, today's schedule + tasks, AI-manager dialogue, team activity, notifications, quick
  actions — every value engine-derived.
- **7 · Daily Work Simulation** — A 14-stage simulated day (clock-in → standup → assignment → work
  session with timer + checklist → problem-solving decision → submission → **AI feedback** → manager
  review → end-of-day → advance day). AI review is deterministic from the mission rubric + skills.
- **5/9 · Mission Engine** — Board (annotated statuses, recommended mission, analytics, status tabs +
  category filters); Detail (objectives, rewards, company impact, dependencies, AI + manager
  evaluation); Run (work → submit → review; safe on replay).
- **8/10 · AI Workplace & Inbox** — `buildWorkplace` derives threads/meetings/alerts/coaching from
  run data; interactive chat with deterministic persona replies; meeting detail with an AI summary.
- **11 · Profile hub** — Employee Badge, level + performance rings, employee record, growth-surface
  links, achievements, switch/reset run.
- **12 · Skills** — Per-skill proficiency (earned vs. mission-derived potential), proficiency bands,
  skill-family rollups, overall mastery.
- **13 · Career Progression + Promotions** — Full ladder timeline (reached/current/locked),
  next-promotion card with XP-to-go and new responsibilities, per-level responsibilities + unlocks,
  promotions earned.
- **14 · Performance Analytics** — Performance score + band, career completion, missions by
  difficulty, XP-by-source (missions vs. onboarding), run counts.
- **15 · Portfolio** — Completed missions rendered as delivered work items with deliverable, class,
  and skills demonstrated.
- **16 · Resume** — Auto-assembled from the run by *composing* the profile/progression/skills/
  portfolio derivations — headline, summary, experience with held responsibilities, key skills,
  projects, certifications.
- **17 · Certificate** — Gated on career completion: an awarded certificate hero (final score, level,
  date, employee ID) or a locked state with an exact requirements checklist and progress.
- **18–20 · Integration & hardening** — All surfaces wired, persistence verified, imports cleaned,
  verification gates green.

## 20. Reusable component kit (`src/components/`, 39 components)

- **ui** — Text, Button, Card, Input, Badge/Chip, StateViews (Empty/Error/Success/Loading/Skeleton),
  SectionHeader, ScreenHeader, CheckRow, StatTile, ProgressBar, RadialProgress, ListRow,
  TaskChecklist, SegmentedControl.
- **layout** — Screen (safe area, padding, tablet cap, background/gradient, status bar).
- **career** — DifficultyBadge, CareerCard, CompanyCard, MissionCard.
- **joining** — JoiningProgress, JoiningScene.
- **workday** — WorkTimer, ProgressTimeline, Attendance/Schedule/Team/Feedback/Review/Summary/
  ActivityCard.
- **workplace** — PersonaAvatar, PersonaCard, ChatMessage, EmployeeBadge, ThreadRow, ChatComposer,
  MeetingCard, CoachingCard.

All are presentational, token-driven, and reused across modules. The entire Profile arc (Phases
11–20) added **zero** new components beyond three shared ui primitives (ScreenHeader, ListRow,
RadialProgress).

**Derivation utils (`src/utils/`, 14):** `validation`, `identity`, `feedback`, `time`, `format`,
`workplace`, `missions`, `profile`, `skills`, `progression`, `analytics`, `portfolio`, `resume`,
`certificate` — all read-only projections; none mutate state or hardcode career content.

## 21. Design-system integration & accessibility

- **Tokens are the single source of truth.** `design-tokens.json` feeds both `theme/tokens.ts`
  (StyleSheet) and `tailwind.config.js` (NativeWind). **No raw hex/`rgba` exists outside the theme
  layer** (grep-verified). Colour, spacing, radius, type, and motion are all consumed via `useTheme()`.
- **Contrast is CI-gated.** `npm run verify` runs `check-contrast.mjs` against WCAG for every colour
  pair — currently 20/20 pass. One documented WARN (`error on card` 3.90:1) awaits a Part-21 palette
  decision; it is a known spec conflict, not a regression.
- **Accessible by construction.** Roles/labels/state on all interactive components; `progressbar` +
  `accessibilityValue` on bars/rings; live regions on form errors and the OTP countdown; 44pt touch
  targets + `hitSlop`; reduced motion wired to `AccessibilityInfo` and gating every animation; capped
  OS font scaling. Status is never colour-only (glyph + text everywhere).

## 22. Key end-to-end workflows

1. **Onboard a user** → Splash → Onboarding → Register/Login (OTP) → Careers.
2. **Start a career** → Catalogue → Career Detail → Company Select → engine `start()` → Joining flow
   (15 steps, XP, badge) → Main tabs.
3. **Work a day** → Home ("continue working") / Mission Board → Workday's 14 stages → AI feedback +
   manager review → advance day.
4. **Run a mission** → Mission Board → Detail → Run (work → submit → AI + manager review) →
   `completeMission` (XP, skills, performance, badges, possible promotion/completion).
5. **Communicate** → Inbox → Workplace hub → Chat (interactive) / Meeting (AI summary) / Alerts.
6. **Grow & graduate** → Profile → Skills / Progression / Analytics / Portfolio / Resume →
   complete the career → Certificate awarded.
7. **Persist & resume** → every change is saved locally; relaunch hydrates the exact run.

## 23. Verification & quality status

- **Type safety:** `tsc --noEmit` passes clean; exactly one `any` in the codebase (a documented
  Workday route-adapter cast); no `@ts-ignore`.
- **Accessibility/contrast:** `npm run verify` — 20/20 gated WCAG pairs pass (one documented WARN).
- **Runtime hygiene:** no `console.*` in `src`; no empty catch blocks; save-file input validated.
- **Not yet covered:** no automated test suite; no on-device profiling in the current environment.

---

# Part III — Reality & the road ahead

## 24. Current limitations & technical debt (honest)

| Item | Detail | Priority |
|---|---|---|
| **Auth is stubbed** | Login/Register/Forgot/OTP/Splash use fake-latency placeholders; no real identity, session, or authorization. | **Critical (for launch)** |
| **No backend / server persistence** | State is device-local (AsyncStorage); nothing syncs or is recoverable across devices. | **Critical (for launch)** |
| **Only the template career is registered** | `_template.career.json` is the single career; the 14-career catalogue is content to author against the existing schema. | **High** |
| **No automated tests** | Verification is `tsc` + contrast gate + manual review only. | **High** |
| **Screen-reader glyph noise** | Decorative status glyphs (`✓ ○ ◆ ★`) are read aloud in some screens (not hidden). | **High** |
| **`any` route adapter** | `SimulationsNavigator` casts `WorkdayScreen` through `any`. | Medium |
| **Dimensional magic numbers** | A few sizing literals (bar heights, badge circles, `flexBasis`) sit outside the spacing scale (no hues). | Medium |
| **`error on card` contrast** | Documented Part-21 palette conflict awaiting a decision. | Medium |
| **AI is deterministic, not an LLM** | `buildFeedback`/`nextReply` are rule-based; real LLM mentoring is a roadmap item. | Medium |
| **Dead `rootNav` local** | Leftover unused local in `ProfileScreen`. | Low |
| **Template mission-gating quirk** | Template data can empty the mission queue after day 1 (handled gracefully). | Low |

Nothing above requires re-architecting — every gap sits behind a deliberate seam (injectable
storage, stubbed auth boundary, JSON content model, feedback function boundary).

## 25. Future roadmap

- **Backend & API** — real auth (email/OTP/OAuth), user accounts, cloud save/sync, leaderboards; swap
  the `StorageAdapter` for a remote-backed one; store tokens in `expo-secure-store`.
- **Content pipeline** — author the 14 catalogue careers; per-company-type dialogue variation.
- **Admin Panel / CMS** — CRUD over the career JSON schema (careers, missions, ladders, personas,
  dialogues) with server-side Zod validation. The `careerDefinitionSchema` *is* the editing contract.
- **Real AI mentor** — replace deterministic feedback/replies with an LLM (Claude) behind the same
  function boundary; the rubric is already structured for grading.
- **Product analytics & telemetry** — funnels, retention, crash reporting.
- **Quality** — Jest + React Native Testing Library (unit/integration), Detox e2e, device-matrix and
  reduced-motion/large-font QA, the a11y glyph-hiding pass, and resolving the Part-21 contrast rule.

## 26. Definition of success

CareerVerse succeeds when a user finishes a simulation and can honestly say:

> *"I now know what this career is actually like — because I did the work, not because I read about it."*

The final goal is for CareerVerse to be recognised as **the world's most realistic AI-powered career
experience platform**, where users don't just learn about careers — **they live them.**
