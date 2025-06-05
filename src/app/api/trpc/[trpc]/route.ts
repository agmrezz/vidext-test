import { appRouter } from "@/server/trpc";
import { createTRPCContext } from "@/server/trpc/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
  });
}

export { handler as GET, handler as POST };
