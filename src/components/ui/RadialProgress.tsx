import React from 'react';
import { View, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface RadialProgressProps {
  /** 0–1. Clamped internally. */
  value: number;
  size?: number;
  strokeWidth?: number;
  /** Big centred value, e.g. "82" or "Lv 4". Defaults to the rounded percentage. */
  centerLabel?: string;
  /** Small centred caption under the value. */
  centerCaption?: string;
  /**
   * Arc colour intent. 'brand' = the user's own progress (default); 'accent' = a system/AI
   * metric (performance, AI score); 'success' = a completed/earned state.
   */
  tone?: 'brand' | 'accent' | 'success';
  /** Accessible description; falls back to "<percent>% complete". */
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/**
 * A circular progress ring. The reusable radial gauge for the app — level progress on Profile,
 * the performance score on Analytics, and completion on the Certificate. Purely presentational
 * and token-driven; the ring track is the divider hue and the arc follows `tone`.
 *
 * Light comes from the top (DESIGN_SYSTEM §3), so the arc starts at 12 o'clock and sweeps
 * clockwise. Respects reduced motion trivially by not animating (static render).
 */
export function RadialProgress({
  value,
  size = 108,
  strokeWidth = 9,
  centerLabel,
  centerCaption,
  tone = 'brand',
  accessibilityLabel,
  style,
}: RadialProgressProps) {
  const theme = useTheme();
  const ratio = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  const pct = Math.round(ratio * 100);

  const arcColor =
    tone === 'accent' ? theme.colors.accent : tone === 'success' ? theme.colors.success : theme.colors.brand;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ratio);
  const center = size / 2;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `${pct}% complete`}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.colors.divider}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          // Start at 12 o'clock and sweep clockwise.
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text variant="h2">{centerLabel ?? `${pct}%`}</Text>
        {centerCaption && (
          <Text variant="label" color="caption">
            {centerCaption}
          </Text>
        )}
      </View>
    </View>
  );
}
