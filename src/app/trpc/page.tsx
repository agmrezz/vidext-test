import { TrpcClientDemo } from "@/components/trpc-client-demo";
import { caller, HydrateClient, prefetch, trpc } from "@/lib/trpc/server";

export default async function TrpcPage() {
  prefetch(trpc.editor.helloWorld.queryOptions());

  const msg = await caller.editor.helloWorld();

  return (
    <HydrateClient>
      <p>{msg}</p>
      <TrpcClientDemo />
    </HydrateClient>
  );
}
