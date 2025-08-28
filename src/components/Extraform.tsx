"use client";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TimerIcon, User2Icon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { age_gender_schema } from "@/schemas/forms/formvalidator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";


// Create a clean type alias
type AgeGenderFormData = z.infer<typeof age_gender_schema>;

export default function Extraform() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const trpc = useTRPC();

    // Move useMutation outside of handleSubmit


    const save_age_gender = useMutation(trpc.age_gender.age_gender_save.mutationOptions({
    }));

    const form = useForm<AgeGenderFormData>({
        resolver: zodResolver(age_gender_schema),
        defaultValues: {
            age: 18,
            gender: "male"
        }
    });

    const handleSubmit = async (data: AgeGenderFormData) => {
        setIsSubmitting(true);

        try {
            await save_age_gender.mutateAsync({
                age: data.age,
                gender: data.gender
            });
            toast.success("Profile updated successfully!");
            router.push("/");
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle> Hi, There </CardTitle>

                    <CardDescription className="text-sm text-muted-foreground">
                        Tell us about yourself so we can personalize your experience.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <div className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-sm font-medium">
                                    Age
                                </Label>
                                <div className="relative">
                                    <TimerIcon
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                    />
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Enter your age"
                                        className="pl-10 h-12"
                                        disabled={isSubmitting}
                                        {...form.register("age", { valueAsNumber: true })}
                                    />
                                </div>
                                {form.formState.errors.age && (
                                    <p className="text-sm text-muted-foreground">{form.formState.errors.age.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-sm font-medium">
                                    Gender
                                </Label>
                                <div className="relative">
                                    <User2Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="gender"
                                        type="text"
                                        placeholder="Enter your gender"
                                        className="pl-10 h-12"
                                        disabled={isSubmitting}
                                        {...form.register("gender")}
                                    />
                                </div>
                                {form.formState.errors.gender && (
                                    <p className="text-sm text-muted-foreground">{form.formState.errors.gender.message}</p>
                                )}
                            </div>
                        </div>

                        <CardFooter className="px-0 pt-6">
                            <Button
                                type="submit"
                                className="w-full h-8"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Updating..." : "Complete Profile"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>

        </div>
    )

}