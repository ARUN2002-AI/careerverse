/**
 * Workday stage renderers (Phase 7).
 *
 * The workday is an ordered sequence of stages (orchestration, identical for every career).
 * All CONTENT within a stage is data-driven from the active run — missions from the engine,
 * personas/dialogues from the career, schedule from `career.dailyWork`, feedback from the
 * deterministic generator. Nothing about a specific career, company, manager, or mission is
 * hardcoded. Stages reuse the shared <JoiningScene/> frame so the whole day feels like one flow.
 */

import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import {
  JoiningScene,
  Text,
  Card,
  Badge,
  Input,
  MissionCard,
  EmployeeBadge,
  ChatMessage,
  ProgressBar,
  WorkTimer,
  TaskChecklist,
  AttendanceCard,
  ScheduleCard,
  TeamCard,
  FeedbackCard,
  ReviewCard,
  SummaryCard,
  ActivityCard,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { getProgressToNextLevel } from '../../simulation';
import { formatDuration } from '../../utils/time';
import { titleCase, withThousands } from '../../utils/format';
import type { WorkdayFeedback } from '../../utils/feedback';
import type {
  ResolvedCareer,
  CompanyType,
  SimulationState,
  Mission,
  DailyWorkType,
  AiPersona,
} from '../../simulation';

// ---------------------------------------------------------------------------
// Stage order + segment mapping
// ---------------------------------------------------------------------------

export const WORKDAY_STAGES = [
  'morning_login',
  'attendance',
  'standup',
  'schedule',
  'assignment',
  'mission_details',
  'research',
  'work_session',
  'collaboration',
  'problem_solving',
  'submission',
  'ai_feedback',
  'manager_review',
  'end_of_day',
] as const;

export type WorkdayStage = (typeof WORKDAY_STAGES)[number];

/** Which career.dailyWork segment (by type) each stage marks complete in the engine. */
export const STAGE_SEGMENT: Partial<Record<WorkdayStage, DailyWorkType>> = {
  attendance: 'morning_login',
  standup: 'standup',
  assignment: 'task_assignment',
  research: 'research',
  work_session: 'execution',
  collaboration: 'collaboration',
  problem_solving: 'problem_solving',
  submission: 'documentation',
  ai_feedback: 'review',
  manager_review: 'meeting',
  end_of_day: 'eod_summary',
};

// ---------------------------------------------------------------------------
// Context passed to every stage
// ---------------------------------------------------------------------------

export interface WorkdayCtx {
  career: ResolvedCareer;
  companyType: CompanyType;
  state: SimulationState;
  current: number;
  total: number;
  dateLabel: string;
  checkInLabel: string;
  sessionStartMs: number;
  missionId: string | null;
  mission: Mission | undefined;
  availableMissions: Mission[];
  workChecked: string[];
  feedback: WorkdayFeedback | null;
  employeeId: string;
  assignMission: (id: string) => void;
  toggleWorkItem: (id: string) => void;
  next: () => void;
  endDayEarly: () => void;
  startNextDay: () => void;
  goHome: () => void;
}

type StageProps = { ctx: WorkdayCtx };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const managerOf = (c: ResolvedCareer): AiPersona | undefined => c.personas.find((p) => p.role === 'manager');
const teamOf = (c: ResolvedCareer): AiPersona[] =>
  c.personas.filter((p) => p.role === 'teammate' || p.role === 'mentor');
const lineFor = (c: ResolvedCareer, id?: string): string | undefined =>
  id ? c.dialogues.find((d) => d.personaId === id)?.text : undefined;

function Labelled({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Text variant="label" color="caption">
        {label}
      </Text>
      <Text variant="sm" color="secondary">
        {value}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

function MorningLoginStage({ ctx }: StageProps) {
  const theme = useTheme();
  const level = getProgressToNextLevel(ctx.career, ctx.state).current;
  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Morning login"
      title="Welcome back"
      subtitle={`${ctx.dateLabel} · ${ctx.companyType.name}`}
      primary={{ label: 'Start working', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        <EmployeeBadge
          roleTitle={ctx.career.overview.title}
          companyName={ctx.companyType.name}
          employeeId={ctx.employeeId}
          levelTitle={level.title}
        />
        <Card variant="solid" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="sm" color="secondary">
            Work status
          </Text>
          <Badge label="Ready to work" tone="success" glyph="●" />
        </Card>
      </View>
    </JoiningScene>
  );
}

function AttendanceStage({ ctx }: StageProps) {
  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Attendance"
      title="Clock in"
      subtitle="Mark your attendance for the day."
      primary={{ label: 'Check in', onPress: ctx.next }}
    >
      <AttendanceCard
        checkInTime={ctx.checkInLabel}
        streak={ctx.state.day}
        workingHours="Standard shift"
        status="On the clock"
      />
    </JoiningScene>
  );
}

function StandupStage({ ctx }: StageProps) {
  const theme = useTheme();
  const manager = managerOf(ctx.career);
  const managerLine = lineFor(ctx.career, manager?.id);
  const team = teamOf(ctx.career);
  const goal = ctx.availableMissions[0]?.title ?? 'Support the team and keep the sprint moving';

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Daily stand-up"
      title="Team stand-up"
      subtitle="Align with your manager and the team before the day begins."
      primary={{ label: 'Join the day', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        {manager && managerLine && <ChatMessage persona={manager} text={managerLine} channel="meeting" />}

        <Card variant="solid" style={{ gap: theme.spacing[3] }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="label" color="caption">
              Current sprint
            </Text>
            <Badge label={`Day ${ctx.state.day}`} tone="brand" glyph="◆" />
          </View>
          <Labelled label="Today’s goal" value={goal} />
          <Labelled label="Team goal" value="Deliver the sprint commitments together." />
        </Card>

        {team.length > 0 && <TeamCard personas={team} />}
      </View>
    </JoiningScene>
  );
}

function ScheduleStage({ ctx }: StageProps) {
  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Today’s schedule"
      title="Your day"
      subtitle="Here’s how the day is shaped."
      primary={{ label: 'Let’s go', onPress: ctx.next }}
    >
      <ScheduleCard
        segments={ctx.career.dailyWork}
        completedIds={ctx.state.completedDailySegmentIds}
      />
    </JoiningScene>
  );
}

function AssignmentStage({ ctx }: StageProps) {
  const theme = useTheme();
  const missions = ctx.availableMissions;

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Mission assignment"
      title="Your assignment"
      subtitle={missions.length ? 'Tap a mission to pick it up.' : undefined}
      primary={
        missions.length
          ? { label: 'Tap a mission to start', onPress: () => {} }
          : { label: 'Wrap up — light day', onPress: ctx.endDayEarly }
      }
      primaryDisabled={missions.length > 0}
    >
      {missions.length ? (
        <View style={{ gap: theme.spacing[3] }}>
          {missions.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              status="available"
              onPress={() => {
                ctx.assignMission(m.id);
                ctx.next();
              }}
            />
          ))}
        </View>
      ) : (
        <Card variant="solid">
          <Text variant="sm" color="secondary">
            No new assignments today — you may be waiting on a promotion or the next sprint. Wrap
            up and come back tomorrow.
          </Text>
        </Card>
      )}
    </JoiningScene>
  );
}

function MissionDetailsStage({ ctx }: StageProps) {
  const theme = useTheme();
  const m = ctx.mission;
  if (!m) return <FallbackStage ctx={ctx} />;

  const skillNames = new Map(ctx.career.skills.map((s) => [s.id, s.name]));

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Mission details"
      title={m.title}
      subtitle={m.brief}
      primary={{ label: 'I understand the task', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        <Section title="Objectives">
          {m.steps.map((s, i) => (
            <Text key={s.id} variant="sm" color="secondary">
              {i + 1}. {s.prompt}
            </Text>
          ))}
        </Section>

        {m.rubric.length > 0 && (
          <Section title="Acceptance criteria">
            {m.rubric.map((r) => (
              <Text key={r.id} variant="sm" color="secondary">
                • {r.label} — {r.description}
              </Text>
            ))}
          </Section>
        )}

        <Section title="Expected output">
          <Text variant="sm" color="secondary">
            {m.deliverableLabel}
          </Text>
        </Section>

        <Section title="Rewards">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            <Badge label={`+${m.xpReward} XP`} tone="brand" glyph="★" />
            {m.skillRewards.map((r) => (
              <Badge
                key={r.skillId}
                label={`${skillNames.get(r.skillId) ?? r.skillId} +${r.points}`}
                tone="accent"
                glyph="◆"
              />
            ))}
          </View>
        </Section>

        {ctx.career.learningPath.length > 0 && (
          <Section title="Reference documents">
            {ctx.career.learningPath.map((l) => (
              <View
                key={l.id}
                style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}
              >
                <Text variant="sm" color="brand">
                  ▤
                </Text>
                <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                  {l.title}
                </Text>
                <Badge label={titleCase(l.type)} tone="neutral" />
              </View>
            ))}
          </Section>
        )}
      </View>
    </JoiningScene>
  );
}

function ResearchStage({ ctx }: StageProps) {
  const theme = useTheme();
  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Research"
      title="Do your research"
      subtitle="Gather what you need before you build."
      primary={{ label: 'Ready to work', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        <Section title="Resources & knowledge base">
          {ctx.career.learningPath.map((l) => (
            <View
              key={l.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}
            >
              <Text variant="sm" color="brand">
                ◇
              </Text>
              <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                {l.title}
              </Text>
              <Badge label={titleCase(l.type)} tone="neutral" />
            </View>
          ))}
        </Section>

        <Section title="Skills in play">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing[2] }}>
            {ctx.career.requiredSkills.map((s) => (
              <Badge key={s.id} label={s.name} tone="neutral" />
            ))}
          </View>
        </Section>
      </View>
    </JoiningScene>
  );
}

