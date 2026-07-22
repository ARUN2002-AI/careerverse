import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Navigation contract for the whole app (Bible Part 7).
 * Screens read their params from here — never from `any`.
 */

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Otp: { email: string; purpose: 'register' | 'reset' };
};

/** The Careers tab is a nested stack: catalogue → career detail → company selection. */
export type CareersStackParamList = {
  Catalogue: undefined;
  CareerDetail: { careerId: string };
  CompanySelect: { careerId: string };
};

/** The Inbox tab is a nested stack: workplace hub → chat thread → meeting detail. */
export type InboxStackParamList = {
  Workplace: undefined;
  Chat: { threadId: string };
  Meeting: { meetingId: string };
};

/** The Simulations tab hosts the Mission Engine (board → detail → run) and the daily Workday. */
export type SimulationsStackParamList = {
  MissionBoard: undefined;
  MissionDetail: { missionId: string };
  MissionRun: { missionId: string };
  Workday: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Careers: NavigatorScreenParams<CareersStackParamList>;
  Simulations: NavigatorScreenParams<SimulationsStackParamList>;
  Inbox: NavigatorScreenParams<InboxStackParamList>;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  /** Phase 3 onboarding — a full-screen flow presented over the app after company selection. */
  Joining: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
