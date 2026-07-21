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

export type MainTabParamList = {
  Home: undefined;
  Careers: undefined;
  Simulations: undefined;
  Inbox: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
