import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CareerCatalogueScreen } from '../screens/careers/CareerCatalogueScreen';
import { CareerDetailScreen } from '../screens/careers/CareerDetailScreen';
import { CompanySelectScreen } from '../screens/careers/CompanySelectScreen';
import type { CareersStackParamList } from './types';

const Stack = createNativeStackNavigator<CareersStackParamList>();

/**
 * The Careers tab flow (Phases 1–2): browse the catalogue, open a career, then choose the
 * company environment. Header-less to match the app's full-bleed screens; each screen owns
 * its own back affordance.
 */
export function CareersNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Catalogue" component={CareerCatalogueScreen} />
      <Stack.Screen name="CareerDetail" component={CareerDetailScreen} />
      <Stack.Screen name="CompanySelect" component={CompanySelectScreen} />
    </Stack.Navigator>
  );
}
