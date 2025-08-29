import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { formvalidator } from '@/modules/form/server/age_gender';

export const appRouter = createTRPCRouter({
    age_gender : formvalidator

}); 


// export type definition of API
export type AppRouter = typeof appRouter;