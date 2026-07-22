/**
 * CareerVerse Simulation Engine — data contracts.
 *
 * This file is the plug-in interface for the entire platform. A career is DATA, not code:
 * every career is a JSON document validated against `careerDefinitionSchema` at load time.
 * Adding a new career never touches the engine, the screens, or the app architecture — it
 * only adds a new validated data file (see `data/careers/_template.career.json`).
 *
 * Zod is the single source of truth: the TypeScript types are inferred from the schemas
 * (`z.infer`), so the runtime validation and the compile-time types can never drift apart.
 * This mirrors how `design-tokens.json` feeds both StyleSheet and Tailwind from one place.
 *
 * The ten phases below map 1:1 to the CareerVerse simulation blueprint (PRODUCT_VISION.md).
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Shared vocabularies — the fixed enums every career reuses.
// ---------------------------------------------------------------------------

export const difficultyLevel = z.enum(['beginner', 'intermediate', 'advanced', 'expert']);
export type DifficultyLevel = z.infer<typeof difficultyLevel>;

/** Phase 7 skill families. Technical + the seven cross-career soft-skill tracks. */
export const skillCategory = z.enum([
  'technical',
  'communication',
  'leadership',
  'problem_solving',
  'critical_thinking',
  'time_management',
  'documentation',
  'decision_making',
]);
export type SkillCategory = z.infer<typeof skillCategory>;

/** Phase 8 career ladder ranks. Ordered intern → expert. */
export const progressionRank = z.enum([
  'intern',
  'junior',
  'associate',
  'mid',
  'senior',
  'lead',
  'manager',
  'director',
  'expert',
]);
export type ProgressionRank = z.infer<typeof progressionRank>;

/** Phase 5 mission classes. */
export const missionType = z.enum([
  'tutorial',
  'easy',
  'medium',
  'advanced',
  'critical',
  'emergency',
  'company_project',
  'multi_day',
  'team',
  'individual',
]);
export type MissionType = z.infer<typeof missionType>;

export const missionScope = z.enum(['individual', 'team']);

/** Phase 6 AI workplace personas. */
export const aiRole = z.enum(['manager', 'mentor', 'hr', 'teammate']);
export type AiRole = z.infer<typeof aiRole>;

/** Where a dialogue line surfaces in the workplace UI. */
export const commChannel = z.enum(['slack', 'email', 'meeting', 'call', 'system']);
export type CommChannel = z.infer<typeof commChannel>;

/** Phase 3 joining steps. Additive vocabulary — a career picks whichever steps it needs. */
export const joiningStepType = z.enum([
  'offer_letter',
  'verification',
  'hr_welcome',
  'company_intro',
  'office_tour',
  'department_intro',
  'manager_intro',
  'team_intro',
  'workstation_setup',
  'employee_id',
  'email_setup',
  'communication_tools',
  'policies',
  'checklist',
  'calendar',
  'task_system',
  'knowledge_base',
]);
export type JoiningStepType = z.infer<typeof joiningStepType>;

/** Phase 4 daily-work segments. */
export const dailyWorkType = z.enum([
  'morning_login',
  'standup',
  'task_assignment',
  'research',
  'execution',
  'collaboration',
  'meeting',
  'review',
  'problem_solving',
  'documentation',
  'eod_summary',
]);
export type DailyWorkType = z.infer<typeof dailyWorkType>;

const id = z.string().min(1);

// ---------------------------------------------------------------------------
// PHASE 1 — Career Selection
// ---------------------------------------------------------------------------

export const careerOverviewSchema = z.object({
  id,
  title: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  /** Grouping for the catalogue, e.g. 'engineering' | 'design' | 'business' | 'healthcare'. */
  category: z.string().min(1),
  difficulty: difficultyLevel,
  /** Glyph or asset key. Kept as a string so the icon system can swap in later (Bible Part 9). */
  glyph: z.string().min(1),
});

export const requiredSkillSchema = z.object({
  id,
  name: z.string().min(1),
  category: skillCategory,
  importance: z.enum(['core', 'important', 'optional']),
});

export const roadmapStageSchema = z.object({
  id,
  title: z.string().min(1),
  summary: z.string().min(1),
  durationLabel: z.string().min(1),
});

export const salaryInsightSchema = z.object({
  region: z.string().min(1),
  currency: z.string().min(1),
  period: z.enum(['month', 'year']),
  junior: z.number().nonnegative(),
  mid: z.number().nonnegative(),
  senior: z.number().nonnegative(),
});

export const futureOpportunitySchema = z.object({
  id,
  title: z.string().min(1),
  description: z.string().min(1),
});

