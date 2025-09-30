import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BotIcon, Hourglass, Keyboard, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAccountNav from "@/components/UserAvatarNav";
import ThemeToggle from "@/components/ThemeToggle";



export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });


    return (
        <div className="min-h-screen bg-transparent">
            <header className="relative top-10 bg-transparent z-2">
                <div className="max-w-6xl mx-auto flex justify-between items-center bg-transparent sm:px-8 lg:px-20">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold text-primary">getOkay</h1>
                        <div className="text-sm text-muted-foreground opacity-50">
                            Affirmation typing here hehe
                        </div>
                    </div>





                    <div className="flex justify-between gap-5">
                        <div className="flex  justify-center items-end ">
                            <ThemeToggle className="h-10 w-10 " />
                        </div>
                        {session ? (<UserAccountNav user={session?.user} />) : (
                            <div className="flex gap-2">

                                <Button variant="outline"><Link href="/sign-in">
                                    Sign In</Link></Button>
                                <Button variant={"default"}><Link href="/sign-up">Sign Up</Link></Button>
                            </div>)}
                        <Button variant="ghost" size="icon">
                            <Link href="/dashboard">
                                <LayoutDashboard className="w-6 h-6" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
                        Your Mental Wellness
                        <span className="block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            Journey Starts Here
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                        getOkay is a just better made by Me : Piyush Yadav hehe
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {session ? (
                            <Link href="/dashboard" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105">
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link href="/sign-up" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all duration-200 transform hover:scale-105">
                                Start Your Journey
                            </Link>
                        )}

                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-transparent backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
            </section>

            {/* CTA Section */}

        </div>
    );
}