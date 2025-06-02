import { editorRouter } from "./routers/editor";
import { router } from "./trpc";

export const appRouter = router({
  editor: editorRouter,
});

// Export type router type signature
export type AppRouter = typeof appRouter;
