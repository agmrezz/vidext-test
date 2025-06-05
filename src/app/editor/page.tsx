import { Drawings } from "@/components/drawings";
import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";

export default async function Page() {
  prefetch(trpc.editor.getDrawingList.infiniteQueryOptions({ limit: 10 }));

  return (
    <HydrateClient>
      <Drawings />
    </HydrateClient>
  );
}
