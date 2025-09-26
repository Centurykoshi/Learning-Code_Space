import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">✓</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                getOkay
                            </h1>
                        </div>
                        <div className="flex space-x-4">
                            <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors">
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Your Mental Wellness
                        <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Journey Starts Here
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        getOkay is a comprehensive mental wellness platform that combines AI-powered chatbot therapy,
                        mood tracking, mindfulness exercises, and interactive activities to support your mental health journey.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                            Start Your Journey
                        </Link>
                        <Link href="#features" className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for Mental Wellness
                        </h2>
                        <p className="text-xl text-gray-600">
                            Discover powerful tools designed to support your mental health and well-being
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* AI Chatbot */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-2xl">🤖</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Chatbot Therapy</h3>
                            <p className="text-gray-600 mb-4">
                                Get instant support with our AI-powered therapeutic chatbot. Available 24/7 to listen and provide guidance.
                            </p>
                            <div className="text-purple-600 font-semibold">→ Chat Now</div>
                        </div>

                        {/* Mood Tracking */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Peace & Mood Tracking</h3>
                            <p className="text-gray-600 mb-4">
                                Track your mood, emotions, and mental state with beautiful visualizations and insights.
                            </p>
                            <div className="text-green-600 font-semibold">→ Track Mood</div>
                        </div>

                        {/* Interactive Games */}
                       
                        {/* Typing Practice */}
                        

                        {/* Progress Tracking */}
                        

                        {/* Community Support */}
                       
                    </div>
                </div>
            </section>

            {/* CTA Section */}
           
        </div>
    );
}