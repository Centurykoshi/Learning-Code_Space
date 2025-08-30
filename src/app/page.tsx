import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // If user is authenticated, redirect them to dashboard


    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to getOkay</h1>
                <p className="text-muted-foreground mb-4">Your mental wellness journey starts here</p>
                <div className="space-x-4">
                    <a href="/sign-up" className="bg-blue-500 text-white px-4 py-2 rounded">Sign Up</a>
                    <a href="/sign-in" className="border border-blue-500 text-blue-500 px-4 py-2 rounded">Sign In</a>
                </div>
            </div>
        </div>
    );
}