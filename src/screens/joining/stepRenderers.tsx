/**
 * Interactive renderers for each Phase 3 joining step.
 *
 * Every renderer is a small component that composes <JoiningScene/> with a step-specific,
 * INTERACTIVE body — an offer letter to accept, checklists to tick, a badge to generate, an
 * email to create. None of them is a static information page.
 *
 * All content is derived from the active run's data (career, companyType, personas, dialogues,
 * state). Nothing about a specific company, department, manager, or dialogue is hardcoded here;
 * unknown lines simply fall back to factual, non-fabricated copy. A registry maps step `type`
 * to a renderer, with a generic fallback so future step types still render.
 */

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  JoiningScene,
  Text,
  Card,
  Badge,
  CheckRow,
  Input,
  PersonaCard,
  ChatMessage,
  EmployeeBadge,
} from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { titleCase, formatMoney } from '../../utils/format';
import {
  deriveEmployeeId,
  defaultEmailHandle,
  workspaceEmail,
} from '../../utils/identity';
import type {
  ResolvedCareer,
  CompanyType,
  SimulationState,
  JoiningStep,
  JoiningStepType,
  AiPersona,
  AiRole,
} from '../../simulation';

export interface StepRendererProps {
  step: JoiningStep;
  current: number;
  total: number;
  career: ResolvedCareer;
  companyType: CompanyType;
  state: SimulationState;
  /** Marks the step complete (awards XP) and advances to the next step. */
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Small shared bits (local to onboarding steps)
// ---------------------------------------------------------------------------

function persona(career: ResolvedCareer, role: AiRole): AiPersona | undefined {
  return career.personas.find((p) => p.role === role);
}

function dialogueFor(career: ResolvedCareer, personaId: string | undefined): string | undefined {
  if (!personaId) return undefined;
  return career.dialogues.find((d) => d.personaId === personaId)?.text;
}

function Row({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing[4] }}>
      <Text variant="sm" color="caption">
        {label}
      </Text>
      <Text variant="sm" style={{ flex: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

function Facet({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2, minWidth: 120, flexGrow: 1 }}>
      <Text variant="label" color="caption">
        {label}
      </Text>
      <Text variant="sm">{value}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function OfferLetterStep(p: StepRendererProps) {
  const theme = useTheme();
  const level = p.career.ladder[0];
  const pay = p.career.salary[0];

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Your offer"
      title="You’ve got an offer"
      subtitle={`${p.companyType.name} would like you to join as ${p.career.overview.title}.`}
      primary={{ label: 'Accept offer', onPress: p.onComplete }}
    >
      <Card variant="glass" style={{ gap: theme.spacing[3] }}>
        <Text variant="label" color="caption">
          Offer of employment
        </Text>
        <Text variant="h3">{p.career.overview.title}</Text>
        <View style={{ height: 1, backgroundColor: theme.colors.divider }} />
        <View style={{ gap: theme.spacing[2] }}>
          <Row label="Employer" value={p.companyType.name} />
          <Row label="Level" value={level.title} />
          <Row label="Start date" value="Day one" />
          {pay && (
            <Row label="Pay (indicative)" value={`${formatMoney(pay.junior, pay.currency)}/${pay.period}`} />
          )}
        </View>
        <Text variant="xs" color="caption">
          Issued on behalf of {p.companyType.name}.
        </Text>
      </Card>
    </JoiningScene>
  );
}

function ConfirmationStep(p: StepRendererProps) {
  const theme = useTheme();
  const items = ['My details are correct', 'I accept the offer terms', 'I’m ready to start'];
  const [checked, setChecked] = useState<boolean[]>(items.map(() => false));
  const allChecked = checked.every(Boolean);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Employment confirmation"
      title="Make it official"
      subtitle="Confirm the essentials to finalise your joining."
      primary={{ label: 'Confirm employment', onPress: p.onComplete }}
      primaryDisabled={!allChecked}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {items.map((item, i) => (
          <CheckRow
            key={item}
            label={item}
            checked={checked[i]}
            onToggle={() =>
              setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
            }
          />
        ))}
      </View>
    </JoiningScene>
  );
}

function HrWelcomeStep(p: StepRendererProps) {
  const theme = useTheme();
  const hr = persona(p.career, 'hr');
  const line = dialogueFor(p.career, hr?.id);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="HR welcome"
      title="Welcome aboard"
      subtitle="Your first hello from the People Team."
      primary={{ label: 'Thanks!', onPress: p.onComplete }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        {hr && line ? (
          <ChatMessage persona={hr} text={line} channel="email" />
        ) : (
          hr && <PersonaCard persona={hr} detail="Here to help you settle in." />
        )}
      </View>
    </JoiningScene>
  );
}

function CompanyIntroStep(p: StepRendererProps) {
  const theme = useTheme();
  const c = p.companyType;

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Company introduction"
      title={`Life in a ${c.name}`}
      subtitle={c.description}
      primary={{ label: 'Got it', onPress: p.onComplete }}
    >
      <Card variant="solid" style={{ gap: theme.spacing[4] }}>
        <Text variant="sm" color="secondary">
          {c.culture}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            rowGap: theme.spacing[3],
            columnGap: theme.spacing[4],
          }}
        >
          <Facet label="Team size" value={c.teamSize} />
          <Facet label="Communication" value={c.communicationStyle} />
          <Facet label="Growth" value={c.growthSpeed} />
          <Facet label="Pace" value={c.modifiers.paceLabel} />
        </View>
      </Card>
    </JoiningScene>
  );
}

