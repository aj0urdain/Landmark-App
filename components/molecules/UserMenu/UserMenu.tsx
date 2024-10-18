import { Settings, LogOut, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions";
import { getQueryClient } from "@/utils/get-query-client";
import { userProfileOptions } from "@/types/userProfileTypes";
import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/atoms/Logo/Logo";

export function UserMenu() {
  const router = useRouter();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userProfileOptions);

  const handleSignOut = async () => {
    const queryClient = getQueryClient();
    queryClient.clear();
    await signOutAction();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !userProfile) {
    return <div>Error loading user profile</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-4">
          <Logo className="h-3 w-auto" />

          <div className="flex items-center justify-start gap-1">
            <p className="font-bold sm:font-light">
              {userProfile?.first_name}{" "}
            </p>
            <p className="hidden font-bold sm:block">
              {userProfile?.last_name}
            </p>
          </div>
          <Image
            src={userProfile?.profile_picture || ""}
            alt="User Profile Picture"
            width={40}
            height={40}
            className="h-full w-auto"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{
          width: "var(--radix-dropdown-menu-trigger-width)",
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ThemeToggle />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          <span className="font-bold text-destructive">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
