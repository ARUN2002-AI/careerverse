import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface ScreenHeaderProps {
  title: string;
  /** Small uppercase label above the title, e.g. a context line ("Profile · Day 3"). */
  eyebrow?: string;
  /** Supporting line under the title. */
  caption?: string;
  /** Back-button label. When set with `onBack`, renders a "‹ label" tap target. */
  backLabel?: string;
  onBack?: () => void;
  /** Right-aligned content on the title row (a count, an action). */
  trailing?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * The standard page header for the app's header-less (full-bleed) screens: an optional back
 * affordance, an eyebrow, the page title, and a caption. Reused across the Profile growth
 * surfaces so every sub-page shares one back idiom and one title treatment.
 */
export function ScreenHeader({
  title,
  eyebrow,
  caption,
  backLabel,
  onBack,
  trailing,
  style,
}: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View style={[{ gap: theme.spacing[1], paddingTop: theme.spacing[4] }, style]}>
      {onBack && (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={backLabel ?? 'Go back'}
          style={{ alignSelf: 'flex-start', minHeight: theme.layout.minTouchTarget, justifyContent: 'center' }}
        >
          <Text variant="sm" color="secondary">
            ‹ {backLabel ?? 'Back'}
          </Text>
        </Pressable>
      )}
      {eyebrow && (
        <Text variant="label" color="caption">
          {eyebrow}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: theme.spacing[3],
        }}
      >
        <Text variant="h1" accessibilityRole="header" style={{ flex: 1 }}>
          {title}
        </Text>
        {trailing}
      </View>
      {caption && (
        <Text variant="sm" color="secondary" style={{ marginTop: theme.spacing[1] }}>
          {caption}
        </Text>
      )}
    </View>
  );
}
