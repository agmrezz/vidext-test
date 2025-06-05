import { Editor } from "@/components/editor";

import { HydrateClient, prefetch, trpc } from "@/lib/trpc/server";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  prefetch(trpc.editor.getDrawing.queryOptions({ name: slug }));

  return (
    <HydrateClient>
      <div className="h-full w-full">
        <Editor name={slug} />
      </div>
    </HydrateClient>
  );
}
