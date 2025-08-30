"use client";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, Ghost } from "lucide-react";
import { use, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";


const SignInPage = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleGoogleSignin = async () => {
        setIsLoading(true);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",  // This is needed for OAuth redirects
            });

            // Note: For OAuth, the redirect happens on the server side
            // so the code below might not execute
            toast.success("Redirecting...");
        }
        catch (error: any) {
            toast.error(error?.message || "Failed to sign in with Google. Please try again.");
            setIsLoading(false);
        }
    };
    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await authClient.signIn.email({
                email,
                password,
                // Remove callback URLs - we'll handle redirect manually
            });

            if (result.error) {
                toast.error(result.error.message || "Invalid email or password. Please try again.");
            }
            else {
                toast.success("Successfully signed in!");
                // Wait a moment for the toast, then redirect to dashboard
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1500);
            }
        } catch (error) {
            toast.error("Failed to sign in with email" + error);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle>Welcome to getOkay </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Welcome back! Please sign in to your account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                    <Button variant={"outline"}
                        disabled={isLoading}
                        onClick={handleGoogleSignin}
                        className="w-full h-12 text-sm font-medium border-2 cursor-pointer inset-5">
                        <FaGoogle className="mr-3 h-5 w-5" />
                        Continue with Google

                    </Button>

                    <div className="relative">

                        <div className="relative flex justify-center text-sm">
                            <span className=" px-2 text-muted-foreground">
                                or </span>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 text-muted-foreground">
                                continue with email
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSignIn} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium m-2">
                                Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-20 h-12"
                                    required
                                />

                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium m-2">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 text-muted-foreground" />
                                <Input id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-20 h-12"
                                    required
                                />
                                <Button type="button"
                                    variant={"ghost"}
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (<EyeOff className="h-4 w-4 text-muted-foreground" />) :
                                        (<Eye className="h-4 w-4 text-muted-foreground" />)}

                                </Button>

                            </div>

                        </div>

                        <Button type="submit"
                            className="w-full h-12 font-medium"
                            disabled={isLoading || !email || !password}>
                            {isLoading ? "Signing In.." : "Sign In"}
                        </Button>


                    </form>
                    <div className="text-center text-sm text-muted-foreground">
                        don't have an account?{" "}
                        <Button variant="link" className="px-0 font-medium cursor-pointer">
                            <Link href="/sign-up">Sign up</Link>
                        </Button>
                    </div>


                </CardContent>

            </Card>


        </div>

    )

};

export default SignInPage;