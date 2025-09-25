import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Mindful Typing | getOkay"
}

export default async function TypingPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-lg">⌨️</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Mindful Typing</h1>
                                    <p className="text-sm text-gray-500">Focus • Relax • Improve</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Introduction */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Practice Mindful Typing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Combine the benefits of mindfulness with typing practice. Focus on the present moment
                        while improving your typing skills and reducing stress.
                    </p>
                </div>

                {/* Typing Component Integration */}
                <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Start Your Session</h3>
                        <p className="text-gray-600">
                            Take a deep breath, relax your shoulders, and focus on each keystroke.
                        </p>
                    </div>

                    {/* This is where your typing component would be integrated */}
                    <div className="bg-gray-50 rounded-xl p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-200">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⌨️</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                Typing Component Integration
                            </h4>
                            <p className="text-gray-500 mb-4">
                                Your typing component from src/components/TypingComponent will be integrated here
                            </p>
                            <div className="text-sm text-blue-600 font-medium">
                                → Import and use your Input.tsx and related components here
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🧘‍♀️</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Mindfulness</h4>
                        <p className="text-sm text-gray-600">Focus on the present moment and reduce anxiety</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Focus</h4>
                        <p className="text-sm text-gray-600">Improve concentration and mental clarity</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📈</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Progress</h4>
                        <p className="text-sm text-gray-600">Track your typing speed and accuracy</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">😌</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Relaxation</h4>
                        <p className="text-sm text-gray-600">Reduce stress through rhythmic typing</p>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-8 text-white">
                    <h3 className="text-2xl font-bold mb-6">Mindful Typing Tips</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-xs">1</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Focus on Your Breathing</h4>
                                    <p className="text-blue-100 text-sm">Take slow, deep breaths while you type</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-xs">2</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Maintain Good Posture</h4>
                                    <p className="text-blue-100 text-sm">Sit up straight and relax your shoulders</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-xs">3</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Stay Present</h4>
                                    <p className="text-blue-100 text-sm">Focus on each keystroke and letter</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-xs">4</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Don't Rush</h4>
                                    <p className="text-blue-100 text-sm">Prioritize accuracy and mindfulness over speed</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-xs">5</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Take Breaks</h4>
                                    <p className="text-blue-100 text-sm">Rest your hands and mind between sessions</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-xs">6</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Be Patient</h4>
                                    <p className="text-blue-100 text-sm">Progress comes with consistent practice</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}