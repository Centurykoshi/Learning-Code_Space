import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createCallerFactory, createTRPCContext } from "@/trpc/init";
import { formvalidator } from "@/modules/form/server/age_gender";
import Link from "next/link";

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">✓</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    getOkay
                                </h1>
                                <p className="text-sm text-gray-500">Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {session.user.name}!</span>
                            <form action="/api/auth/sign-out" method="post">
                                <button className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg transition-colors">
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {session.user.name?.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-xl text-gray-600">
                        Ready to continue your mental wellness journey? Choose from your favorite activities below.
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Current Streak</p>
                                <p className="text-2xl font-bold text-green-600">7 days</p>
                            </div>
                            <div className="text-2xl">🔥</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Sessions This Week</p>
                                <p className="text-2xl font-bold text-blue-600">12</p>
                            </div>
                            <div className="text-2xl">📊</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Mood Average</p>
                                <p className="text-2xl font-bold text-purple-600">8.2/10</p>
                            </div>
                            <div className="text-2xl">😊</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Activities</p>
                                <p className="text-2xl font-bold text-orange-600">45</p>
                            </div>
                            <div className="text-2xl">🎯</div>
                        </div>
                    </div>
                </div>

                {/* Main Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* AI Chatbot */}
                    <Link href="/Chatbot" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-purple-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Therapy Chat</h3>
                            <p className="text-gray-600 mb-4">
                                Chat with our AI therapist for instant support, guidance, and emotional wellness conversations.
                            </p>
                            <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                                Start Chatting
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Peace & Mood Tracking */}
                    <Link href="/Peace" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-green-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🧘‍♀️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Peace & Mood</h3>
                            <p className="text-gray-600 mb-4">
                                Track your mood, practice mindfulness, and find your inner peace with guided exercises.
                            </p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                                Find Peace
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Interactive Games */}
                    <Link href="/Games" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-orange-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">🎮</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Therapeutic Games</h3>
                            <p className="text-gray-600 mb-4">
                                Play engaging games designed to reduce stress, improve focus, and boost your mood.
                            </p>
                            <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-700">
                                Play Games
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Typing Practice */}
                    <Link href="/dashboard/typing" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-blue-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⌨️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Mindful Typing</h3>
                            <p className="text-gray-600 mb-4">
                                Practice mindfulness through focused typing exercises that calm the mind and improve concentration.
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                                Start Typing
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Chat History */}
                    <Link href="/chat" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-indigo-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Chat History</h3>
                            <p className="text-gray-600 mb-4">
                                Review your previous conversations and track your progress over time.
                            </p>
                            <div className="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700">
                                View History
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Profile Settings */}
                    <Link href="/form" className="group">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1 group-hover:border-gray-200">
                            <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">⚙️</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Profile Settings</h3>
                            <p className="text-gray-600 mb-4">
                                Update your profile information and customize your wellness journey preferences.
                            </p>
                            <div className="flex items-center text-gray-600 font-semibold group-hover:text-gray-700">
                                Manage Profile
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600">🤖</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Completed therapy session</p>
                                <p className="text-sm text-gray-500">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600">📊</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Logged mood: Happy</p>
                                <p className="text-sm text-gray-500">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600">⌨️</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">Typing session: 15 minutes</p>
                                <p className="text-sm text-gray-500">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}