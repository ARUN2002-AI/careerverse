import React from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { JoiningProgress } from './JoiningProgress';

export interface JoiningSceneAction {
  label: string;
  onPress: () => void;
}

export interface JoiningSceneProps {
  current: number;
  total: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** The interactive/immersive body of the step (artifact, chat, checklist, form). */
  children?: React.ReactNode;
  primary: JoiningSceneAction;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  secondary?: JoiningSceneAction;
}

/**
 * The shared frame for every onboarding step: progress at the top, an animated content area
 * that scrolls, and a pinned primary action. Steps only supply their eyebrow/title/body and
 * wiring — so all fifteen feel like one continuous, premium experience.
 *
 * Content re-animates on each step because the container remounts the scene per index.
 */
export function JoiningScene({
  current,
  total,
  eyebrow,
  title,
  subtitle,
  children,
  primary,
  primaryDisabled,
  primaryLoading,
  secondary,
}: JoiningSceneProps) {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, gap: theme.spacing[4] }}>
      <JoiningProgress current={current} total={total} style={{ marginTop: theme.spacing[2] }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: theme.spacing[4], gap: theme.spacing[5] }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={theme.reduceMotion ? undefined : FadeInDown.duration(theme.motion.base)}
          style={{ gap: theme.spacing[2] }}
        >
          <Text variant="label" color="caption">
            {eyebrow}
          </Text>
          <Text variant="h1">{title}</Text>
          {subtitle && (
            <Text variant="body" color="secondary">
              {subtitle}
            </Text>
          )}
        </Animated.View>

        {children && (
          <Animated.View
            entering={theme.reduceMotion ? undefined : FadeInDown.duration(theme.motion.slow)}
          >
            {children}
          </Animated.View>
        )}
      </ScrollView>

      <View style={{ gap: theme.spacing[3], paddingTop: theme.spacing[2] }}>
        <Button
          label={primary.label}
          fullWidth
          onPress={primary.onPress}
          disabled={primaryDisabled}
          loading={primaryLoading}
        />
        {secondary && (
          <Button label={secondary.label} variant="ghost" fullWidth onPress={secondary.onPress} />
        )}
      </View>
    </View>
  );
}
