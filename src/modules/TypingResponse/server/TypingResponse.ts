import { generatetypingtext } from "@/lib/gemini";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import z from "zod";

const typingmode = z.enum(["Story", "Affirmation"]);

export const typingrouter = createTRPCRouter({
    typingsendmessage: baseProcedure
        .input(z.object({
            mode: typingmode,
            time: z.number().min(15).max(120)
        }))

        .mutation(async ({ input, ctx }) => {
            const userId = ctx.userId;

            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be logged in to set typing settings",
                });
            }

            const typingResponse = await generatetypingtext(input.mode, input.time);

            return {
                typingResponse,
                mode: input.mode,
                time: input.time,
            }
        })




})