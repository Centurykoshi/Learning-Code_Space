"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import image from "next/image";

const SignUpPage = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                email,
                password,
                name,
                callbackURL: "/dashboard"

            }, {
                onSuccess: () => {
                    toast.success("Sign up Successful");
                },


            }
            )
        } catch (error) {
            toast.error("Sign up failed");
        } finally {
            setIsLoading(false);
        }



    };

    return (
        <div className="flex items-center justify-c">

        </div>
    )


}


export default SignUpPage;