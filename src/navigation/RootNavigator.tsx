import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../theme/ThemeProvider';
import { Text } from '../components';
import { SplashScreen } from '../screens/SplashScreen';
import { JoiningScreen } from '../screens/joining/JoiningScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OtpScreen } from '../screens/auth/OtpScreen';
import { ProfileScreen } from '../screens/PlaceholderScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { CareersNavigator } from './CareersNavigator';
import { SimulationsNavigator } from './SimulationsNavigator';
import { InboxNavigator } from './InboxNavigator';
import type { AuthStackParamList, MainTabParamList, RootStackParamList } from './types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <AuthStack.Screen name="Onboarding" component={OnboardingScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="Otp" component={OtpScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Tab glyphs are text marks rather than an icon font, so the app has no icon dependency
 * until the illustration system (Bible Part 9) is specified.
 */
const TAB_GLYPH: Record<keyof MainTabParamList, string> = {
  Home: '▣',
  Careers: '◈',
  Simulations: '▶',
  Inbox: '✉',
  Profile: '◉',
};

function MainTabs() {
  const theme = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
        tabBarInactiveTintColor: theme.colors.textCaption,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.divider,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64,
          paddingTop: theme.spacing[2],
        },
        tabBarLabelStyle: {
          ...theme.typography.xs,
          // React Navigation sets its own colour; keep only metrics here.
          marginBottom: theme.spacing[2],
        },
        tabBarIcon: ({ color }) => (
          <View style={{ minWidth: theme.layout.minTouchTarget, alignItems: 'center' }}>
            <Text variant="body" style={{ color }}>
              {TAB_GLYPH[route.name]}
            </Text>
          </View>
        ),
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Careers" component={CareersNavigator} />
      <Tabs.Screen name="Simulations" component={SimulationsNavigator} />
      <Tabs.Screen name="Inbox" component={InboxNavigator} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const theme = useTheme();

  // Feeds the design tokens into React Navigation so screen transitions and the
  // container background match the app rather than flashing a default white.
  const navTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.colors.brand,
      background: theme.colors.bg,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.divider,
      notification: theme.colors.danger,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Joining" component={JoiningScreen} />
        <RootStack.Screen name="Main" component={MainTabs} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
