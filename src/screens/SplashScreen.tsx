import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text } from '../components';
import { useTheme } from '../theme/ThemeProvider';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const HOLD_MS = 1100;

/**
 * Boot screen. Its only job is to cover the session check, so it holds briefly and then
 * routes. It renders the badge motif so the first frame of the app is the product's
 * signature object rather than a logo on a colour.
 */
export function SplashScreen({ navigation }: Props) {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: swap for a real session lookup once the auth service exists.
      const hasSession = false;
      navigation.replace(hasSession ? 'Main' : 'Auth', { screen: 'Onboarding' } as never);
    }, HOLD_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen gradient>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Animated.View entering={theme.reduceMotion ? undefined : FadeIn.duration(theme.motion.slow)}>
          <View
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: theme.spacing[3],
              paddingVertical: theme.spacing[1],
              borderRadius: theme.radius.sm,
              borderWidth: 1,
              borderColor: theme.colors.brand,
            }}
          >
            <Text variant="mono" color="brand">
              CV
            </Text>
          </View>

          <Text variant="display" style={{ marginTop: theme.spacing[5] }}>
            CareerVerse
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[2] }}>
            Work the job before you take the job.
          </Text>
        </Animated.View>
      </View>

      <Text
        variant="xs"
        color="tertiary"
        align="center"
        style={{ paddingBottom: theme.spacing[6] }}
      >
        Preparing your workspace
      </Text>
    </Screen>
  );
}
