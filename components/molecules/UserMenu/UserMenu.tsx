import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/app/actions";
import { getQueryClient } from "@/utils/get-query-client";
import { userProfileOptions } from "@/types/userProfileTypes";
import { useQuery } from "@tanstack/react-query";

export function UserMenu() {
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
        <Button variant="outline" className="flex gap-2">
          <h1>
            {userProfile?.first_name} {userProfile?.last_name}
          </h1>
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-full">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
