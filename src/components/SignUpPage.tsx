"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, User, MailIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpPage = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const handleemailsignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            setIsLoading(false);
        };

        try {
            const result = await authClient.signUp.email({
                name,
                email,
                password,
                newUserCallbackURL: "/form",
                callbackURL: "/dashboard",
            });

            if (result.error) {
                toast.error(result.error.message || "Failed to create account. Please try again.");
            }
            else {
                toast.success("Account created successfully!");
                await router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Be Okay, then you can be better</CardTitle>

                    <CardDescription className="text-muted-foreground">
                        Create your account to get okay
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleemailsignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="pl-2">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                <Input
                                    id="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 pr-10 h-12"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="pl-2">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                <Input
                                    id="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 pr-10 h-12"
                                    type="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium pl-2" >Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                <Input
                                    id="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-medium pl-2">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    type={showConfirmPassword ? "text" : "password"}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-12 h-12"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant={"ghost"}
                                    size={"sm"}
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ?
                                        <EyeOff className="h-4 w-4 text-muted-foreground" /> :
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    }
                                </Button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 font-medium"
                            disabled={isLoading || !name || !email || !password || !confirmPassword}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <div className="text-center text-sm text-muted-foreground pb-2">
                    Already have an account?{" "}
                    <Button variant="link" className="px-0 font-medium cursor-pointer">
                        <Link href="/sign-in">Sign in</Link>
                    </Button>
                </div>


            </Card>

        </div>
    )


}


export default SignUpPage;