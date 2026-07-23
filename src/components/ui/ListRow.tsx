import React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface ListRowProps {
  title: string;
  /** Optional supporting line under the title. */
  caption?: string;
  /** A short glyph rendered in a lit leading slot. */
  glyph?: string;
  /** Right-side content — a string is rendered as caption text; a node is rendered as-is. */
  trailing?: React.ReactNode;
  /** When set, the row is a button and shows a chevron unless `trailing` overrides it. */
  onPress?: () => void;
  /** Tints the glyph slot — 'brand' (default) for navigation, 'danger' for destructive rows. */
  tone?: 'brand' | 'accent' | 'danger';
  /** Hides the default chevron on pressable rows (e.g. when `trailing` is a value). */
  hideChevron?: boolean;
  style?: ViewStyle;
}

/**
 * A standard list row: a lit glyph slot, a title + caption, and trailing content or a chevron.
 * The single reusable building block for the Profile hub menu, settings, and any "list of
 * destinations" surface — so every such list looks and behaves identically. Meets the 44pt
 * touch target and carries button semantics when pressable.
 */
export function ListRow({
  title,
  caption,
  glyph,
  trailing,
  onPress,
  tone = 'brand',
  hideChevron = false,
  style,
}: ListRowProps) {
  const theme = useTheme();

  const toneColor =
    tone === 'danger' ? theme.colors.danger : tone === 'accent' ? theme.colors.accent : theme.colors.brand;

  const body = (
    <>
      {glyph && (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: theme.radius.md,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.divider,
          }}
        >
          <Text variant="h3" style={{ color: toneColor }}>
            {glyph}
          </Text>
        </View>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="bodyMd" color={tone === 'danger' ? 'danger' : 'primary'}>
          {title}
        </Text>
        {caption && (
          <Text variant="xs" color="caption">
            {caption}
          </Text>
        )}
      </View>
      {typeof trailing === 'string' ? (
        <Text variant="sm" color="secondary">
          {trailing}
        </Text>
      ) : (
        trailing
      )}
      {onPress && !trailing && !hideChevron && (
        <Text variant="h3" color="caption">
          ›
        </Text>
      )}
    </>
  );

  const layout: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
    minHeight: theme.layout.minTouchTarget,
    paddingVertical: theme.spacing[2],
  };

  if (!onPress) {
    return <View style={[layout, style]}>{body}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={caption ? `${title}. ${caption}` : title}
      style={({ pressed }) => [layout, { opacity: pressed ? theme.opacity.pressed : 1 }, style]}
    >
      {body}
    </Pressable>
  );
}
