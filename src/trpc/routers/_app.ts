import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { formvalidator } from '@/modules/form/server/age_gender';
import { ResponseRouter } from '@/modules/ChatbotRespone/server/ChatbotRespone';

export const appRouter = createTRPCRouter({
    age_gender : formvalidator,
    ResponseRouter : ResponseRouter

}); 


// export type definition of API
export type AppRouter = typeof appRouter;