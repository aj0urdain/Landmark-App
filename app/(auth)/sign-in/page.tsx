'use client';

import { useState, useEffect, useRef } from 'react';
import { signInAction, verifyOtpAction } from '@/app/actions';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { createBrowserClient } from '@/utils/supabase/client';
import { FormMessage, Message } from '@/components/atoms/FormMessage/FormMessage';

import { Card } from '@/components/ui/card';
import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';

import { LandmarkLogoWordmark } from '@/components/atoms/LandmarkLogoWordmark/LandmarkLogoWordmark';
import { Dot } from '@/components/atoms/Dot/Dot';

type ActionResult =
  | { error: string; attemptsLeft?: number; cooldownMinutes?: number }
  | { success: string };

const SignInForm = ({
  allowedDomains,
  isOtpSent,
  onSubmit,
  attemptsLeft,
  isLoading,
  otpError,
  onReset,
  email,
  isLoginSuccessful,
}: {
  allowedDomains: string[];
  isOtpSent: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, otp?: string) => Promise<void>;
  attemptsLeft: number | null;
  isLoading: boolean;
  otpError: boolean;
  onReset: () => void;
  email: string;
  isLoginSuccessful: boolean;
}) => {
  const [otpValue, setOtpValue] = useState('');
  const [currentEmail, setCurrentEmail] = useState(email);
  const formRef = useRef<HTMLFormElement>(null);
  const isFirstAttemptRef = useRef(true);

  useEffect(() => {
    if (
      isOtpSent &&
      otpValue.length === 6 &&
      isFirstAttemptRef.current &&
      formRef.current
    ) {
      formRef.current.requestSubmit();
      isFirstAttemptRef.current = false;
    }
  }, [otpValue, isOtpSent]);

  useEffect(() => {
    if (otpError) {
      setOtpValue('');
    }
  }, [otpError]);

  const isAllowedDomain = (email: string) => {
    const domain = email.split('@')[1];
    return domain && allowedDomains.includes(domain);
  };

  return (
    <form
      ref={formRef}
      className="flex min-w-64 flex-1 flex-col gap-8"
      onSubmit={(e) => onSubmit(e, otpValue)}
    >
      <h1 className="text-2xl font-medium">Sign in</h1>
      <div className="flex w-full flex-col items-start gap-2">
        <div className="w-full">
          <Label htmlFor="email">Email</Label>

          <Input
            name="email"
            placeholder="you@example.com"
            required
            className="w-full"
            disabled={isOtpSent || isLoading}
            defaultValue={email}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />

          <input type="hidden" name="email" value={currentEmail} />

          {isOtpSent && (
            <Button
              variant="link"
              size="icon"
              className="-mt-2 ml-2 text-xs text-muted-foreground underline"
              onClick={onReset}
            >
              Not you?
            </Button>
          )}
        </div>

        <div className="w-full">
          {isOtpSent && (
            <>
              <Label htmlFor="token">Sign In Code</Label>
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                name="token"
                disabled={attemptsLeft === 0}
                className="w-full"
              >
                <InputOTPGroup className="w-full">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`${
                        otpError && otpValue.length === 0 && 'border-destructive'
                      } w-full`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </>
          )}
        </div>

        <div className="w-full">
          {isLoading || isLoginSuccessful ? (
            <Button disabled className="w-full">
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              {isLoginSuccessful ? 'Logging in...' : 'Please wait'}
            </Button>
          ) : (
            <Button
              type="submit"
              className={`w-full ${
                isOtpSent && (otpValue.length < 6 || attemptsLeft === 0)
                  ? 'cursor-not-allowed bg-muted text-muted-foreground'
                  : ''
              }`}
              disabled={
                (isOtpSent && (otpValue.length < 6 || attemptsLeft === 0)) ||
                (!isOtpSent && !isAllowedDomain(currentEmail)) ||
                (!isOtpSent && attemptsLeft === 0)
              }
            >
              {isOtpSent ? 'Verify Code' : 'Send Code'}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default function SignIn() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState<Message>({});
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [cooldownMinutes, setCooldownMinutes] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [email, setEmail] = useState('');
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, otp?: string) => {
    event.preventDefault();
    setIsLoading(true);
    setOtpError(false);
    const formData = new FormData(event.currentTarget);
    if (otp) formData.set('token', otp);
    if (!isOtpSent) {
      setEmail(formData.get('email') as string);
    }
    try {
      const result = (await (isOtpSent
        ? verifyOtpAction(formData)
        : signInAction(formData))) as ActionResult;

      if ('error' in result) {
        setMessage({ error: result.error });
        if (result.attemptsLeft !== undefined) {
          setAttemptsLeft(result.attemptsLeft);
        }
        if (result.cooldownMinutes !== undefined) {
          setCooldownMinutes(result.cooldownMinutes);
        }
        if (isOtpSent) {
          setOtpError(true);
        }
      } else if ('success' in result) {
        setMessage({ success: result.success });
        if (isOtpSent) {
          setIsLoginSuccessful(true);
          // Delay redirect to allow UI to update

          router.push('/');
        } else {
          setIsOtpSent(true);
          setAttemptsLeft(null); // Reset attempts left when OTP is sent
        }
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setMessage({ error: 'An unexpected error occurred' });
    } finally {
      if (!isLoginSuccessful) {
        setIsLoading(false);
      }
    }
  };

  const isDisabled = isOtpSent && attemptsLeft === 0;

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReset = () => {
    setIsOtpSent(false);
    setMessage({});
    setAttemptsLeft(null);
    setOtpError(false);
  };

  useEffect(() => {
    const fetchAllowedDomains = async () => {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'ALLOWED_DOMAINS')
        .single();

      if (data && !error) {
        const allowedDomainsArray = data.value;
        console.log('Allowed domains:', allowedDomainsArray);
        setAllowedDomains(allowedDomainsArray as string[]);
      } else {
        console.error('Error fetching allowed domains:', error);
      }
    };

    fetchAllowedDomains();
  }, []);

  return (
    <div className="flex min-h-screen w-full max-w-screen-sm flex-col items-center mx-auto justify-center gap-8 p-4">
      <div className="flex flex-col items-center justify-center gap-4">
        <LogoWordmark />
      </div>

      <Card className="w-full max-w-sm p-6">
        <div className="flex w-full flex-col gap-2">
          <SignInForm
            isOtpSent={isOtpSent}
            onSubmit={handleSubmit}
            attemptsLeft={attemptsLeft}
            isLoading={isLoading}
            otpError={otpError}
            onReset={handleReset}
            email={email}
            allowedDomains={allowedDomains}
            isLoginSuccessful={isLoginSuccessful}
          />
          <FormMessage message={message} />
          {isOtpSent && attemptsLeft !== null && attemptsLeft > 0 && (
            <p className="text-xs text-warning dark:text-warning-foreground">
              Attempts left: {attemptsLeft}
            </p>
          )}
        </div>
      </Card>

      <div className="flex items-center uppercase gap-2 text-xs text-muted-foreground">
        <p>Powered by</p>
        <Dot size="small" className="bg-green-500 animate-pulse mr-1" />
        <LandmarkLogoWordmark className="w-32" />
      </div>

      <Dialog open={isDisabled}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Too Many Attempts</DialogTitle>
            <DialogDescription>
              You have made too many false attempts. You can try again in{' '}
              {cooldownMinutes} minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button onClick={handleRefresh}>I understand</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
