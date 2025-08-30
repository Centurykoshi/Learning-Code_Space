import Sidebar from "@/components/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SidebarPage() {

    const session = await auth.api.getSession({
        headers: await headers(), 
    });

    // Check if session exists
    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    return <Sidebar  />

}