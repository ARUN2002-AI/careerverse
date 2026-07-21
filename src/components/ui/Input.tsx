import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme/ThemeProvider';
import { Text } from './Text';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  /** Shown under the field in danger colour. Presence also drives the error border. */
  error?: string;
  /** Shown under the field when there is no error. */
  hint?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Renders a show/hide toggle and manages secureTextEntry internally. */
  password?: boolean;
  containerStyle?: ViewStyle;
}

/**
 * The only text field in the app. Focus, error, and disabled states are handled here
 * so no screen re-implements them.
 *
 * Error text is announced to screen readers via `accessibilityLiveRegion`, and the
 * field itself carries `accessibilityInvalid` so the error is not colour-only.
 */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    hint,
    leading,
    trailing,
    password = false,
    containerStyle,
    editable = true,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hasError = Boolean(error);
  const borderColor = hasError
    ? theme.colors.danger
    : focused
      ? theme.colors.brand
      : theme.colors.border;

  return (
    <View style={containerStyle}>
      {label && (
        <Text variant="label" color="tertiary" style={{ marginBottom: theme.spacing[2] }}>
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing[2],
          minHeight: theme.layout.minTouchTarget + 4,
          paddingHorizontal: theme.spacing[4],
          borderRadius: theme.radius.md,
          backgroundColor: theme.colors.surface2,
          borderWidth: focused || hasError ? 1.5 : StyleSheet.hairlineWidth,
          borderColor,
          opacity: editable ? 1 : theme.opacity.disabled,
        }}
      >
        {leading}

        <TextInput
          {...rest}
          ref={ref}
          editable={editable}
          secureTextEntry={password && !revealed}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={theme.colors.textTertiary}
          selectionColor={theme.colors.brand}
          maxFontSizeMultiplier={1.6}
          accessibilityLabel={rest.accessibilityLabel ?? label}
          aria-invalid={hasError}
          style={[
            theme.typography.body,
            { flex: 1, color: theme.colors.textPrimary, paddingVertical: theme.spacing[3] },
          ]}
        />

        {password ? (
          <Pressable
            onPress={() => setRevealed((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={revealed ? 'Hide password' : 'Show password'}
          >
            <Text variant="xs" color="brand">
              {revealed ? 'HIDE' : 'SHOW'}
            </Text>
          </Pressable>
        ) : (
          trailing
        )}
      </View>

      {(error || hint) && (
        <Text
          variant="xs"
          color={hasError ? 'danger' : 'tertiary'}
          style={{ marginTop: theme.spacing[2] }}
          accessibilityLiveRegion={hasError ? 'polite' : 'none'}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
});
