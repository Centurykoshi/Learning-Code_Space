"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
            <div className="w-full max-w-md">
                <Card className="shadow-lg border-0 bg-card/95 backdrop-blur">
                    <CardHeader className="space-y-3 text-center pb-6">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                            <div className="w-6 h-6 bg-primary rounded-sm"></div>
                        </div>
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground leading-relaxed">
                            Sign in to your getOkay account to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <Button
                            variant="outline"
                            disabled={isLoading}
                            onClick={handleGoogleSignin}
                            className="w-full h-12 text-sm font-medium border border-border hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group transform"
                        >
                            {loadingType === 'google' ? (
                                <>
                                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <FaGoogle className="mr-3 h-4 w-4 text-foreground group-hover:scale-110 transition-transform duration-300" />
                                    Continue with Google
                                </>
                            )}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-card px-4 text-muted-foreground">
                                    or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleEmailSignIn} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email address
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 border-border focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-12 h-12 border-border focus:ring-2 focus:ring-ring focus:ring-offset-0 transition-all"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 font-medium bg-primary hover:bg-primary/90 transition-colors duration-200"
                                disabled={isLoading || !email || !password}
                            >
                                {loadingType === 'email' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
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