function WorkSessionStage({ ctx }: StageProps) {
  const theme = useTheme();
  const m = ctx.mission;
  if (!m) return <FallbackStage ctx={ctx} />;

  const items = m.steps.map((s) => ({ id: s.id, label: s.prompt }));
  const ratio = items.length ? ctx.workChecked.length / items.length : 1;

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Work session"
      title="Focus mode"
      subtitle={m.title}
      primary={{ label: 'Finish work session', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[5] }}>
        <WorkTimer />
        <ProgressBar
          value={ratio}
          label="Task progress"
          trailing={`${ctx.workChecked.length}/${items.length}`}
        />
        <Section title="Task checklist">
          <TaskChecklist items={items} checkedIds={ctx.workChecked} onToggle={ctx.toggleWorkItem} />
        </Section>
      </View>
    </JoiningScene>
  );
}

function CollaborationStage({ ctx }: StageProps) {
  const theme = useTheme();
  const team = teamOf(ctx.career);
  const manager = managerOf(ctx.career);
  const messages = ctx.career.dialogues;

  const activity = [
    ...(ctx.availableMissions.length
      ? [{ glyph: '◆', text: `${ctx.availableMissions.length} task(s) in the sprint backlog.` }]
      : []),
    { glyph: '◍', text: `The team is working in a ${ctx.companyType.name}.` },
  ];

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Collaboration"
      title="Work with the team"
      subtitle="Sync with the people around you."
      primary={{ label: 'Continue', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        {manager && <TeamCard personas={[manager, ...team]} />}
        {messages.length > 0 && (
          <Section title="Messages">
            <View style={{ gap: theme.spacing[3] }}>
              {messages.map((msg) => {
                const p = ctx.career.personas.find((x) => x.id === msg.personaId);
                return p ? <ChatMessage key={msg.id} persona={p} text={msg.text} channel={msg.channel} /> : null;
              })}
            </View>
          </Section>
        )}
        <Section title="Activity">
          <ActivityCard items={activity} />
        </Section>
      </View>
    </JoiningScene>
  );
}

function ProblemSolvingStage({ ctx }: StageProps) {
  const theme = useTheme();
  const m = ctx.mission;
  const choiceStep = m?.steps.find((s) => s.kind === 'choice' && s.options && s.options.length);
  const question = choiceStep?.prompt ?? 'How will you approach this problem?';
  const options = choiceStep?.options ?? [
    { id: 'analyse', label: 'Analyse the problem fully, then act' },
    { id: 'prototype', label: 'Prototype quickly and iterate' },
  ];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Problem solving"
      title="A decision to make"
      subtitle={question}
      primary={{ label: 'Commit to your approach', onPress: ctx.next }}
      primaryDisabled={!selected}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {options.map((o) => {
          const active = selected === o.id;
          return (
            <Pressable
              key={o.id}
              onPress={() => setSelected(o.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              accessibilityLabel={o.label}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing[3],
                padding: theme.spacing[4],
                borderRadius: theme.radius.md,
                backgroundColor: active ? theme.colors.brandSoft : theme.colors.card,
                borderWidth: active ? 1.5 : 1,
                borderColor: active ? theme.colors.brand : theme.colors.divider,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text variant="sm" color={active ? 'brand' : 'caption'}>
                {active ? '◉' : '○'}
              </Text>
              <Text variant="sm" style={{ flex: 1 }}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </JoiningScene>
  );
}

function SubmissionStage({ ctx }: StageProps) {
  const theme = useTheme();
  const m = ctx.mission;
  const [comment, setComment] = useState('');

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Task submission"
      title="Submit your work"
      subtitle="Send your work to your manager for review."
      primary={{ label: 'Submit work', onPress: ctx.next }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        <Card variant="solid" style={{ gap: theme.spacing[3] }}>
          <Labelled label="Completed work" value={m?.deliverableLabel ?? 'Your work'} />
          <Labelled label="Attachment" value={`${m ? m.id : 'work'}-submission.zip`} />
          <Labelled label="Submitted at" value={ctx.checkInLabel} />
        </Card>
        <Input
          label="Comments (optional)"
          value={comment}
          onChangeText={setComment}
          placeholder="Add a note for your manager"
          multiline
        />
      </View>
    </JoiningScene>
  );
}

function AiFeedbackStage({ ctx }: StageProps) {
  const theme = useTheme();
  const ready = Boolean(ctx.feedback);

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="AI feedback"
      title="Your work was reviewed"
      subtitle={ready ? 'Here’s what the AI review found.' : 'Your AI manager is reviewing your work…'}
      primary={{ label: 'See manager review', onPress: ctx.next }}
      primaryDisabled={!ready}
    >
      {ctx.feedback ? (
        <FeedbackCard feedback={ctx.feedback} />
      ) : (
        <Card variant="solid">
          <Text variant="sm" color="secondary">
            Reviewing your submission against the mission’s criteria…
          </Text>
        </Card>
      )}
    </JoiningScene>
  );
}

function ManagerReviewStage({ ctx }: StageProps) {
  const manager = managerOf(ctx.career);
  const managerLine = lineFor(ctx.career, manager?.id);
  const score = ctx.feedback?.score ?? ctx.state.performanceScore;
  const approved = score >= 60;

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Manager review"
      title="Your manager’s take"
      subtitle="Final word on today’s work."
      primary={{ label: 'Finish the day', onPress: ctx.next }}
    >
      <ReviewCard
        reviewer={manager}
        performance={score}
        approved={approved}
        comment={
          managerLine ??
          (approved
            ? 'Good work today. This meets the bar — keep it up.'
            : 'Solid effort. Address the review notes and it’ll be there.')
        }
        recognition={score >= 85 ? 'Recognised for outstanding work today.' : undefined}
      />
    </JoiningScene>
  );
}

function EndOfDayStage({ ctx }: StageProps) {
  const theme = useTheme();
  const progress = getProgressToNextLevel(ctx.career, ctx.state);
  const minutes = Math.max(1, Math.round((Date.now() - ctx.sessionStartMs) / 60000));
  const productivity =
    ctx.state.performanceScore >= 80 ? 'High' : ctx.state.performanceScore >= 60 ? 'Steady' : 'Building';

  const earnedBadges = ctx.career.badges
    .filter((b) => ctx.state.earnedBadgeIds.includes(b.id))
    .map((b) => b.name);

  const xpInto = ctx.state.totalXp - progress.current.xpRequired;
  const xpSpan = progress.next ? progress.next.xpRequired - progress.current.xpRequired : 0;

  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="End of day"
      title={`Day ${ctx.state.day} wrapped`}
      subtitle="Here’s how today went."
      primary={{ label: 'Start next day', onPress: ctx.startNextDay }}
      secondary={{ label: 'Back to desk', onPress: ctx.goHome }}
    >
      <View style={{ gap: theme.spacing[5] }}>
        <SummaryCard
          title="Today’s summary"
          stats={[
            { label: 'Time worked', value: formatDuration(minutes * 60) },
            { label: 'Productivity', value: productivity },
            { label: 'Performance', value: `${ctx.state.performanceScore}` },
            { label: 'Missions done', value: `${ctx.state.completedMissionIds.length}` },
            { label: 'Total XP', value: withThousands(ctx.state.totalXp) },
            { label: 'Level', value: progress.current.title },
          ]}
          achievements={earnedBadges}
        />

        {progress.next ? (
          <ProgressBar
            value={progress.ratio}
            label={`Progress to ${progress.next.title}`}
            trailing={`${withThousands(xpInto)}/${withThousands(xpSpan)} XP`}
          />
        ) : (
          <Text variant="sm" color="secondary">
            You’ve reached the top of the ladder.
          </Text>
        )}

        <Card variant="solid" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="sm" color="secondary">
            Pending tasks
          </Text>
          <Badge label={`${ctx.availableMissions.length}`} tone="neutral" />
        </Card>
      </View>
    </JoiningScene>
  );
}

function FallbackStage({ ctx }: StageProps) {
  return (
    <JoiningScene
      current={ctx.current}
      total={ctx.total}
      eyebrow="Workday"
      title="Continue"
      subtitle="Move on to the next part of your day."
      primary={{ label: 'Continue', onPress: ctx.next }}
    />
  );
}

// ---------------------------------------------------------------------------
// Shared section wrapper + registry
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing[2] }}>
      <Text variant="label" color="caption">
        {title}
      </Text>
      {children}
    </View>
  );
}

export const STAGE_RENDERERS: Record<WorkdayStage, React.ComponentType<StageProps>> = {
  morning_login: MorningLoginStage,
  attendance: AttendanceStage,
  standup: StandupStage,
  schedule: ScheduleStage,
  assignment: AssignmentStage,
  mission_details: MissionDetailsStage,
  research: ResearchStage,
  work_session: WorkSessionStage,
  collaboration: CollaborationStage,
  problem_solving: ProblemSolvingStage,
  submission: SubmissionStage,
  ai_feedback: AiFeedbackStage,
  manager_review: ManagerReviewStage,
  end_of_day: EndOfDayStage,
};
