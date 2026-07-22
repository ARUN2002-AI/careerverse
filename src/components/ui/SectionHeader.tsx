import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface SectionHeaderProps {
  title: string;
  /** Optional supporting line under the title. */
  caption?: string;
  /** Rendered on the right, e.g. a count or an action. */
  trailing?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * The standard heading for a content section. Used to keep every "Required skills",
 * "Roadmap", "Salary" block visually identical across the app.
 */
export function SectionHeader({ title, caption, trailing, style }: SectionHeaderProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: theme.spacing[3],
          marginBottom: theme.spacing[3],
        },
        style,
      ]}
    >
      <View style={{ flex: 1, gap: theme.spacing[1] }}>
        <Text variant="h3" accessibilityRole="header">
          {title}
        </Text>
        {caption && (
          <Text variant="sm" color="secondary">
            {caption}
          </Text>
        )}
      </View>
      {trailing}
    </View>
  );
}
