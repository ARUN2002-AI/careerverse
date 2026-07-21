import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Input, Button, Card } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../../utils/validation';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const theme = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setSubmitError(null);
    try {
      // TODO: replace with the real auth service once Volume 11 (API docs) exists.
      await new Promise((r) => setTimeout(r, 900));
      navigation.navigate('Otp', { email: values.email, purpose: 'reset' });
    } catch {
      setSubmitError('We could not send the code. Check the address and try again.');
    }
  };

  return (
    <Screen scroll gradient>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginTop: theme.spacing[10] }}>
          <Text variant="label" color="tertiary">
            Access recovery
          </Text>
          <Text variant="display" style={{ marginTop: theme.spacing[2] }}>
            Reset your key
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[2] }}>
            Give us the email on your file. We send a six-digit code to it, and you use that
            code to set a new password.
          </Text>
        </View>

        <View style={{ gap: theme.spacing[4], marginTop: theme.spacing[8] }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="you@example.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="go"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />
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
          label="Send code"
          fullWidth
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
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
            Remembered it?
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
