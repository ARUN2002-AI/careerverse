/**
 * AI Workplace derivation (Phase 8).
 *
 * Builds the entire communication model — chat threads, messages, meetings, notifications, and
 * mentor coaching — PURELY from the active run's engine data (personas, dialogues, missions,
 * level, performance). Nothing is career-specific or hardcoded; every line references real run
 * data, and generation is deterministic (no clock, no RNG), so the same run yields the same
 * workplace. This is a read-only projection over the engine — the engine itself is untouched.
 */

import {
  getAvailableMissions,
  getCurrentLevel,
  getNextLevel,
  type ResolvedCareer,
  type CompanyType,
  type SimulationState,
  type AiPersona,
  type AiRole,
  type CommChannel,
} from '../simulation';
import { withThousands } from './format';

export type ThreadKind = 'manager' | 'mentor' | 'hr' | 'team' | 'task';

export interface WorkMessage {
  id: string;
  fromSelf: boolean;
  fromPersonaId?: string;
  text: string;
  channel: CommChannel;
  when: string;
}

export interface WorkThread {
  id: string;
  kind: ThreadKind;
  title: string;
  subtitle: string;
  personaId?: string;
  role: AiRole;
  glyph: string;
  channel: CommChannel;
  messages: WorkMessage[];
  unread: number;
}

export interface WorkNotification {
  id: string;
  glyph: string;
  text: string;
  when: string;
}

export interface WorkMeeting {
  id: string;
  kind: 'standup' | 'one_on_one' | 'review';
  title: string;
  when: string;
  attendeeIds: string[];
  agenda: string[];
  notes?: string;
}

export interface CoachingTip {
  id: string;
  label: string;
  text: string;
}

export interface Workplace {
  threads: WorkThread[];
  notifications: WorkNotification[];
  meetings: WorkMeeting[];
  coaching: CoachingTip[];
  mentorId?: string;
}

// ---------------------------------------------------------------------------

const personaOf = (career: ResolvedCareer, role: AiRole): AiPersona | undefined =>
  career.personas.find((p) => p.role === role);

const dialoguesOf = (career: ResolvedCareer, personaId: string) =>
  career.dialogues.filter((d) => d.personaId === personaId);

function msg(
  id: string,
  text: string,
  channel: CommChannel,
  personaId?: string,
  fromSelf = false,
): WorkMessage {
  return { id, text, channel, fromPersonaId: personaId, fromSelf, when: 'Today' };
}

