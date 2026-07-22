import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from '../ui/Text';

export interface ProgressTimelineStep {
  id: string;
  title: string;
  caption?: string;
}

export interface ProgressTimelineProps {
  steps: ProgressTimelineStep[];
  /** 0-based index of the active step. Everything before it is "done". */
  currentIndex: number;
  style?: ViewStyle;
}

/**
 * Vertical timeline / stepper. Reused for the day's schedule, mission stages, and any ordered
 * flow. Marks steps done / current / upcoming with a connected rail.
 */
export function ProgressTimeline({ steps, currentIndex, style }: ProgressTimelineProps) {
  const theme = useTheme();

  return (
    <View style={[{ gap: 0 }, style]}>
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const last = i === steps.length - 1;
        const dotColor = done || active ? theme.colors.brand : theme.colors.divider;

        return (
          <View key={step.id} style={{ flexDirection: 'row', gap: theme.spacing[3] }}>
            {/* Rail */}
            <View style={{ alignItems: 'center', width: 20 }}>
              <View
                style={{
                  width: active ? 14 : 12,
                  height: active ? 14 : 12,
                  borderRadius: theme.radius.full,
                  backgroundColor: done ? theme.colors.brand : 'transparent',
                  borderWidth: 2,
                  borderColor: dotColor,
                }}
              />
              {!last && (
                <View
                  style={{
                    flex: 1,
                    width: 2,
                    minHeight: theme.spacing[4],
                    backgroundColor: done ? theme.colors.brand : theme.colors.divider,
                  }}
                />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1, paddingBottom: last ? 0 : theme.spacing[4], gap: 2 }}>
              <Text variant="bodyMd" color={active ? 'primary' : done ? 'secondary' : 'caption'}>
                {step.title}
              </Text>
              {step.caption && (
                <Text variant="xs" color="caption">
                  {step.caption}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
