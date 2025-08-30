import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { age_gender_schema } from "@/schemas/forms/formvalidator";

export const formvalidator = createTRPCRouter({
    // Query to check profile completion status
    get_profile_status: baseProcedure
        .query(async ({ ctx }) => {
            const { userId } = ctx;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                });
            }

            try {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        profileCompleted: true,
                        age: true,
                        gender: true,
                    },
                });

                if (!user) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    });
                }

                return {
                    profileCompleted: user.profileCompleted,
                    hasAge: user.age !== null,
                    hasGender: user.gender !== null,
                    needsCompletion: !user.profileCompleted,
                    gender: user.gender, // Just add this line
                    age : user.age
                };
            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch profile status',
                });
            }
        }),

    age_gender_save: baseProcedure
        .input(age_gender_schema)
        .mutation(async ({ input, ctx }) => {
            const { age, gender } = input;
            const { userId } = ctx;

            // 1. Authentication check (should be first)
            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                });
            }

            try {
                // 2. Check if profile is already completed
                const existingUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { profileCompleted: true },
                });

                // 3. Prevent double completion
                if (existingUser?.profileCompleted) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Profile has already been completed',
                    });
                }

                // 4. Main operation - update user
                const updatedUser = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        age,
                        gender,
                        profileCompleted: true,
                    },
                    select: {
                        id: true,
                        age: true,
                        gender: true,
                        profileCompleted: true,
                    },
                });

                // 5. Return success result
                return updatedUser;

            } catch (error) {
                // 6. Error handling
                if (error instanceof TRPCError) {
                    throw error;
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update profile',
                });
            }
        })
});