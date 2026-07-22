# CareerVerse — Product Vision v1.0

> **Status:** Canonical. This is the north-star document for CareerVerse.
> Together with the **UI Experience Document** (`CareerVerse.pdf` — the Frontend UI
> Experience Bible) and the **Design System Document** (`docs/DESIGN_SYSTEM.md` +
> `design-tokens.json`), it forms the **three governing documents**. Every screen,
> component, workflow, animation, and feature must be checked against all three
> before it is built. Nothing in the product may contradict this document.

---

## 1. One-line vision

**CareerVerse is an AI-powered career simulation platform where students and
professionals *experience* a career before choosing it — by becoming an employee,
not by reading about the job.**

> **"Don't just read about a career. Experience it."**

---

## 2. What CareerVerse is — and is not

CareerVerse is an **immersive career simulation platform**. When a user picks a
career, they stop browsing an app and start *working a job*. The application
transforms into a realistic workplace: a company, a manager, a team, an inbox, a
backlog, meetings, real tasks, reviews, and promotions.

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

The ultimate goal: become **the world's most realistic AI-powered career experience
platform, where users don't just learn about careers — they live them.**

---

## 3. Core philosophy

Everything in the product exists to answer questions that **no YouTube video, book,
or job description can answer**:

- *"What does a Software Engineer actually do every day?"*
- *"What happens after I join a startup?"*
- *"How is a multinational company different from a small one?"*
- *"What skills are actually required — not listed, but used?"*
- *"What responsibilities increase after a promotion?"*

Every interaction should answer one of these **naturally, through experience** — never
through a paragraph of text on a reading page.

**Design mandate (three unbreakable rules):**

1. **Realism over instruction.** Show the work, don't describe it.
2. **Immersion over navigation.** The user should forget they are in an app and feel
   they are inside a company.
3. **Doing over reading.** Every screen is an interactive task or a workplace surface —
   never a quiz, never a lesson page, never a wall of text.

---

## 4. The core experience model — "You are now an employee"

When a user selects a career, the app becomes their workplace. The mental model the
UI must reproduce is **onboarding into a real company and living a full career arc.**

The product should feel like the tools professionals actually use every day:

> **Slack · Notion · Jira · Linear · Google Workspace · Microsoft Teams · a company HR
> portal · an employee dashboard.**

Premium, modern, immersive, realistic. The signature object that carries this premise
is the **Employee Badge** (see Design System §1): a glass card with a lit violet edge
holding the user's role, company, tenure, and monospaced employee ID. It is the hero
of Home, the header of Profile, and the face of the Certificate.

---

## 5. The canonical career journey (reference: Software Developer)

Every career is modelled as a **complete A-to-Z arc**. The Software Developer track is
the reference implementation that defines the level of realism required for **all**
careers:

```
Select Career: Software Developer
        ↓
Choose Company Type  →  Startup · Medium Company · Enterprise
        ↓
Company Introduction
        ↓
HR Welcome
        ↓
Office Tour
        ↓
Manager Introduction
        ↓
Meet the Team
        ↓
Workspace Setup  →  Laptop Ready
        ↓
Slack Messages           (team communication)
        ↓
Email Inbox              (company communication)
        ↓
Sprint Planning
        ↓
Daily Standup
        ↓
Task Assignment
        ↓
Coding Mission           (real task, AI-reviewed)
        ↓
Code Review              (AI feedback)
        ↓
Testing
        ↓
Deployment
        ↓
Bug Fix
        ↓
Production Issues
        ↓
Performance Review
        ↓
Promotion  →  Senior Developer  →  Tech Lead  →  Engineering Manager
        ↓
Career Completed  →  Portfolio + Skill Report + Certificate
```

**The company type changes the entire experience**, not just a label:

- **Startup** — small team, wear many hats, fast decisions, informal Slack, shipping over process.
- **Medium Company** — defined roles, structured sprints, more process, cross-team dependencies.
- **Enterprise** — layers of approval, formal reviews, compliance, large teams, slow but stable.

The same task feels *different* inside each — that difference is the lesson.

---

## 6. The universal career structure (the template every career follows)

Every career in CareerVerse — regardless of field — must be built from this same
skeleton so the experience is consistent and complete:

1. **Beginner Journey** — joining, onboarding, HR welcome, office tour, meeting the team.
2. **Daily Work** — the real, recurring tasks of the role, done interactively.
3. **Team Communication** — Slack-style chat with teammates and an AI manager.
4. **Company Culture** — the feel, rituals, and norms of the company type chosen.
5. **Meetings** — standups, planning, reviews, retros (role-appropriate).
6. **Documents** — briefs, specs, tickets, reports the role actually produces/consumes.
7. **Challenges** — problems, blockers, and production incidents to resolve.
8. **Real Projects** — substantive deliverables completed across missions.
9. **Promotions** — advancement gated by demonstrated performance.
10. **Career Growth** — rising responsibility, new skills, expert-level arc.

