import React, { useEffect, useRef, useState } from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';
import { formatDuration } from '../../utils/time';

export interface WorkTimerProps {
  /** Ticks while true. Defaults to true. */
  running?: boolean;
  label?: string;
  style?: ViewStyle;
}

/**
 * A live focus-session timer. Counts elapsed seconds while mounted/running. Reusable for any
 * timed activity (work sessions, meetings, timed challenges).
 */
export function WorkTimer({ running = true, label = 'Focus time', style }: WorkTimerProps) {
  const theme = useTheme();
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  return (
    <View
      accessibilityLabel={`${label}: ${formatDuration(seconds)}`}
      style={[
        {
          alignItems: 'center',
          gap: theme.spacing[2],
          paddingVertical: theme.spacing[6],
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.colors.divider,
        },
        style,
      ]}
    >
      <Text variant="label" color="caption">
        {label}
      </Text>
      <Text variant="display" color="brand" mono>
        {formatDuration(seconds)}
      </Text>
    </View>
  );
}