function OfficeTourStep(p: StepRendererProps) {
  const theme = useTheme();
  const c = p.companyType;
  // Generic workplace zones; the descriptive line is woven from company data.
  const zones = [
    { glyph: '▤', name: 'Your workspace', line: c.workStyle },
    { glyph: '◍', name: 'Collaboration area', line: `A team of ${c.teamSize}. ${c.communicationStyle}` },
    { glyph: '◇', name: 'Focus rooms', line: c.culture },
  ];

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Office tour"
      title="Look around"
      subtitle="Swipe through the space where you’ll work."
      primary={{ label: 'Head to your desk', onPress: p.onComplete }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: theme.spacing[3], paddingRight: theme.spacing[4] }}
      >
        {zones.map((z) => (
          <Card key={z.name} variant="glass" style={{ width: 220, gap: theme.spacing[3] }}>
            <Text variant="h2" color="brand">
              {z.glyph}
            </Text>
            <Text variant="bodyMd">{z.name}</Text>
            <Text variant="sm" color="secondary">
              {z.line}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </JoiningScene>
  );
}

function DepartmentStep(p: StepRendererProps) {
  const theme = useTheme();
  const dept = titleCase(p.career.overview.category);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Department introduction"
      title={`The ${dept} team`}
      subtitle="Where your work lives and who you’ll deliver with."
      primary={{ label: 'Continue', onPress: p.onComplete }}
    >
      <Card variant="solid" style={{ gap: theme.spacing[3] }}>
        <Text variant="sm" color="secondary">
          {p.career.overview.description}
        </Text>
        <View style={{ flexDirection: 'row', gap: theme.spacing[2] }}>
          <Badge label={dept} tone="brand" glyph="◈" />
          <Badge label={`${p.companyType.teamSize}`} tone="neutral" />
        </View>
      </Card>
    </JoiningScene>
  );
}

function ManagerStep(p: StepRendererProps) {
  const theme = useTheme();
  const mgr = persona(p.career, 'manager');
  const line = dialogueFor(p.career, mgr?.id);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Manager introduction"
      title="Meet your manager"
      subtitle="The person who’ll assign your work and review it."
      primary={{ label: 'Say hi', onPress: p.onComplete }}
    >
      <View style={{ gap: theme.spacing[4] }}>
        {mgr && <PersonaCard persona={mgr} detail={mgr.tone} />}
        {mgr && line && <ChatMessage persona={mgr} text={line} channel="slack" />}
      </View>
    </JoiningScene>
  );
}

