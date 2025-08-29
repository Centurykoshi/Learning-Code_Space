import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { age_gender_schema } from "@/schemas/forms/formvalidator";

export const formvalidator = createTRPCRouter({
    // Query to check if user profile is completed
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

                return user;
            } catch (error) {
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

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User not authenticated',
                });
            }

            try {
                // First check if profile is already completed
                const existingUser = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { profileCompleted: true },
                });

                if (!existingUser) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'User not found',
                    });
                }

                if (existingUser.profileCompleted) {
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'Profile has already been completed',
                    });
                }

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
                return updatedUser;
            } catch (error) {
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

