import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCallerFactory, createTRPCContext } from "@/trpc/init";
import { formvalidator } from "@/modules/form/server/age_gender";

export const metadata = {
    title: "Dashboard || getOkay"
}

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    // Check if user needs to complete profile using tRPC
    try {
        const createCaller = createCallerFactory(formvalidator);
        const ctx = await createTRPCContext();
        const trpc = createCaller(ctx);

        const profileStatus = await trpc.get_profile_status();

        console.log("Dashboard - User profile check:", {
            userId: session.user.id,
            profileCompleted: profileStatus.profileCompleted,
            hasAge: profileStatus.hasAge,
            hasGender: profileStatus.hasGender,
            needsCompletion: profileStatus.needsCompletion
        });

        // If profile is not completed, redirect to form
        if (profileStatus.needsCompletion) {
            console.log("✅ Redirecting to form - profile not completed");
            redirect("/form");
        }

        console.log("✅ Profile completed - showing dashboard");
    } catch (error) {
        // Note: NEXT_REDIRECT is not a real error, it's Next.js internal redirect mechanism
        if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
            // This is expected behavior for redirects, don't log as error
            throw error;
        }
        console.error("❌ Unexpected error checking profile:", error);
        // If there's a real error, still allow access to dashboard
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">Welcome to getOkay Dashboard</h1>
                    <p className="text-gray-600">
                        Welcome, {session.user.name}! Your profile is complete.
                    </p>
                    <div className="mt-8 p-6 bg-white rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-4">Dashboard Content</h2>
                        <p className="text-gray-600">
                            This is your main dashboard. Add your app content here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}