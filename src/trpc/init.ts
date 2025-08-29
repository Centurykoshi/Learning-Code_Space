import { auth } from '@/lib/auth';
import { initTRPC } from '@trpc/server';
import { cache } from 'react';
import { headers } from 'next/headers';
export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context\
     * 
     * 
     */
   try{ 
    const session = await auth.api.getSession({
        headers : await headers(),
    });

    return { 
        session, 
        userId : session?.user?.id || null 
    }; 
   } catch (error) {
       console.error("Error creating TRPC context:", error);
       return { session: null, userId: null };
   }
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;