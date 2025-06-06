import { tldrawSnapshots } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { publicProcedure, router } from "../trpc";

export const editorRouter = router({
  helloWorld: publicProcedure.query(({ ctx }) => {
    return `Hello Vidext, source: ${ctx.headers.get("x-trpc-source")}`;
  }),
  getDrawingList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
      })
    )
    .output(
      z.object({
        drawings: z.array(
          z.object({
            id: z.number(),
            name: z.string(),
            snapshot: z.json(),
            updatedAt: z.date(),
          })
        ),
        nextCursor: z.number().nullish(),
      })
    )
    .query(async ({ ctx, input: { limit, cursor } }) => {
      const drawings = await ctx.db.query.tldrawSnapshots.findMany({
        where: (tldrawSnapshots, { gt }) =>
          cursor ? gt(tldrawSnapshots.id, cursor) : undefined,
        orderBy: (tldrawSnapshots, { asc }) => asc(tldrawSnapshots.createdAt),
        limit: limit + 1,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (drawings.length > limit) {
        const nextItem = drawings.pop();
        nextCursor = nextItem!.id;
      }

      return { drawings, nextCursor };
    }),
  getDrawing: publicProcedure
    .input(
      z.object({
        id: z.coerce.number(),
      })
    )
    .output(
      z.object({
        name: z.string(),
        snapshot: z.json(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      const drawing = await ctx.db.query.tldrawSnapshots.findFirst({
        where: eq(tldrawSnapshots.id, id),
      });
      if (!drawing) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return drawing;
    }),
  createDrawing: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { name } }) => {
      const drawing = await ctx.db
        .insert(tldrawSnapshots)
        .values({
          name,
          snapshot: "{}",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return drawing[0];
    }),
  updateDrawing: publicProcedure
    .input(
      z.object({
        id: z.coerce.number(),
        snapshot: z.json(),
      })
    )
    .mutation(async ({ ctx, input: { id, snapshot } }) => {
      await ctx.db
        .update(tldrawSnapshots)
        .set({
          snapshot,
          updatedAt: new Date(),
        })
        .where(eq(tldrawSnapshots.id, id));
    }),
});
