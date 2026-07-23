import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SkillsScreen } from '../screens/profile/SkillsScreen';
import { ProgressionScreen } from '../screens/profile/ProgressionScreen';
import { AnalyticsScreen } from '../screens/profile/AnalyticsScreen';
import { PortfolioScreen } from '../screens/profile/PortfolioScreen';
import { ResumeScreen } from '../screens/profile/ResumeScreen';
import { CertificateScreen } from '../screens/profile/CertificateScreen';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * The Profile tab flow: the profile hub plus the growth surfaces it links to. Header-less to
 * match the app's full-bleed screens; each screen owns its own back via ScreenHeader.
 */
export function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="Skills" component={SkillsScreen} />
      <Stack.Screen name="Progression" component={ProgressionScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="Resume" component={ResumeScreen} />
      <Stack.Screen name="Certificate" component={CertificateScreen} />
    </Stack.Navigator>
  );
}
