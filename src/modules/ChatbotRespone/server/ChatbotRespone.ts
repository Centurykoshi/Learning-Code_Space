import {z } from "zod"; 
import {generateText} from "@/lib/gemini";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { TRPCError } from "@trpc/server";


export const ResponseRouter = createTRPCRouter({

            Response : baseProcedure
            .input (z.object({
                value :z.string().min(1, "Message can't be less than 3 or empty ")
                .max(5000, "Message can't exceed 5000 characters")
            }))
            .mutation(async({input, ctx})=> { 
                const userId = ctx.userId;

                if(!userId){ 
                    throw new TRPCError({
                        code: 'UNAUTHORIZED',
                    message: 'You must be logged in to respond.',
                })
            }

                const response = await generateText(userId, input.value);
                return { response };
            })

})