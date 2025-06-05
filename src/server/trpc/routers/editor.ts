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
      try {
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
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  getDrawing: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .output(
      z.object({
        name: z.string(),
        snapshot: z.json(),
      })
    )
    .query(async ({ ctx, input: { name } }) => {
      try {
        const drawing = await ctx.db.query.tldrawSnapshots.findFirst({
          where: eq(tldrawSnapshots.name, name),
        });
        if (!drawing) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        return drawing;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  updateDrawing: publicProcedure
    .input(
      z.object({
        name: z.string(),
        snapshot: z.json(),
      })
    )
    .mutation(async ({ ctx, input: { name, snapshot } }) => {
      await ctx.db
        .insert(tldrawSnapshots)
        .values({
          name,
          snapshot,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: tldrawSnapshots.name,
          set: {
            snapshot,
            updatedAt: new Date(),
          },
        });
    }),
});
