"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndRedirect = async () => {
            try {
                // Get current session
                const session = await authClient.getSession();

                if (!session) {
                    // No session, redirect to sign in
                    router.push("/sign-in");
                    return;
                }

                // User is authenticated, check if they need to complete profile
                const response = await fetch("/api/auth/session");
                const userData = await response.json();

                if (userData?.user) {
                    // For now, all new users go to form, returning users to dashboard
                    // This is a simple approach - you could make it more sophisticated
                    router.push("/dashboard");
                } else {
                    router.push("/sign-in");
                }
            } catch (error) {
                console.error("Auth redirect error:", error);
                toast.error("Authentication error. Please try signing in again.");
                router.push("/sign-in");
            }
        };

        checkAuthAndRedirect();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}
