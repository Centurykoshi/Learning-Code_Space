"use client";
import type { User } from "better-auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";


import { LogOut } from "lucide-react";


import UserAvatar from "./UserAvatar";
import { authClient } from "@/lib/auth-client";

interface UserAccountNavProps {
    user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav = ({ user }: UserAccountNavProps) => {
    const signOut = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.href = "/"; // Redirect to home page after sign out
                    }
                }
            })
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    }

    return (
        <DropdownMenu >
            <DropdownMenuTrigger>
                <UserAvatar user={user} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="mb-2 cursor-pointer" align="center" side="right" sideOffset={25} alignOffset={20}>
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium"
                        >{user.name}</p>}
                        {user.email && (<p className="text-sm "
                        >{user.email}</p>)}
                    </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/">getOkay</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={(event) => {
                    event.preventDefault();
                    signOut();

                }}
                    className="text-secondary-foreground"
                >
                    Sign Out
                    <LogOut className="ml-2 h-4 w-4" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UserAccountNav; 
