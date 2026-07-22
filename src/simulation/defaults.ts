/**
 * Reusable defaults for the simulation engine.
 *
 * A career JSON may omit `joining` and `dailyWork` entirely — the registry fills them from
 * the standard flows below, so the Phase 3 and Phase 4 blueprints exist in ONE place and
 * every career gets a consistent experience for free. A career that needs a bespoke flow can
 * still supply its own; these are the fallback, not a cage.
 */

import type { JoiningStep, DailyWorkSegment } from './schema';

/**
 * PHASE 3 — the standard "joining the company" flow, in order. This is the emotional arc that
 * turns an app user into an employee. Small XP rewards make onboarding feel like progress from
 * the first tap; the total is kept under the Junior threshold so the user still enters daily
 * work as an Intern. A career may supply its own flow to override this.
 */
export const DEFAULT_JOINING_FLOW: JoiningStep[] = [
  { id: 'join-offer', type: 'offer_letter', title: 'Offer Letter', summary: 'Review and accept your offer to join.', xpReward: 10 },
  { id: 'join-verify', type: 'verification', title: 'Employment Confirmation', summary: 'Confirm your details and accept the terms.', xpReward: 5 },
  { id: 'join-hr', type: 'hr_welcome', title: 'HR Welcome', summary: 'Get your first-day welcome from People Team.', xpReward: 5 },
  { id: 'join-company', type: 'company_intro', title: 'Company Introduction', summary: 'Learn how this company works and what it values.', xpReward: 5 },
  { id: 'join-tour', type: 'office_tour', title: 'Office Tour', summary: 'See where the work happens.', xpReward: 5 },
  { id: 'join-department', type: 'department_intro', title: 'Department Introduction', summary: 'Meet your department and where you fit.', xpReward: 5 },
  { id: 'join-manager', type: 'manager_intro', title: 'Manager Introduction', summary: 'Meet the manager who will guide your work.', xpReward: 5 },
  { id: 'join-team', type: 'team_intro', title: 'Team Introduction', summary: 'Meet the teammates you will work with daily.', xpReward: 5 },
  { id: 'join-id', type: 'employee_id', title: 'Employee ID Card', summary: 'Generate your official employee badge.', xpReward: 5 },
  { id: 'join-email', type: 'email_setup', title: 'Company Email', summary: 'Create your company email address.', xpReward: 5 },
  { id: 'join-comm', type: 'communication_tools', title: 'Communication Tools', summary: 'Connect the tools the team uses to talk.', xpReward: 5 },
  { id: 'join-workstation', type: 'workstation_setup', title: 'Workstation Setup', summary: 'Set up your machine and access for the role.', xpReward: 5 },
  { id: 'join-policies', type: 'policies', title: 'Company Policies', summary: 'Read and acknowledge how things are done here.', xpReward: 5 },
  { id: 'join-checklist', type: 'checklist', title: 'First Day Checklist', summary: 'Confirm everything is ready for day one.', xpReward: 5 },
];

/**
 * PHASE 4 — the standard daily-work loop, in order. This is the recurring rhythm a user
 * lives once onboarded, regardless of career.
 */
export const DEFAULT_DAILY_FLOW: DailyWorkSegment[] = [
  { id: 'day-login', type: 'morning_login', title: 'Morning Login', summary: 'Clock in and review what is on your plate today.' },
  { id: 'day-standup', type: 'standup', title: 'Daily Stand-up', summary: 'Share yesterday, today, and any blockers with the team.' },
  { id: 'day-assign', type: 'task_assignment', title: 'Task Assignment', summary: 'Pick up the tasks assigned to you for the day.' },
  { id: 'day-research', type: 'research', title: 'Research', summary: 'Gather what you need before doing the work.' },
  { id: 'day-execution', type: 'execution', title: 'Execution', summary: 'Do the actual work of the role.' },
  { id: 'day-collaboration', type: 'collaboration', title: 'Collaboration', summary: 'Work with teammates to move the task forward.' },
  { id: 'day-meeting', type: 'meeting', title: 'Meetings', summary: 'Attend the meetings that shape your work.' },
  { id: 'day-review', type: 'review', title: 'Reviews', summary: 'Get and give feedback on the work produced.' },
  { id: 'day-problem', type: 'problem_solving', title: 'Problem Solving', summary: 'Handle the blockers and surprises that come up.' },
  { id: 'day-docs', type: 'documentation', title: 'Documentation', summary: 'Write down what you did so others can follow.' },
  { id: 'day-eod', type: 'eod_summary', title: 'End-of-Day Summary', summary: 'Wrap up, log progress, and set up tomorrow.' },
];

/**
 * The ten-phase journey in the order a user experiences it. The engine uses this to know
 * "what comes next"; screens use it to render a progress spine. AI feedback, skills, and
 * achievements are cross-cutting systems that run THROUGHOUT the journey rather than as a
 * single gate, so the linear spine below intentionally threads them into the work loop.
 */
export const JOURNEY_PHASES = [
  'career_selection',
  'company_selection',
  'joining',
  'daily_work',
  'missions',
  'completion',
] as const;

export type JourneyPhase = (typeof JOURNEY_PHASES)[number];

/** The canonical ladder ranks, ascending. Careers may relabel titles but reuse these ranks. */
export const LADDER_RANKS = [
  'intern',
  'junior',
  'associate',
  'mid',
  'senior',
  'lead',
  'manager',
  'director',
  'expert',
] as const;

/**
 * Default XP thresholds per ladder order (index 0 = intern at 0 XP). A career may specify
 * its own `xpRequired` per level; this is the reference curve when authoring one.
 * Roughly geometric so each promotion costs meaningfully more than the last.
 */
export const DEFAULT_XP_CURVE: readonly number[] = [
  0, 100, 250, 500, 900, 1500, 2400, 3600, 5200,
];