Each career must also deliver, by the end:

- A **skill-development path** (what you got better at, tracked).
- **Responsibilities** that visibly increase with each promotion.
- A **portfolio** of what was produced.
- A **performance/skill report** and a **certificate**.

---

## 7. Career catalogue (each a full A-to-Z simulation)

Every one of these must reach the same realism bar as Software Developer:

- Software Developer
- UI/UX Designer
- Hardware Engineer
- Cyber Security Analyst
- AI Engineer
- Mechanical Engineer
- Civil Engineer
- Electronics Engineer
- Business Analyst
- Data Analyst
- Product Manager
- HR Executive
- Marketing Executive
- Sales Executive

*(The catalogue is extensible; new careers must adopt the §6 universal structure.)*

---

## 8. Learning-by-doing & the AI mentor

CareerVerse teaches through work, not lessons. The loop for every mission is:

```
Receive a real task  →  Do the actual work  →  AI reviews it  →
Get specific feedback  →  Improve  →  Skill grows  →  Next task / promotion
```

The **AI manager / mentor** is a first-class character:

- Assigns tasks the way a real manager would (via Slack/email/tickets).
- Reviews submitted work and gives **concrete, actionable feedback** — never generic praise.
- Tracks skill growth and triggers promotions when performance justifies it.
- Adapts tone and expectations to the chosen **company type**.

**Never** generate: quiz-based learning, multiple-choice "lessons", passive reading
pages, or generic educational screens. If a feature could exist unchanged in an edtech
app, it does not belong in CareerVerse.

---

## 9. Career progression & promotions

Progress is earned, visible, and consequential:

- **Levels** map to real titles (e.g. Developer → Senior → Tech Lead → Engineering Manager).
- **Promotions** unlock new responsibilities, harder missions, and larger scope.
- **Performance reviews** are simulated events, not score screens — they feel like sitting
  with your manager.
- The **Employee Badge** and Profile evolve as the user advances (tenure ring, title, level).

---

## 10. Experience & UX principles (how it must always feel)

Derived from and consistent with the UI Experience Document and Design System:

- **Premium, mobile-first, immersive.** The app is the building, not a course.
- **Dark-only, violet-lit.** Brand violet `#6C5CE7` is the single loudest element; everything
  else stays quiet. Glass = office glazing, gradients = light on a surface, glow = the screen.
- **Workplace-tool fidelity.** Chat feels like Slack; docs feel like Notion; tasks feel like
  Jira/Linear; dashboards feel like an employee portal.
- **One primary action per screen.** Clear, confident, never cluttered.
- **Every screen handles empty / loading / error / success** states gracefully.
- **Accessible by construction** — WCAG-gated contrast, screen-reader support, reduced-motion
  respected, 44pt touch targets, OS font scaling.
- **Consistent by construction** — all colour, spacing, type, and motion come from
  `design-tokens.json` via the theme. Nothing is hardcoded, nothing is duplicated.

---

## 11. Product non-negotiables (the guardrails)

**Always:**

- Prioritise realism, immersion, and learning-by-doing.
- Make the user feel they joined a real company.
- Build interactive experiences where users complete real tasks and receive AI feedback.
- Give every career a complete beginner-to-expert roadmap.
- Reuse the shared component kit; build new reusable primitives before screens.
- Defer to the three governing documents; when they are silent, ask before inventing.

**Never:**

- Never build generic educational screens.
- Never create quiz-based learning.
- Never build simple reading pages.
- Never make the UI feel like a traditional education app.
- Never deviate from the product vision, design language, branding, or UX rules.
- Never guess or invent features that contradict the documentation.

---

## 12. The three governing documents

Before generating **any** code, UI, component, screen, or feature, align with all three:

1. **Product Vision Document** — `PRODUCT_VISION.md` *(this file)* — *why* and *what*.
2. **UI Experience Document** — `CareerVerse.pdf` (Frontend UI Experience Bible) — *how it
   feels, flows, and behaves*.
3. **Design System Document** — `docs/DESIGN_SYSTEM.md` + `design-tokens.json` — *the exact
   visual language: colour, type, spacing, motion, components*.

If two documents ever conflict, resolve it explicitly against the vision here and the newest
authoritative spec — do not silently pick one.

---

## 13. Definition of success

CareerVerse succeeds when a user finishes a simulation and can honestly say:

> *"I now know what this career is actually like — because I did the work, not because I
> read about it."*

The final goal is for CareerVerse to be recognised as **the world's most realistic
AI-powered career experience platform**, where users don't just learn about careers —
**they live them.**
