import "server-only";

import { appRouter } from "@/server/trpc";
import { createTRPCContext } from "@/server/trpc/trpc";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import { headers } from "next/headers";
import { cache } from "react";
import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "server");

  return createTRPCContext({
    headers: heads,
  });
});

export const trpc = createTRPCOptionsProxy({
  ctx: createContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createContext);

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
