import React from 'react';
import { ScrollView, View, type ViewStyle, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/ThemeProvider';

export interface ScreenProps {
  children: React.ReactNode;
  /** Wraps content in a ScrollView. Off for screens that manage their own list. */
  scroll?: boolean;
  /**
   * Paints the Primary Gradient as a header wash behind content. Reserved for hero
   * and dashboard-header screens (Bible Part 21).
   */
  gradient?: boolean;
  /** Removes horizontal padding for edge-to-edge layouts. */
  bleed?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

/**
 * Every screen root. Owns safe area, horizontal padding, the tablet content cap,
 * and the background treatment so no screen re-implements them.
 */
export function Screen({
  children,
  scroll = false,
  gradient = false,
  bleed = false,
  style,
  contentContainerStyle,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingHorizontal: bleed ? 0 : theme.screenX,
    // Tablets cap the column and centre it rather than stretching line lengths.
    ...(theme.isTablet
      ? { maxWidth: theme.layout.maxContentWidth, width: '100%', alignSelf: 'center' }
      : null),
  };

  const body = scroll ? (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[
        padding,
        { paddingTop: theme.spacing[4], paddingBottom: insets.bottom + theme.spacing[8] },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1 }, padding, contentContainerStyle]}>{children}</View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: theme.colors.bg, paddingTop: insets.top }, style]}>
      {/* Dark-only app, so the status bar is always light-on-dark. */}
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {gradient && (
        <LinearGradient
          colors={[...theme.gradients.primary.colors]}
          start={theme.gradients.primary.start}
          end={theme.gradients.primary.end}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 320 }}
          pointerEvents="none"
        />
      )}
      {body}
    </View>
  );
}
