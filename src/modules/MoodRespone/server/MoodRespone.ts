
import prisma from "@/lib/prisma";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import z from "zod";

const MoodSchema = z.enum(["great", "good", "okay", "bad", "horrible"])
export const MoodTrackerRouter = createTRPCRouter({

    SaveMood: baseProcedure
        .input(z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            mood: MoodSchema,
        }))

        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to save your mood",
                });
            }

            const existing_mood = await prisma.mood.findFirst({
                where: {
                    userId: userId,
                    date: input.date,
                }
            });
            let updatedMood;

            if (existing_mood) {
                updatedMood = await prisma.mood.update({
                    where: { id: existing_mood.id },
                    data: { mood: input.mood }
                });
            }
            else {
                updatedMood = await prisma.mood.create({
                    data: {
                        userId: userId,
                        date: input.date,
                        mood: input.mood
                    }
                })
            };

            return updatedMood;



        }),

    getAllMood: baseProcedure
        .query(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to view conversations.',
                });
            }

            return await prisma.mood.findMany({
                where: { userId: userId },
                orderBy: { date: 'desc' },
                select: {
                    id: true,
                    date: true,
                    updatedAt: true,
                    createdAt: true,
                    mood: true,
                }
            });
        }),













}

)