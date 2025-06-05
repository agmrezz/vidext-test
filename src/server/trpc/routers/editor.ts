import { tldrawSnapshots } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { publicProcedure, router } from "../trpc";

export const editorRouter = router({
  helloWorld: publicProcedure.query(({ ctx }) => {
    return `Hello Vidext, source: ${ctx.headers.get("x-trpc-source")}`;
  }),
  getDrawing: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input: { name } }) => {
      return await ctx.db.query.tldrawSnapshots.findFirst({
        where: eq(tldrawSnapshots.name, name),
      });
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
          target: tldrawSnapshots.id,
          set: {
            snapshot,
            updatedAt: new Date(),
          },
        });
    }),
});
