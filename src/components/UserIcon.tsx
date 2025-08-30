"use client"; 
import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
import UserAccountNav from "./UserAvatarNav";
import { useRouter } from "next/router";
import { createAuthClient } from "better-auth/react"



export default async function UserIcon(){ 
    const { useSession } = createAuthClient();
    const {data: session} = useSession();
    const router = useRouter();

    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // })

    if(!session?.user) return router.push("/");

    return <UserAccountNav user={session?.user} />

}