function TeamStep(p: StepRendererProps) {
  const theme = useTheme();
  const team = p.career.personas.filter((x) => x.role === 'teammate' || x.role === 'mentor');

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Team introduction"
      title="Meet the team"
      subtitle="The people you’ll work with day to day."
      primary={{ label: 'Continue', onPress: p.onComplete }}
    >
      {team.length > 0 ? (
        <View style={{ gap: theme.spacing[3] }}>
          {team.map((member) => (
            <PersonaCard key={member.id} persona={member} detail={member.title} />
          ))}
        </View>
      ) : (
        <Card variant="solid">
          <Text variant="sm" color="secondary">
            You’re joining a close team of {p.companyType.teamSize}. You’ll meet them on day one.
          </Text>
        </Card>
      )}
    </JoiningScene>
  );
}

function EmployeeIdStep(p: StepRendererProps) {
  const theme = useTheme();
  const [generated, setGenerated] = useState(false);
  const employeeId = deriveEmployeeId(p.state, p.career, p.companyType);
  const level = p.career.ladder[0];

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Employee ID card"
      title="Your badge"
      subtitle="Generate the badge that makes it official."
      primary={
        generated
          ? { label: 'Looks great', onPress: p.onComplete }
          : { label: 'Generate my badge', onPress: () => setGenerated(true) }
      }
    >
      {generated ? (
        <EmployeeBadge
          roleTitle={p.career.overview.title}
          companyName={p.companyType.name}
          employeeId={employeeId}
          levelTitle={level.title}
        />
      ) : (
        <Card
          variant="outline"
          style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing[12] }}
        >
          <Text variant="h2" color="caption">
            ▢
          </Text>
          <Text variant="sm" color="caption" style={{ marginTop: theme.spacing[2] }}>
            Tap generate to create your ID
          </Text>
        </Card>
      )}
    </JoiningScene>
  );
}

function EmailStep(p: StepRendererProps) {
  const theme = useTheme();
  const [handle, setHandle] = useState(() => defaultEmailHandle(p.career));
  const email = workspaceEmail(handle, p.companyType);
  const valid = handle.trim().length > 1;

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Company email"
      title="Set up your email"
      subtitle="Choose your username. This is where work lands."
      primary={{ label: 'Create email', onPress: p.onComplete }}
      primaryDisabled={!valid}
    >
      <View style={{ gap: theme.spacing[4] }}>
        <Input
          label="Username"
          value={handle}
          onChangeText={setHandle}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="your.name"
        />
        <Card variant="solid" style={{ gap: theme.spacing[1] }}>
          <Text variant="label" color="caption">
            Your address
          </Text>
          <Text variant="mono" color={valid ? 'brand' : 'caption'}>
            {email}
          </Text>
        </Card>
      </View>
    </JoiningScene>
  );
}

function ToolsStep(p: StepRendererProps) {
  const theme = useTheme();
  const tools = [
    { key: 'chat', label: 'Team chat', description: 'Where the team talks all day.' },
    { key: 'calendar', label: 'Calendar', description: 'Meetings and your schedule.' },
    { key: 'docs', label: 'Docs & knowledge base', description: 'Guides, specs, and how-tos.' },
  ];
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const allConnected = tools.every((t) => connected[t.key]);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Communication tools"
      title="Get connected"
      subtitle="Connect the tools the team uses to work together."
      primary={{ label: 'Continue', onPress: p.onComplete }}
      primaryDisabled={!allConnected}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {tools.map((t) => (
          <CheckRow
            key={t.key}
            label={connected[t.key] ? `${t.label} — connected` : `Connect ${t.label}`}
            description={t.description}
            checked={Boolean(connected[t.key])}
            onToggle={() => setConnected((prev) => ({ ...prev, [t.key]: !prev[t.key] }))}
          />
        ))}
      </View>
    </JoiningScene>
  );
}

function WorkstationStep(p: StepRendererProps) {
  const theme = useTheme();
  const items = [
    { key: 'laptop', label: 'Laptop ready', description: 'Your machine is set up for the role.' },
    { key: 'accounts', label: 'Accounts created', description: 'Logins for the tools you’ll use.' },
    { key: 'access', label: 'Access granted', description: 'Permissions for your team’s work.' },
  ];
  const [done, setDone] = useState<Record<string, boolean>>({});
  const allDone = items.every((i) => done[i.key]);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Workstation setup"
      title="Set up your desk"
      subtitle="Get everything ready before day one."
      primary={{ label: 'I’m set up', onPress: p.onComplete }}
      primaryDisabled={!allDone}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {items.map((i) => (
          <CheckRow
            key={i.key}
            label={i.label}
            description={i.description}
            checked={Boolean(done[i.key])}
            onToggle={() => setDone((prev) => ({ ...prev, [i.key]: !prev[i.key] }))}
          />
        ))}
      </View>
    </JoiningScene>
  );
}

