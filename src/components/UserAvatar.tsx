import { type User } from "better-auth";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { type AvatarProps } from "@radix-ui/react-avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from '@tanstack/react-query';

interface Props extends AvatarProps {
    user: Pick<User, "name" | "image">;

}

const UserAvatar = ({ user, ...props }: Props) => {
    const trpc = useTRPC();

    const { data: profileData } = useQuery(trpc.age_gender.get_profile_status.queryOptions());
    const gender = profileData?.gender;

    // Function to get the appropriate avatar source
    const getAvatarSrc = () => {
        // Priority 1: Google/OAuth image (if user has one)
        if (user.image) {
            return user.image;
        }

        // Priority 2: Gender-based image (for email signups)
        if (gender === "male") {
            return "/boy.png";
        }

        if (gender === "female") {
            return "/woman.png";
        }

        // Priority 3: No image available
        return null;
    };

    const avatarSrc = getAvatarSrc();

    return (
        <Avatar {...props}>
            {avatarSrc ? (
                <div className="relative w-10 h-10">
                    <Image
                        src={avatarSrc}
                        alt={user.image ? "Profile picture" : `${gender} avatar`}
                        referrerPolicy="no-referrer"
                        fill
                        sizes="60px"

                        className="object-cover rounded-full cursor-pointer"
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{user?.name}</span>
                    {/* Show first letter of name as fallback */}
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
            )}
        </Avatar>
    )
};

export default UserAvatar;
