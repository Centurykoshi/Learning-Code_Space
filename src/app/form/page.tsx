import Extraform from "@/components/Extraform";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Form || getOkay"
}

export default async function playground() {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-up?message=Please sign in to complete your profile&redirect=form");
    }

    return <Extraform />

}