"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, Loader2, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import LightRays from "@/ChatbotComponents/LightRayComponent";
import Particles from "@/ChatbotComponents/Particles";

const SignInPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<'google' | 'email' | null>(null);
    const router = useRouter();

    const handleGoogleSignin = async () => {
        setIsLoading(true);
        setLoadingType('google');

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });

            toast.success("Redirecting...");
        }
        catch (error: any) {
            toast.error(error?.message || "Failed to sign in with Google. Please try again.");
        } finally {
            setIsLoading(false);
            setLoadingType(null);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingType('email');

        try {
            const result = await authClient.signIn.email({
                email,
                password,
            });

            if (result.error) {
                toast.error(result.error.message || "Invalid email or password. Please try again.");
            }
            else {
                toast.success("Welcome back! Redirecting...");
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            }
        } catch (error) {
            toast.error("Failed to sign in. Please try again.");
        } finally {
            setIsLoading(false);
            setLoadingType(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="fixed top-5 left-0 right-0 p-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center px-6 sm:px-8 lg:px-20">
                    <div className="flex flex-col">
                        <Link href="/">
                            <h1 className="text-xl font-semibold text-primary">getOkay</h1>
                        </Link>
                        <div className="text-sm text-muted-foreground opacity-50">
                            Affirmation typing here hehe
                        </div>
                    </div>


                    <Button variant="ghost" size="icon">
                        <Link href="/dashboard">
                            <LayoutDashboard className="w-6 h-6" />
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="absolute opacity-100 pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000 overflow-hidden">
                <LightRays className="bg-transparent" />
            </div>
            <div className="absolute pointer-events-none top-0 left-0 w-full h-full -z-10 fade-in animate-in duration-5000 overflow-hidden">
                <Particles
                    className="bg-transparent"
                    particleCount={400}
                    particleBaseSize={30}
                />
            </div>
            <div className="w-full max-w-sm">
                <Card className="shadow-xl border bg-transparent backdrop-blur-sm">
                    <CardHeader className="space-y-2 text-center pb-4">
                        <div className="mx-auto w-10 h-10 bg-muted rounded-lg flex items-center justify-center mb-1">
                            <div className="w-5 h-5 bg-foreground rounded-sm"></div>
                        </div>
                        <CardTitle className="text-xl font-semibold">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Sign in to your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={handleGoogleSignin}
                            className="w-full h-10 text-sm border hover:bg-accent/50 transition-colors"
                        >
                            {loadingType === 'google' ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <FaGoogle className="mr-2 h-4 w-4" />
                                    Continue with Google
                                </>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-card px-2 text-muted-foreground">or</span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailSignIn} className="space-y-3">
                            <div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-9 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-9 text-sm"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-3 w-3" />
                                        ) : (
                                            <Eye className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-10 text-sm font-medium mt-4"
                                disabled={isLoading || !email || !password}
                            >
                                {loadingType === 'email' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <p className="text-xs text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="font-medium hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SignInPage;