export const learningPathItemSchema = z.object({
  id,
  title: z.string().min(1),
  type: z.enum(['course', 'practice', 'reading', 'project', 'mentorship']),
  note: z.string().optional(),
});

// ---------------------------------------------------------------------------
// PHASE 2 — Company Selection (shared, reusable across every career)
// ---------------------------------------------------------------------------

/** Numeric levers that make the SAME task feel different per company environment. */
export const companyModifiersSchema = z.object({
  /** Scales XP earned in this environment. Enterprise is slower/steadier; startups reward speed. */
  xpMultiplier: z.number().positive(),
  /** 1 = very informal, 5 = highly formal. Drives tone of AI dialogue and UI chrome. */
  formality: z.number().int().min(1).max(5),
  /** 1 = tightly directed, 5 = fully autonomous. Drives how much guidance missions give. */
  autonomy: z.number().int().min(1).max(5),
  /** Human-readable pace, e.g. 'Ship daily' vs 'Quarterly releases'. */
  paceLabel: z.string().min(1),
});

export const companyTypeSchema = z.object({
  id,
  name: z.string().min(1),
  description: z.string().min(1),
  culture: z.string().min(1),
  teamSize: z.string().min(1),
  workStyle: z.string().min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  communicationStyle: z.string().min(1),
  growthSpeed: z.string().min(1),
  processes: z.array(z.string().min(1)).min(1),
  modifiers: companyModifiersSchema,
});

// ---------------------------------------------------------------------------
// PHASE 3 — Joining the Company
// ---------------------------------------------------------------------------

export const joiningStepSchema = z.object({
  id,
  type: joiningStepType,
  title: z.string().min(1),
  summary: z.string().min(1),
  xpReward: z.number().nonnegative().default(0),
});

// ---------------------------------------------------------------------------
// PHASE 4 — Daily Work Simulation
// ---------------------------------------------------------------------------

export const dailyWorkSegmentSchema = z.object({
  id,
  type: dailyWorkType,
  title: z.string().min(1),
  summary: z.string().min(1),
});

// ---------------------------------------------------------------------------
// PHASE 5 — Mission System
// ---------------------------------------------------------------------------

/** One graded dimension of an AI review. Weights across a mission should sum to 1. */
export const rubricCriterionSchema = z.object({
  id,
  label: z.string().min(1),
  weight: z.number().min(0).max(1),
  description: z.string().min(1),
});

export const skillRewardSchema = z.object({
  skillId: id,
  points: z.number().positive(),
});

/** A single interactive beat of a mission. `kind` tells the UI how to render it. */
export const missionStepSchema = z.object({
  id,
  kind: z.enum(['brief', 'choice', 'input', 'action', 'review']),
  prompt: z.string().min(1),
  /** Options for `choice` steps; ignored otherwise. */
  options: z.array(z.object({ id, label: z.string().min(1) })).optional(),
});

export const missionSchema = z.object({
  id,
  title: z.string().min(1),
  brief: z.string().min(1),
  type: missionType,
  difficulty: difficultyLevel,
  scope: missionScope,
  /** Multi-day projects span more than one simulated day. */
  durationDays: z.number().int().positive().default(1),
  xpReward: z.number().nonnegative(),
  skillRewards: z.array(skillRewardSchema).default([]),
  steps: z.array(missionStepSchema).min(1),
  deliverableLabel: z.string().min(1),
  rubric: z.array(rubricCriterionSchema).default([]),
  /** Mission ids that must be completed first. Enables branching, gated content. */
  prerequisites: z.array(id).default([]),
});

// ---------------------------------------------------------------------------
// PHASE 6 — AI Workplace
// ---------------------------------------------------------------------------

export const aiPersonaSchema = z.object({
  id,
  role: aiRole,
  name: z.string().min(1),
  title: z.string().min(1),
  glyph: z.string().min(1),
  /** Personality seed for AI feedback generation, e.g. 'direct, encouraging'. */
  tone: z.string().min(1),
});

/** Pre-authored workplace lines. Runtime AI feedback is generated; this seeds the world. */
export const dialogueLineSchema = z.object({
  id,
  personaId: id,
  channel: commChannel,
  text: z.string().min(1),
});

// ---------------------------------------------------------------------------
// PHASE 7 — Skill Development
// ---------------------------------------------------------------------------

export const skillDefinitionSchema = z.object({
  id,
  name: z.string().min(1),
  category: skillCategory,
  description: z.string().optional(),
});

// ---------------------------------------------------------------------------
// PHASE 8 — Career Progression
// ---------------------------------------------------------------------------