function PoliciesStep(p: StepRendererProps) {
  const theme = useTheme();
  const policies = [
    { title: 'Code of conduct', line: 'How we treat each other and our users.' },
    { title: 'Security & data', line: 'Keeping company and user data safe.' },
    { title: 'Time off & leave', line: 'How to take time off when you need it.' },
  ];
  const [ack, setAck] = useState(false);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="Company policies"
      title="How things work here"
      subtitle="Have a read, then acknowledge to continue."
      primary={{ label: 'Continue', onPress: p.onComplete }}
      primaryDisabled={!ack}
    >
      <View style={{ gap: theme.spacing[3] }}>
        {policies.map((pol) => (
          <Card key={pol.title} variant="solid" style={{ gap: theme.spacing[1] }}>
            <Text variant="bodyMd">{pol.title}</Text>
            <Text variant="sm" color="secondary">
              {pol.line}
            </Text>
          </Card>
        ))}
        <CheckRow
          label="I’ve read and acknowledge the policies"
          checked={ack}
          onToggle={() => setAck((v) => !v)}
        />
      </View>
    </JoiningScene>
  );
}

function ChecklistStep(p: StepRendererProps) {
  const theme = useTheme();
  // Data-driven recap: reflect the steps actually completed so far in this run.
  const doneIds = new Set(p.state.completedJoiningStepIds);
  const completed = p.career.joining.filter((s) => doneIds.has(s.id) && s.id !== p.step.id);
  const [ready, setReady] = useState(false);

  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow="First day checklist"
      title="Ready for day one"
      subtitle="Everything below is done. One last confirmation."
      primary={{ label: 'Finish onboarding', onPress: p.onComplete }}
      primaryDisabled={!ready}
    >
      <View style={{ gap: theme.spacing[3] }}>
        <Card variant="solid" style={{ gap: theme.spacing[2] }}>
          {completed.map((s) => (
            <View
              key={s.id}
              style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing[2] }}
            >
              <Text variant="sm" color="success">
                ✓
              </Text>
              <Text variant="sm" color="secondary" style={{ flex: 1 }}>
                {s.title}
              </Text>
            </View>
          ))}
        </Card>
        <CheckRow label="I’m ready for day one" checked={ready} onToggle={() => setReady((v) => !v)} />
      </View>
    </JoiningScene>
  );
}

function InfoStep(p: StepRendererProps) {
  return (
    <JoiningScene
      current={p.current}
      total={p.total}
      eyebrow={titleCase(p.step.type.replace(/_/g, ' '))}
      title={p.step.title}
      subtitle={p.step.summary}
      primary={{ label: 'Continue', onPress: p.onComplete }}
    />
  );
}

// ---------------------------------------------------------------------------
// Registry — step type → renderer. Unknown/future types fall back to InfoStep.
// ---------------------------------------------------------------------------

const RENDERERS: Partial<Record<JoiningStepType, React.ComponentType<StepRendererProps>>> = {
  offer_letter: OfferLetterStep,
  verification: ConfirmationStep,
  hr_welcome: HrWelcomeStep,
  company_intro: CompanyIntroStep,
  office_tour: OfficeTourStep,
  department_intro: DepartmentStep,
  manager_intro: ManagerStep,
  team_intro: TeamStep,
  employee_id: EmployeeIdStep,
  email_setup: EmailStep,
  communication_tools: ToolsStep,
  workstation_setup: WorkstationStep,
  policies: PoliciesStep,
  checklist: ChecklistStep,
};

export function getStepRenderer(
  type: JoiningStepType,
): React.ComponentType<StepRendererProps> {
  return RENDERERS[type] ?? InfoStep;
}
