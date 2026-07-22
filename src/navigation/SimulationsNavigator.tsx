import React from 'react';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

import { MissionBoardScreen } from '../screens/missions/MissionBoardScreen';
import { MissionDetailScreen } from '../screens/missions/MissionDetailScreen';
import { MissionRunScreen } from '../screens/missions/MissionRunScreen';
import { WorkdayScreen } from '../screens/workday/WorkdayScreen';
import type { SimulationsStackParamList } from './types';

const Stack = createNativeStackNavigator<SimulationsStackParamList>();

/**
 * Adapter that mounts the Phase 7 WorkdayScreen UNCHANGED inside this stack. WorkdayScreen is
 * annotated for the tab; its navigate() calls (Home, Careers, Joining) bubble up through this
 * stack to the correct navigator at runtime, so no Phase 7 code needs to change.
 */
function WorkdayRoute(props: NativeStackScreenProps<SimulationsStackParamList, 'Workday'>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AnyWorkday = WorkdayScreen as unknown as React.ComponentType<any>;
  return <AnyWorkday {...props} />;
}

/**
 * The Simulations tab hosts the Mission Engine (board → detail → run) plus the daily Workday.
 * Header-less to match the app's full-bleed screens; each screen owns its own back.
 */
export function SimulationsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="MissionBoard" component={MissionBoardScreen} />
      <Stack.Screen name="MissionDetail" component={MissionDetailScreen} />
      <Stack.Screen name="MissionRun" component={MissionRunScreen} />
      <Stack.Screen name="Workday" component={WorkdayRoute} />
    </Stack.Navigator>
  );
}
