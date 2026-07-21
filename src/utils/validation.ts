import { z } from 'zod';

/**
 * Auth validation. Messages are written for the person reading them: they say what to do,
 * not what the validator objected to.
 */

export const emailField = z
  .string()
  .min(1, 'Enter your email address')
  .email('That email address looks incomplete');

export const passwordField = z
  .string()
  .min(8, 'Use at least 8 characters')
  .regex(/[a-z]/, 'Include a lowercase letter')
  .regex(/[A-Z]/, 'Include an uppercase letter')
  .regex(/[0-9]/, 'Include a number');

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password'),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Enter your full name'),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, 'Re-enter your password'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Both passwords must match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({ email: emailField });

export const otpSchema = z.object({
  code: z.string().length(6, 'Enter all six digits'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
