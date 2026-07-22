import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Button, Card } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

/**
 * Masks the local part of an address so the screen can confirm *where* the code went
 * without printing the whole address on a shoulder-surfable screen.
 * `alex@example.com` -> `a***@example.com`
 */
function maskEmail(email: string): string {
  const at = email.indexOf('@');
  if (at < 1) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at);
  return `${local[0]}***${domain}`;
}

export function OtpScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const { email, purpose } = route.params;

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const code = digits.join('');
  const complete = code.length === CODE_LENGTH;

  const handleChange = (index: number, raw: string) => {
    // Strip anything that is not a digit so a paste or an autofill cannot poison the box.
    const value = raw.replace(/[^0-9]/g, '').slice(-1);
    setSubmitError(null);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setDigits((prev) => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
    }
  };

  const handleResend = async () => {
    setSubmitError(null);
    setDigits(Array(CODE_LENGTH).fill(''));
    setSecondsLeft(RESEND_SECONDS);
    inputs.current[0]?.focus();
    // TODO: replace with the real auth service once Volume 11 (API docs) exists.
    await new Promise((r) => setTimeout(r, 900));
  };

  const handleVerify = async () => {
    setSubmitError(null);
    setVerifying(true);
    try {
      // TODO: replace with the real auth service once Volume 11 (API docs) exists.
      await new Promise((r) => setTimeout(r, 900));
      if (purpose === 'register') {
        navigation.getParent()?.navigate('Main');
      } else {
        navigation.navigate('Login');
      }
    } catch {
      setSubmitError('That code did not match. Request a new one and try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Screen scroll gradient>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginTop: theme.spacing[10] }}>
          <Text variant="label" color="caption">
            Security check
          </Text>
          <Text variant="display" style={{ marginTop: theme.spacing[2] }}>
            Confirm it is you
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[2] }}>
            Enter the six-digit code we sent to
          </Text>
          <Text variant="mono" color="primary" style={{ marginTop: theme.spacing[1] }}>
            {maskEmail(email)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing[2],
            marginTop: theme.spacing[8],
          }}
        >
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(node) => {
                inputs.current[index] = node;
              }}
              value={digit}
              onChangeText={(raw) => handleChange(index, raw)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              maxLength={1}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              returnKeyType="done"
              selectionColor={theme.colors.brand}
              maxFontSizeMultiplier={1.6}
              accessibilityLabel={`Digit ${index + 1} of ${CODE_LENGTH}`}
              style={[
                theme.typography.h2,
                {
                  flex: 1,
                  textAlign: 'center',
                  color: theme.colors.textPrimary,
                  minHeight: theme.layout.minTouchTarget + theme.spacing[3],
                  paddingVertical: theme.spacing[2],
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.card,
                  borderWidth: digit ? 1.5 : StyleSheet.hairlineWidth,
                  borderColor: digit ? theme.colors.brand : theme.colors.divider,
                },
              ]}
            />
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing[2],
            marginTop: theme.spacing[6],
          }}
        >
          <Text variant="sm" color="secondary">
            No code yet?
          </Text>
          {secondsLeft > 0 ? (
            <Text variant="mono" color="caption" accessibilityLiveRegion="polite">
              {`Resend in ${secondsLeft}s`}
            </Text>
          ) : (
            <Pressable
              onPress={handleResend}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Send a new code"
            >
              <Text variant="sm" color="brand">
                Send a new code
              </Text>
            </Pressable>
          )}
        </View>

        {submitError && (
          <Card
            variant="outline"
            style={{ marginTop: theme.spacing[4], borderColor: theme.colors.danger }}
          >
            <Text variant="sm" color="danger" accessibilityLiveRegion="polite">
              {submitError}
            </Text>
          </Card>
        )}

        <Button
          label="Verify"
          fullWidth
          disabled={!complete}
          loading={verifying}
          onPress={handleVerify}
          style={{ marginTop: theme.spacing[8] }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            gap: theme.spacing[1],
            marginTop: theme.spacing[6],
          }}
        >
          <Text variant="sm" color="secondary">
            Wrong address?
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back to sign in"
          >
            <Text variant="sm" color="brand">
              Back to sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
