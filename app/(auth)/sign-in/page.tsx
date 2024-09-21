"use client";

import { useState, useEffect } from "react";
import { signInWithPasswordAction } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  FormMessage,
  Message,
} from "@/components/atoms/FormMessage/FormMessage";
import { createBrowserClient } from "@/utils/supabase/client";

type ActionResult = { error: string } | { success: string };

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<Message>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const isAllowedDomain = (email: string) => {
    const domain = email.split("@")[1];
    return domain && allowedDomains.includes(domain);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = (await signInWithPasswordAction(formData)) as ActionResult;

      if ("error" in result) {
        setMessage({ error: result.error });
      } else if ("success" in result) {
        setMessage({ success: result.success });
        setIsLoginSuccessful(true);
        router.push("/");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      setMessage({ error: "An unexpected error occurred" });
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
        .from("app_config")
        .select("value")
        .eq("key", "ALLOWED_DOMAINS")
        .single();

      if (data && !error) {
        const allowedDomainsArray = data.value;
        console.log("Allowed domains:", allowedDomainsArray);
        setAllowedDomains(allowedDomainsArray);
      } else {
        console.error("Error fetching allowed domains:", error);
      }
    };

    fetchAllowedDomains();
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="hidden w-1/2 bg-muted lg:block">
        <Image
          src="/images/burgess-rawson-login-bg.jpg"
          alt="Burgess Rawson Login Background"
          width={2048}
          height={1365}
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
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
                    type={showPassword ? "text" : "password"}
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
                  {isLoginSuccessful ? "Logging in..." : "Please wait"}
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
