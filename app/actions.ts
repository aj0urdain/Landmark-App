'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { getConfig } from '@/utils/supabase/config';
import { createServerClient } from '@/utils/supabase/server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

type Attempt = { timestamp: string; success: boolean };

export const signInWithPasswordAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createServerClient();

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    return { error: 'Invalid email or password' };
  }

  if (data.user) {
    return { success: 'Logged in successfully' };
  } else {
    return { error: 'Login failed' };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const supabase = await createServerClient();

  const origin = headers().get('origin');

  console.log('email', email);
  console.log('origin', origin);

  if (!email) {
    return { error: 'Email is required' };
  }

  // Get user data from user_profiles
  const { data: userData, error: userError } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (userError) {
    console.error(userError);
    return { error: 'An error occurred. Please try again.' };
  }

  if (userData) {
    // Fetch OTP settings
    const otpSettings = await getConfig<{
      cooldown_minutes: number;
      max_attempts: number;
    }>('OTP_SETTINGS');
    if (!otpSettings) {
      console.error('Failed to fetch OTP settings');
      return { error: 'An error occurred. Please try again.' };
    }

    const { cooldown_minutes, max_attempts } = otpSettings;

    // Check existing attempts
    const { data: attemptData, error: attemptError } = await supabaseAdmin
      .from('otp_attempts')
      .select('attempts')
      .eq('user_id', userData.id)
      .single();

    if (attemptError && attemptError.code !== 'PGRST116') {
      console.error(attemptError);
      return { error: 'An error occurred. Please try again.' };
    }

    const attempts = attemptData?.attempts || [];
    const cooldownTime = new Date(Date.now() - cooldown_minutes * 60 * 1000);

    const recentAttempts = attempts.filter(
      (attempt: Attempt) => new Date(attempt.timestamp) > cooldownTime,
    );

    if (recentAttempts.length >= max_attempts) {
      const oldestRecentAttempt = new Date(recentAttempts[0].timestamp);
      const timeLeft =
        cooldown_minutes -
        Math.floor((Date.now() - oldestRecentAttempt.getTime()) / 60000);

      return {
        error: `Too many recent attempts. Please try again in ${timeLeft} minute${timeLeft !== 1 ? 's' : ''}.`,
        refresh: true,
      };
    }
  }

  // Proceed with OTP sign-in
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  });

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  return { success: 'Check your email for the login link or OTP.' };
};

export const verifyOtpAction = async (formData: FormData) => {
  const email = formData.get('email') as string;
  const token = formData.get('token') as string;

  const supabase = await createServerClient();

  if (!email || !token) {
    return { error: 'Email and OTP are required' };
  }

  // Fetch OTP settings
  const otpSettings = await getConfig<{
    cooldown_minutes: number;
    max_attempts: number;
  }>('OTP_SETTINGS');
  if (!otpSettings) {
    console.error('Failed to fetch OTP settings');
    return { error: 'An error occurred. Please try again.' };
  }

  const { cooldown_minutes, max_attempts } = otpSettings;

  // Get user data from user_profiles
  const { data: userData, error: userError } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    console.error(userError);
    return { error: 'User not found' };
  }

  // Get attempt data
  const { data: attemptData, error: attemptError } = await supabaseAdmin
    .from('otp_attempts')
    .select('attempts')
    .eq('user_id', userData.id)
    .single();

  if (attemptError && attemptError.code !== 'PGRST116') {
    console.error(attemptError);
    return { error: 'An error occurred. Please try again.' };
  }

  const attempts = attemptData?.attempts || [];
  const cooldownTime = new Date(Date.now() - cooldown_minutes * 60 * 1000);

  // Filter recent attempts and count consecutive failures
  const recentAttempts = attempts.filter(
    (attempt: Attempt) => new Date(attempt.timestamp) > cooldownTime,
  );

  let consecutiveFailures = 0;
  for (let i = recentAttempts.length - 1; i >= 0; i--) {
    if (!recentAttempts[i].success) {
      consecutiveFailures++;
    } else {
      break;
    }
  }

  if (consecutiveFailures >= max_attempts) {
    const oldestRecentFailure = recentAttempts.findLast(
      (attempt: Attempt) => !attempt.success,
    );
    const timeLeft =
      cooldown_minutes -
      Math.floor(
        (Date.now() - new Date(oldestRecentFailure.timestamp).getTime()) / 60000,
      );
    return {
      error: `Too many failed attempts. Please try again in ${timeLeft} minute${timeLeft !== 1 ? 's' : ''}.`,
      attemptsLeft: 0,
    };
  }

  // Verify OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  const newAttempt = {
    timestamp: new Date().toISOString(),
    success: !error,
  };

  // Update attempts in the database
  await supabaseAdmin.from('otp_attempts').upsert({
    user_id: userData.id,
    attempts: [...attempts, newAttempt],
  });

  if (error) {
    console.error(error.message);
    return {
      error: `Invalid Code. Please try again.`,
      attemptsLeft: max_attempts - (consecutiveFailures + 1),
    };
  }

  if (!data.user) {
    return {
      error: 'Verification failed',
      attemptsLeft: max_attempts - (consecutiveFailures + 1),
    };
  }

  if (data.session) {
    return { success: true, message: 'OTP verified successfully' };
  } else {
    return { success: false, error: 'Invalid OTP' };
  }
};

export const signInWithAzureAction = async () => {
  const supabase = await createServerClient();
  const origin = headers().get('origin');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      scopes: 'email openid profile',
    },
  });

  if (error) {
    console.error(error);
    return { error: error.message };
  }

  // The user will be redirected to Azure's login page
  return { url: data.url };
};

export const signOutAction = async () => {
  const supabase = await createServerClient();
  await supabase.auth.signOut();

  return redirect('/sign-in');
};
