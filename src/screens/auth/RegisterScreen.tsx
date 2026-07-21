import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Input, Button, Card } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { registerSchema, type RegisterValues } from '../../utils/validation';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const theme = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitError(null);
    try {
      // TODO: replace with the real auth service once Volume 11 (API docs) exists.
      await new Promise((r) => setTimeout(r, 900));
      navigation.navigate('Otp', { email: values.email, purpose: 'register' });
    } catch {
      setSubmitError('We could not create your account. Check your details and try again.');
    }
  };

  return (
    <Screen scroll gradient>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginTop: theme.spacing[10] }}>
          <Text variant="label" color="tertiary">
            New hire
          </Text>
          <Text variant="display" style={{ marginTop: theme.spacing[2] }}>
            Join the roster
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[2] }}>
            Set up your file and start your first simulation.
          </Text>
        </View>

        <View style={{ gap: theme.spacing[4], marginTop: theme.spacing[8] }}>
          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full name"
                placeholder="Your name as it should appear"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
              />
            )}
          />

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
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="At least 8 characters"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                hint="Use 8 characters with an uppercase letter and a number."
                password
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm password"
                placeholder="Re-enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                password
                autoComplete="new-password"
                textContentType="newPassword"
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
          label="Create account"
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
            Already on the payroll?
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go to sign in"
          >
            <Text variant="sm" color="brand">
              Sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
