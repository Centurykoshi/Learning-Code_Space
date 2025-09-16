import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { formvalidator } from '@/modules/form/server/age_gender';
import { ResponseRouter } from '@/modules/ChatbotRespone/server/ChatbotRespone';
import { chatbotRouter } from '@/trpc/routers/chatbot';
import { MoodTrackerRouter } from '@/modules/MoodRespone/server/MoodRespone';
import { typingrouter } from '@/modules/TypingResponse/server/TypingResponse';

export const appRouter = createTRPCRouter({
    age_gender: formvalidator,
    ResponseRouter: ResponseRouter,
    chatbot: chatbotRouter,
    moodRespone: MoodTrackerRouter,
    typingResponse: typingrouter,
});


// export type definition of API
export type AppRouter = typeof appRouter;