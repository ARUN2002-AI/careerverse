import React, { useEffect } from 'react';
import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { Button } from './Button';
import { Text } from './Text';

interface BaseStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

/**
 * Shared frame for empty / error / success. Every screen in CareerVerse must handle all
 * of these (Bible Part 6), so they share one layout and differ only in tone and copy.
 */
function StateFrame({
  glyph,
  glyphColor,
  title,
  message,
  actionLabel,
  onAction,
  style,
}: BaseStateProps & { glyph: string; glyphColor: string }) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing[12],
          gap: theme.spacing[3],
        },
        style,
      ]}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: theme.radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.card,
        }}
      >
        <Text variant="h2" style={{ color: glyphColor }}>
          {glyph}
        </Text>
      </View>

      <Text variant="h3" align="center">
        {title}
      </Text>

      {message && (
        <Text variant="sm" color="secondary" align="center" style={{ maxWidth: 300 }}>
          {message}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          variant="secondary"
          size="sm"
          onPress={onAction}
          style={{ marginTop: theme.spacing[2] }}
        />
      )}
    </View>
  );
}

/** An empty screen is an invitation to act — always give it an action. */
export function EmptyState(props: BaseStateProps) {
  const theme = useTheme();
  return <StateFrame {...props} glyph="○" glyphColor={theme.colors.textCaption} />;
}

/** Errors say what happened and how to fix it. They never apologise. */
export function ErrorState({
  title = 'Something went wrong',
  actionLabel = 'Try again',
  ...rest
}: Partial<BaseStateProps>) {
  const theme = useTheme();
  return (
    <StateFrame
      {...rest}
      title={title}
      actionLabel={rest.onAction ? actionLabel : undefined}
      glyph="!"
      glyphColor={theme.colors.danger}
    />
  );
}

export function SuccessState(props: BaseStateProps) {
  const theme = useTheme();
  return <StateFrame {...props} glyph="✓" glyphColor={theme.colors.success} />;
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing[3] }}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <ActivityIndicator color={theme.colors.brand} />
      <Text variant="sm" color="caption">
        {label}
      </Text>
    </View>
  );
}

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

/** Pulsing placeholder. Collapses to a static block under reduced motion. */
export function Skeleton({ width = '100%', height = 16, radius, style }: SkeletonProps) {
  const theme = useTheme();
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    if (theme.reduceMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [pulse, theme.reduceMotion]);

  const animated = useAnimatedStyle(() => ({
    opacity: theme.reduceMotion ? 0.6 : pulse.value,
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.radius.sm,
          backgroundColor: theme.colors.card,
        },
        animated,
        style,
      ]}
    />
  );
}
