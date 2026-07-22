import React, { useEffect, useRef, useState } from 'react';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen, EmptyState } from '../../components';
import {
  useSimulation,
  getAvailableMissions,
  getMission,
} from '../../simulation';
import { deriveEmployeeId } from '../../utils/identity';
import { formatClock, formatDate } from '../../utils/time';
import { buildFeedback, type WorkdayFeedback } from '../../utils/feedback';
import {
  WORKDAY_STAGES,
  STAGE_SEGMENT,
  STAGE_RENDERERS,
  type WorkdayCtx,
} from './stages';
import type { MainTabParamList, RootStackParamList } from '../../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Simulations'>;

/**
 * Phase 7 — the Daily Work Simulation. Replaces the Simulations placeholder. Drives the user
 * through an ordered workday of stages, consuming ONLY the engine's public actions
 * (startMission, completeMission, completeDailySegment, advanceDay). No engine change.
 */
export function WorkdayScreen({ navigation }: Props) {
  const { state, career, companyType } = useSimulation();
  const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  if (!state || !career || !companyType) {
    return (
      <Screen>
        <EmptyState
          title="No active simulation"
          message="Pick a career and join a company to start your workday."
          actionLabel="Browse careers"
          onAction={() => navigation.navigate('Careers', { screen: 'Catalogue' })}
        />
      </Screen>
    );
  }

  if (state.phase === 'joining') {
    return (
      <Screen>
        <EmptyState
          title="Finish onboarding first"
          message="Complete joining the company, then your workday begins."
          actionLabel="Continue onboarding"
          onAction={() => rootNav?.navigate('Joining')}
        />
      </Screen>
    );
  }

  return <WorkdaySession onHome={() => navigation.navigate('Home')} />;
}

/**
 * The live workday. Split out so all hooks run with a guaranteed-active run. Holds the
 * per-day local UI state (stage, selected mission, checklist, feedback) while the engine owns
 * the durable state (XP, level, performance, day, completed segments/missions).
 */
function WorkdaySession({ onHome }: { onHome: () => void }) {
  const { state, career, companyType, startMission, completeMission, completeDailySegment, advanceDay } =
    useSimulation();

  const [stageIndex, setStageIndex] = useState(0);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [workChecked, setWorkChecked] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<WorkdayFeedback | null>(null);
  const firedRef = useRef(false);
  const sessionStartRef = useRef(Date.now());
  const clockRef = useRef(new Date());

  const stage = WORKDAY_STAGES[stageIndex];

  // Fire the AI review exactly once when the user reaches the feedback stage.
  useEffect(() => {
    if (!state || !career || !companyType) return;
    if (stage !== 'ai_feedback' || firedRef.current || !missionId) return;
    const mission = getMission(career, missionId);
    if (!mission) return;
    const ratio = mission.steps.length ? workChecked.length / mission.steps.length : 1;
    const fb = buildFeedback(mission, career, companyType, ratio);
    firedRef.current = true;
    completeMission(missionId, fb.score);
    setFeedback(fb);
  }, [stage, missionId, workChecked, state, career, companyType, completeMission]);

  if (!state || !career || !companyType) return null;

  const availableMissions = getAvailableMissions(career, state);
  const mission = missionId ? getMission(career, missionId) : undefined;

  const advanceSegment = () => {
    const segType = STAGE_SEGMENT[stage];
    if (!segType) return;
    const seg = career.dailyWork.find((s) => s.type === segType);
    if (seg && !state.completedDailySegmentIds.includes(seg.id)) completeDailySegment(seg.id);
  };

  const ctx: WorkdayCtx = {
    career,
    companyType,
    state,
    current: stageIndex + 1,
    total: WORKDAY_STAGES.length,
    dateLabel: formatDate(clockRef.current),
    checkInLabel: formatClock(clockRef.current),
    sessionStartMs: sessionStartRef.current,
    missionId,
    mission,
    availableMissions,
    workChecked,
    feedback,
    employeeId: deriveEmployeeId(state, career, companyType),
    assignMission: (id) => {
      setMissionId(id);
      startMission(id);
    },
    toggleWorkItem: (id) =>
      setWorkChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    next: () => {
      advanceSegment();
      setStageIndex((i) => Math.min(i + 1, WORKDAY_STAGES.length - 1));
    },
    endDayEarly: () => setStageIndex(WORKDAY_STAGES.indexOf('end_of_day')),
    startNextDay: () => {
      advanceSegment();
      advanceDay();
      firedRef.current = false;
      sessionStartRef.current = Date.now();
      setStageIndex(0);
      setMissionId(null);
      setWorkChecked([]);
      setFeedback(null);
    },
    goHome: onHome,
  };

  const Renderer = STAGE_RENDERERS[stage];

  return (
    <Screen gradient>
      <Renderer key={stageIndex} ctx={ctx} />
    </Screen>
  );
}
