import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /** Rendered before the label. Keep to 16–20pt icons. */
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  style?: ViewStyle;
}

const HEIGHTS: Record<ButtonSize, number> = { sm: 40, md: 48, lg: 56 };

/**
 * Primary is the brass gradient and is the only element on a screen allowed to carry
 * `elevation.brass`. There is one primary action per screen (Bible Part 10).
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leading,
  trailing,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const isInert = disabled || loading;

  const handlePressIn = useCallback<NonNullable<PressableProps['onPressIn']>>(
    (e) => {
      // Reduced motion: no transform, the opacity change alone signals the press.
      if (!theme.reduceMotion) {
        scale.value = withTiming(theme.motion.pressScale, { duration: theme.motion.fast });
      }
      onPressIn?.(e);
    },
    [scale, theme.motion, theme.reduceMotion, onPressIn],
  );

  const handlePressOut = useCallback<NonNullable<PressableProps['onPressOut']>>(
    (e) => {
      if (!theme.reduceMotion) {
        scale.value = withTiming(1, { duration: theme.motion.fast });
      }
      onPressOut?.(e);
    },
    [scale, theme.motion, theme.reduceMotion, onPressOut],
  );

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const height = HEIGHTS[size];
  const paddingHorizontal = size === 'sm' ? theme.spacing[4] : theme.spacing[6];
  const textVariant = size === 'sm' ? 'sm' : 'bodyMd';

  const container: ViewStyle = {
    height,
    paddingHorizontal,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: isInert ? theme.opacity.disabled : 1,
  };

  const labelColor =
    variant === 'primary' ? 'onBrand' : variant === 'danger' ? 'danger' : 'primary';

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.onBrand : theme.colors.brand}
        />
      ) : (
        <>
          {leading}
          <Text variant={textVariant} color={labelColor}>
            {label}
          </Text>
          {trailing}
        </>
      )}
    </>
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={isInert}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={rest.accessibilityLabel ?? label}
      accessibilityState={{ disabled: isInert, busy: loading }}
      // Guarantees the 44pt target even for the 40pt `sm` button.
      hitSlop={size === 'sm' ? 4 : 0}
      style={[animatedStyle, fullWidth && styles.stretch, style]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[...theme.gradients.brass.colors]}
          start={theme.gradients.brass.start}
          end={theme.gradients.brass.end}
          style={[container, !isInert && theme.elevation.brass]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            container,
            variant === 'secondary' && {
              backgroundColor: theme.colors.surface2,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: theme.colors.border,
            },
            variant === 'danger' && {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: theme.colors.danger,
            },
          ]}
        >
          {content}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
});
