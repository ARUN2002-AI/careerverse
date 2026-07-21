import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen, Text, Input, Button, Card } from '../../components';
import { useTheme } from '../../theme/ThemeProvider';
import { loginSchema, type LoginValues } from '../../utils/validation';
import type { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const theme = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitError(null);
    try {
      // TODO: replace with the real auth service once Volume 11 (API docs) exists.
      await new Promise((r) => setTimeout(r, 900));
      navigation.getParent()?.navigate('Main');
    } catch {
      setSubmitError('We could not sign you in. Check your details and try again.');
    }
  };

  return (
    <Screen scroll gradient>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ marginTop: theme.spacing[10] }}>
          <Text variant="label" color="tertiary">
            Employee access
          </Text>
          <Text variant="display" style={{ marginTop: theme.spacing[2] }}>
            Clock in
          </Text>
          <Text variant="body" color="secondary" style={{ marginTop: theme.spacing[2] }}>
            Sign in to pick up where your simulation left off.
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
                placeholder="Your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                password
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />

          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={8}
            accessibilityRole="button"
            style={{ alignSelf: 'flex-end' }}
          >
            <Text variant="sm" color="brand">
              Forgot password?
            </Text>
          </Pressable>
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
          label="Sign in"
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
            New to CareerVerse?
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            hitSlop={8}
            accessibilityRole="button"
          >
            <Text variant="sm" color="brand">
              Create an account
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
