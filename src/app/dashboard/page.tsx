import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCallerFactory, createTRPCContext } from "@/trpc/init";
import { formvalidator } from "@/modules/form/server/age_gender";
import Link from "next/link";
import { BotIcon, Hourglass, Keyboard } from "lucide-react";

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

    // Main JSX return - moved outside of try/catch
    return (
        <div className="min-h-screen bg-transparent flex flex-col items-center justify-center">
            {/* Header */}


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-primary mb-2 flex justify-center items-center">
                        Welcome back, {session.user.name?.split(' ')[0]}! 
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Ready to continue your mental wellness journey? Choose any of the following activities to feel little better
                    </p>
                </div>



                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* AI Chatbot */}
                    <Link href="/Chatbot" className="group">
                        <div className="bg-transparent rounded-2xl p-8 shadow-sm  hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-1">
                            <div className="w-16 h-16 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl"><BotIcon className="w-8 h-8" /></span>
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">AI Therapy Chat</h3>
                            <p className="text-muted-foreground mb-4">
                                Chat with our AI therapist for instant support, guidance, and emotional wellness conversations.
                            </p>
                            <div className="flex items-center text-primary font-semibold group-hover:text-purple-700">
                                Start Chatting
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Peace & Mood Tracking */}
                    <Link href="/Peace" className="group">
                        <div className="bg-transparent rounded-2xl p-8 shadow-sm  hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-1">
                            <div className="w-16 h-16 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl"><Hourglass className="w-8 h-8" /></span>
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">Peace & Mood</h3>
                            <p className="text-muted-foreground mb-4">
                                Track your mood, practice mindfulness, and find your inner peace with guided exercises.
                            </p>
                            <div className="flex items-center text-primary font-semibold group-hover:text-green-700">
                                Find Peace
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>



                    {/* Typing Practice */}
                    <Link href="/Games" className="group">
                        <div className="bg-transparent rounded-2xl p-8 shadow-sm  hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-1">

                            <div className="w-16 h-16 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl"><Keyboard className="w-8 h-8" /></span>
                            </div>
                            <h3 className="text-2xl font-bold text-primary mb-3">Mindful Typing</h3>
                            <p className="text-muted-foreground mb-4">
                                Practice mindfulness through focused typing exercises that calm the mind and improve concentration.
                            </p>
                            <div className="flex items-center text-primary font-semibold group-hover:text-blue-700">
                                Start Typing
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>





                </div>
            </div>
        </div>
    );
}