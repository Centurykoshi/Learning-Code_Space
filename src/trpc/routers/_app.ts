import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { formvalidator } from '@/modules/form/server/age_gender';
import { ResponseRouter } from '@/modules/ChatbotRespone/server/ChatbotRespone';
import { chatbotRouter } from '@/trpc/routers/chatbot';

export const appRouter = createTRPCRouter({
    age_gender: formvalidator,
    ResponseRouter: ResponseRouter,
    chatbot: chatbotRouter

});


// export type definition of API
export type AppRouter = typeof appRouter;