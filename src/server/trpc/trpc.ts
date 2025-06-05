import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import db from "../db";


export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db
    ...opts,
  };
};
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

/**
 * Server-side caller factory
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