export const careerLevelSchema = z.object({
  id,
  rank: progressionRank,
  /** Position on the ladder, ascending from 0. */
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  /** Total XP required to reach this level. Level 0 must be 0. */
  xpRequired: z.number().nonnegative(),
  responsibilities: z.array(z.string().min(1)).min(1),
  /** Feature/mission ids unlocked on reaching this level. */
  unlocks: z.array(z.string().min(1)).default([]),
});

// ---------------------------------------------------------------------------
// PHASE 9 — Achievements
// ---------------------------------------------------------------------------

export const badgeSchema = z.object({
  id,
  name: z.string().min(1),
  description: z.string().min(1),
  glyph: z.string().min(1),
  /** Machine-checkable rule, e.g. 'complete_missions:5' or 'reach_level:senior'. */
  criteria: z.string().min(1),
});

export const certificateSchema = z.object({
  id,
  title: z.string().min(1),
  description: z.string().min(1),
});

// ---------------------------------------------------------------------------
// PHASE 10 — Career Completion
// ---------------------------------------------------------------------------

export const completionSchema = z.object({
  /** Optional capstone mission id used as the final assessment. */
  finalAssessmentId: id.optional(),
  summaryHeadline: z.string().min(1),
  improvementAreas: z.array(z.string().min(1)).default([]),
  certificateId: id,
  /** Career ids to recommend next, powering the "Next Career" loop. */
  nextCareerSuggestions: z.array(id).default([]),
});

// ---------------------------------------------------------------------------
// The plug-in — a complete career, assembled from the ten phases.
// ---------------------------------------------------------------------------

export const careerDefinitionSchema = z.object({
  schemaVersion: z.literal('1.0'),

  // Phase 1
  overview: careerOverviewSchema,
  requiredSkills: z.array(requiredSkillSchema).min(1),
  roadmap: z.array(roadmapStageSchema).min(1),
  salary: z.array(salaryInsightSchema).min(1),
  futureOpportunities: z.array(futureOpportunitySchema).min(1),
  learningPath: z.array(learningPathItemSchema).min(1),

  // Phase 2 — references shared company types by id (see data/company-types.json).
  supportedCompanyTypes: z.array(id).min(1),

  // Phase 3 & 4 — optional; fall back to the reusable DEFAULT flows when omitted.
  joining: z.array(joiningStepSchema).optional(),
  dailyWork: z.array(dailyWorkSegmentSchema).optional(),

  // Phase 5
  missions: z.array(missionSchema).min(1),

  // Phase 6
  personas: z.array(aiPersonaSchema).min(1),
  dialogues: z.array(dialogueLineSchema).default([]),

  // Phase 7
  skills: z.array(skillDefinitionSchema).min(1),

  // Phase 8
  ladder: z.array(careerLevelSchema).min(1),

  // Phase 9
  badges: z.array(badgeSchema).default([]),
  certificates: z.array(certificateSchema).default([]),

  // Phase 10
  completion: completionSchema,
});

// ---------------------------------------------------------------------------
// Inferred types — what the rest of the app consumes. Never hand-write these.
// ---------------------------------------------------------------------------

export type CareerOverview = z.infer<typeof careerOverviewSchema>;
export type RequiredSkill = z.infer<typeof requiredSkillSchema>;
export type RoadmapStage = z.infer<typeof roadmapStageSchema>;
export type SalaryInsight = z.infer<typeof salaryInsightSchema>;
export type FutureOpportunity = z.infer<typeof futureOpportunitySchema>;
export type LearningPathItem = z.infer<typeof learningPathItemSchema>;
export type CompanyModifiers = z.infer<typeof companyModifiersSchema>;
export type CompanyType = z.infer<typeof companyTypeSchema>;
export type JoiningStep = z.infer<typeof joiningStepSchema>;
export type DailyWorkSegment = z.infer<typeof dailyWorkSegmentSchema>;
export type RubricCriterion = z.infer<typeof rubricCriterionSchema>;
export type SkillReward = z.infer<typeof skillRewardSchema>;
export type MissionStep = z.infer<typeof missionStepSchema>;
export type Mission = z.infer<typeof missionSchema>;
export type AiPersona = z.infer<typeof aiPersonaSchema>;
export type DialogueLine = z.infer<typeof dialogueLineSchema>;
export type SkillDefinition = z.infer<typeof skillDefinitionSchema>;
export type CareerLevel = z.infer<typeof careerLevelSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type CompletionConfig = z.infer<typeof completionSchema>;
export type CareerDefinition = z.infer<typeof careerDefinitionSchema>;

/**
 * A career after the registry has filled in default joining/daily flows. Screens and the
 * engine always consume this shape, so they never branch on "did the author omit joining?".
 */
export type ResolvedCareer = Omit<CareerDefinition, 'joining' | 'dailyWork'> & {
  joining: JoiningStep[];
  dailyWork: DailyWorkSegment[];
};
