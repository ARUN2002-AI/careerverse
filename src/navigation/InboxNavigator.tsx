import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { WorkplaceScreen } from '../screens/inbox/WorkplaceScreen';
import { ChatScreen } from '../screens/inbox/ChatScreen';
import { MeetingScreen } from '../screens/inbox/MeetingScreen';
import type { InboxStackParamList } from './types';

const Stack = createNativeStackNavigator<InboxStackParamList>();

/**
 * The Inbox tab flow (Phase 8 — AI Workplace): the workplace hub, a chat thread, and a meeting
 * detail. Header-less to match the app's full-bleed screens; each screen owns its own back.
 */
export function InboxNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Workplace" component={WorkplaceScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Meeting" component={MeetingScreen} />
    </Stack.Navigator>
  );
}
