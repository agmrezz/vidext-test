import { publicProcedure, router } from "../trpc";

export const editorRouter = router({
  helloWorld: publicProcedure.query(({ ctx }) => {
    return `Hello Vidext, source: ${ctx.headers.get("x-trpc-source")}`;
  }),
});
