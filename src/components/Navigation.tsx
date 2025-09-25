import Link from "next/link";

interface NavigationProps {
    currentPath?: string;
    showAuthButtons?: boolean;
    userName?: string | null;
}

export default function Navigation({ currentPath = '', showAuthButtons = false, userName }: NavigationProps) {
    const isActive = (path: string) => currentPath.startsWith(path);

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo and Brand */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold">✓</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                getOkay
                            </h1>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    {userName && (
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link
                                href="/dashboard"
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/dashboard')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/Chatbot"
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/Chatbot')
                                        ? 'text-purple-600 bg-purple-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                AI Chat
                            </Link>
                            <Link
                                href="/Peace"
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/Peace')
                                        ? 'text-green-600 bg-green-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Peace
                            </Link>
                            <Link
                                href="/Games"
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${isActive('/Games')
                                        ? 'text-orange-600 bg-orange-50'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                Games
                            </Link>
                        </nav>
                    )}

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {showAuthButtons ? (
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : userName ? (
                            <>
                                <span className="text-gray-600 hidden sm:inline">
                                    Welcome, {userName.split(' ')[0]}!
                                </span>
                                <form action="/api/auth/sign-out" method="post">
                                    <button
                                        type="submit"
                                        className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg transition-colors font-medium"
                                    >
                                        Sign Out
                                    </button>
                                </form>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
}