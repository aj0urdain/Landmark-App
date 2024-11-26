'use client';

import { useState, useEffect } from 'react';
import { signInWithAzureAction, signInWithPasswordAction } from '@/app/actions';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { FormMessage, Message } from '@/components/atoms/FormMessage/FormMessage';
import { createBrowserClient } from '@/utils/supabase/client';
import { Dot } from '@/components/atoms/Dot/Dot';
import { LogoWordmark } from '@/components/atoms/LogoWordmark/LogoWordmark';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type ActionResult = { error: string } | { success: string };

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const isAllowedDomain = (email: string) => {
    const domain = email.split('@')[1];
    return domain && allowedDomains.includes(domain);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = (await signInWithPasswordAction(formData)) as ActionResult;

      if ('error' in result) {
        setMessage({ error: result.error });
      } else if ('success' in result) {
        setMessage({ success: result.success });
        setIsLoginSuccessful(true);
        router.push('/');
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

        setAllowedDomains(allowedDomainsArray as string[]);
      } else {
        console.error('Error fetching allowed domains:', error);
      }
    };

    void fetchAllowedDomains();
  }, []);

  const handleAzureSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithAzureAction();
      if ('url' in result) {
        window.location.href = result.url;
      } else if ('error' in result) {
        setMessage({ error: result.error });
      }
    } catch (error) {
      console.error('Error during Azure sign-in:', error);
      setMessage({ error: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="relative hidden w-1/2 bg-muted lg:block">
        <Image
          src="/images/burgess-rawson-login-bg.jpg"
          alt="Burgess Rawson Login Background"
          width={2048}
          height={1365}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="w-full">
          <div className="absolute inset-0 flex w-full flex-col items-center justify-center">
            <div className="w-full max-w-xl">
              <LogoWordmark />
            </div>

            <Separator className="my-8 w-full max-w-lg bg-foreground" />

            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Dot size="small" className="bg-white" />
                <Dot size="large" className="bg-white" />
                <div className="font-lexia text-4xl font-extrabold uppercase tracking-wider text-white">
                  Landmark
                </div>
                <Dot size="large" className="bg-white" />
                <Dot size="small" className="bg-white" />
              </div>
              <div>
                <Badge
                  className="animate-pulse bg-blue-500 px-4 text-sm uppercase text-white"
                  variant="outline"
                >
                  Beta
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="mx-auto w-full max-w-[380px] px-4">
          <div className="grid gap-10">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to log in to Landmark.
              </p>
            </div>
            <Button onClick={handleAzureSignIn} disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign in with Azure'
              )}
            </Button>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-muted-foreground underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {isLoading || isLoginSuccessful ? (
                <Button disabled className="w-full">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  {isLoginSuccessful ? 'Logging in...' : 'Please wait'}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!email || !password || !isAllowedDomain(email)}
                >
                  Login
                </Button>
              )}
              <FormMessage message={message} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
