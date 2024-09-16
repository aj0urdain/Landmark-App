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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { createClient } from '@/utils/supabase/client';
import {
  FormMessage,
  Message,
} from '@/components/atoms/FormMessage/FormMessage';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';
import { Separator } from '@/components/ui/separator';
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
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    otp?: string
  ) => Promise<void>;
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
      className='flex-1 flex flex-col gap-8 min-w-64'
      onSubmit={(e) => onSubmit(e, otpValue)}
    >
      <h1 className='text-2xl font-medium'>Sign in</h1>
      <div className='flex flex-col gap-2 items-start w-full'>
        <div className='w-full'>
          <Label htmlFor='email'>Email</Label>

          <Input
            name='email'
            placeholder='you@example.com'
            required
            className='w-full'
            disabled={isOtpSent || isLoading}
            defaultValue={email}
            onChange={(e) => setCurrentEmail(e.target.value)}
          />

          <input type='hidden' name='email' value={currentEmail} />

          {isOtpSent && (
            <Button
              variant='link'
              size='icon'
              className='text-xs text-muted-foreground underline ml-2 -mt-2'
              onClick={onReset}
            >
              Not you?
            </Button>
          )}
        </div>

        <div className='w-full'>
          {isOtpSent && (
            <>
              <Label htmlFor='token'>Sign In Code</Label>
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                name='token'
                disabled={attemptsLeft === 0}
                className='w-full'
              >
                <InputOTPGroup className='w-full'>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`${
                        otpError &&
                        otpValue.length === 0 &&
                        'border-destructive'
                      } w-full`}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </>
          )}
        </div>

        <div className='w-full'>
          {isLoading || isLoginSuccessful ? (
            <Button disabled className='w-full'>
              <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
              {isLoginSuccessful ? 'Logging in...' : 'Please wait'}
            </Button>
          ) : (
            <Button
              type='submit'
              className={`w-full ${
                isOtpSent && (otpValue.length < 6 || attemptsLeft === 0)
                  ? 'bg-muted cursor-not-allowed text-muted-foreground'
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

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    otp?: string
  ) => {
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
      const supabase = createClient();
      const { data, error } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'ALLOWED_DOMAINS')
        .single();

      if (data && !error) {
        const allowedDomainsArray = data.value;
        console.log('Allowed domains:', allowedDomainsArray);
        setAllowedDomains(allowedDomainsArray);
      } else {
        console.error('Error fetching allowed domains:', error);
      }
    };

    fetchAllowedDomains();
  }, []);

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='relative flex w-1/2 h-full'>
        <div className='absolute top-0 left-0 w-full h-full z-10 bg-gradient-to-t from-slate-800 to-transparent' />
        <Image
          src='/images/burgess-rawson-login-bg.jpg'
          alt='logo'
          width={2048}
          height={1365}
          className='object-cover w-full h-full grayscale opacity-40'
        />
        <div className='absolute gap-8 top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-center'>
          <LogoWordmark className='w-2/3 h-auto' />
          <Separator orientation='vertical' className='h-0.5 w-1/2 bg-white' />
          <div className='flex gap-6 items-center justify-center'>
            <Dot size='small' />
            <Dot size='large' />
            <p className='text-4xl font-bold font-lexia tracking-widest uppercase'>
              Landmark
            </p>
            <Dot size='large' />
            <Dot size='small' />
          </div>
        </div>
      </div>
      <div className='flex w-1/2 h-full items-center justify-center'>
        <Card className='max-w-sm w-full max-h-96 p-6'>
          <div className='flex flex-col gap-2 w-full'>
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
              <p className='text-xs text-warning dark:text-warning-foreground'>
                Attempts left: {attemptsLeft}
              </p>
            )}
            <Dialog open={isDisabled}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Too Many Attempts</DialogTitle>
                  <DialogDescription>
                    You have made too many false attempts. You can try again in{' '}
                    {cooldownMinutes} minutes.
                  </DialogDescription>
                </DialogHeader>
                <div className='flex justify-center mt-6'>
                  <Button onClick={handleRefresh}>I understand</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      </div>
    </div>
  );
}