/** Builds the whole workplace projection from the active run. */
export function buildWorkplace(
  career: ResolvedCareer,
  companyType: CompanyType,
  state: SimulationState,
): Workplace {
  const manager = personaOf(career, 'manager');
  const mentor = personaOf(career, 'mentor');
  const hr = personaOf(career, 'hr');
  const team = career.personas.filter((p) => p.role === 'teammate' || p.role === 'mentor');

  const level = getCurrentLevel(career, state);
  const next = getNextLevel(career, state);
  const missions = getAvailableMissions(career, state);
  const topMission = missions[0];

  const threads: WorkThread[] = [];

  // Manager — task suggestions + performance feedback.
  if (manager) {
    const messages: WorkMessage[] = [];
    dialoguesOf(career, manager.id).forEach((d, i) =>
      messages.push(msg(`t-mgr-d${i}`, d.text, d.channel, manager.id)),
    );
    if (topMission) {
      messages.push(
        msg('t-mgr-task', `Your next task is ready: ${topMission.title}. ${topMission.brief}`, 'slack', manager.id),
      );
    }
    if (state.completedMissionIds.length > 0) {
      messages.push(
        msg('t-mgr-perf', `Nice progress — your performance is at ${state.performanceScore}/100.`, 'slack', manager.id),
      );
    }
    if (messages.length === 0) messages.push(msg('t-mgr-hi', 'Welcome to the team. Ping me anytime.', 'slack', manager.id));
    threads.push({
      id: 'thread-manager',
      kind: 'manager',
      title: manager.name,
      subtitle: manager.title,
      personaId: manager.id,
      role: 'manager',
      glyph: manager.glyph,
      channel: 'slack',
      messages,
      unread: messages.length,
    });
  }

  // Mentor — daily coaching + career advice.
  if (mentor) {
    const messages: WorkMessage[] = [];
    dialoguesOf(career, mentor.id).forEach((d, i) =>
      messages.push(msg(`t-men-d${i}`, d.text, d.channel, mentor.id)),
    );
    messages.push(
      msg('t-men-coach', `You're a ${level.title}. ${next ? `Aim for ${next.title} next.` : 'You’re at the top — keep mentoring others.'}`, 'slack', mentor.id),
    );
    threads.push({
      id: 'thread-mentor',
      kind: 'mentor',
      title: mentor.name,
      subtitle: mentor.title,
      personaId: mentor.id,
      role: 'mentor',
      glyph: mentor.glyph,
      channel: 'slack',
      messages,
      unread: messages.length,
    });
  }

  // HR — career guidance.
  if (hr) {
    const messages: WorkMessage[] = [];
    dialoguesOf(career, hr.id).forEach((d, i) =>
      messages.push(msg(`t-hr-d${i}`, d.text, d.channel, hr.id)),
    );
    messages.push(
      msg('t-hr-guide', `You're on the ${career.overview.title} track. Reach out for anything you need.`, 'email', hr.id),
    );
    threads.push({
      id: 'thread-hr',
      kind: 'hr',
      title: hr.name,
      subtitle: hr.title,
      personaId: hr.id,
      role: 'hr',
      glyph: hr.glyph,
      channel: 'email',
      messages,
      unread: messages.length,
    });
  }

  // Team channel.
  if (team.length > 0) {
    const messages: WorkMessage[] = [];
    team.forEach((member) =>
      dialoguesOf(career, member.id).forEach((d, i) =>
        messages.push(msg(`t-team-${member.id}-${i}`, d.text, d.channel, member.id)),
      ),
    );
    messages.push(msg('t-team-sprint', `The team is heads-down on the sprint in a ${companyType.name}.`, 'slack', team[0].id));
    threads.push({
      id: 'thread-team',
      kind: 'team',
      title: 'Team channel',
      subtitle: `${team.length} member${team.length === 1 ? '' : 's'}`,
      personaId: team[0].id,
      role: 'teammate',
      glyph: '◍',
      channel: 'slack',
      messages,
      unread: messages.length,
    });
  }

  // Task discussions — one thread per available mission (the manager kicks it off).
  missions.slice(0, 3).forEach((m) => {
    const messages: WorkMessage[] = [
      msg(`t-task-${m.id}-brief`, m.brief, 'slack', manager?.id),
    ];
    if (m.rubric.length > 0) {
      messages.push(
        msg(`t-task-${m.id}-crit`, `Acceptance: ${m.rubric.map((r) => r.label).join(', ')}.`, 'slack', manager?.id),
      );
    }
    threads.push({
      id: `thread-task-${m.id}`,
      kind: 'task',
      title: m.title,
      subtitle: 'Task discussion',
      personaId: manager?.id,
      role: 'manager',
      glyph: '◆',
      channel: 'slack',
      messages,
      unread: messages.length,
    });
  });

  // Meetings.
  const meetings: WorkMeeting[] = [];
  if (manager) {
    meetings.push({
      id: 'meet-standup',
      kind: 'standup',
      title: 'Daily stand-up',
      when: '9:00 AM',
      attendeeIds: [manager.id, ...team.map((t) => t.id)],
      agenda: ['What you did yesterday', 'What you’ll do today', 'Any blockers'],
      notes: dialoguesOf(career, manager.id)[0]?.text,
    });
    meetings.push({
      id: 'meet-1on1',
      kind: 'one_on_one',
      title: `1:1 with ${manager.name}`,
      when: '2:00 PM',
      attendeeIds: [manager.id],
      agenda: ['Progress & priorities', 'Feedback', 'Your growth'],
    });
    meetings.push({
      id: 'meet-review',
      kind: 'review',
      title: 'Sprint review',
      when: '4:30 PM',
      attendeeIds: [manager.id, ...team.map((t) => t.id)],
      agenda: ['Demo the work', 'Retrospective', 'Plan next sprint'],
    });
  }

  // Notifications.
  const notifications: WorkNotification[] = [];
  if (missions.length > 0) {
    notifications.push({
      id: 'n-tasks',
      glyph: '◆',
      text: `${missions.length} task${missions.length === 1 ? '' : 's'} assigned to you.`,
      when: 'Today',
    });
  }
  notifications.push({
    id: 'n-level',
    glyph: '★',
    text: `You're a ${level.title} with ${withThousands(state.totalXp)} XP.`,
    when: 'Today',
  });
  if (state.completedMissionIds.length > 0) {
    notifications.push({
      id: 'n-review',
      glyph: '◉',
      text: `Your latest review scored ${state.performanceScore}/100.`,
      when: 'Today',
    });
  }
  if (manager) {
    notifications.push({ id: 'n-standup', glyph: '✦', text: 'Daily stand-up at 9:00 AM.', when: 'Today' });
  }

  // Mentor coaching (daily coaching + skill/career recommendations).
  const coaching: CoachingTip[] = [];
  coaching.push({
    id: 'c-perf',
    label: 'Daily coaching',
    text:
      state.performanceScore >= 80
        ? 'You’re performing strongly. Keep raising the bar and help teammates.'
        : state.performanceScore >= 60
          ? 'Steady work. Tighten quality on your next task to push higher.'
          : 'Focus on finishing tasks fully — completion drives your score up fast.',
  });
  const focusSkill = career.requiredSkills.find((s) => s.importance === 'core') ?? career.requiredSkills[0];
  if (focusSkill) {
    coaching.push({
      id: 'c-skill',
      label: 'Skill recommendation',
      text: `Sharpen ${focusSkill.name} — it’s core to the ${career.overview.title} role.`,
    });
  }
  coaching.push({
    id: 'c-career',
    label: 'Career advice',
    text: next
      ? `You’re ${withThousands(Math.max(0, next.xpRequired - state.totalXp))} XP from ${next.title}. Keep shipping.`
      : 'You’ve reached the top of the ladder — consider mentoring or a new career.',
  });

  return { threads, notifications, meetings, coaching, mentorId: mentor?.id };
}

/** Finds a thread by id in a prebuilt workplace. */
export function findThread(workplace: Workplace, id: string): WorkThread | undefined {
  return workplace.threads.find((t) => t.id === id);
}

/** Finds a meeting by id in a prebuilt workplace. */
export function findMeeting(workplace: Workplace, id: string): WorkMeeting | undefined {
  return workplace.meetings.find((m) => m.id === id);
}

/**
 * Deterministic persona reply for the chat composer — cycles the persona's own lines, so
 * replies stay grounded in the thread's data rather than being fabricated.
 */
export function nextReply(thread: WorkThread, replyIndex: number): string {
  const personaLines = thread.messages.filter((m) => !m.fromSelf).map((m) => m.text);
  if (personaLines.length === 0) return 'Got it — thanks for the update.';
  return personaLines[replyIndex % personaLines.length];
}
