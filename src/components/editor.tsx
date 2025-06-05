"use client";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useLayoutEffect, useMemo } from "react";
import {
  createTLStore,
  getSnapshot,
  loadSnapshot,
  throttle,
  Tldraw,
} from "tldraw";
import "tldraw/tldraw.css";
import { Card } from "./ui/card";

export function Editor({ id }: { id: string }) {
  const store = useMemo(() => createTLStore(), []);

  const trpc = useTRPC();
  const { data: drawing, isLoading } = useSuspenseQuery(
    trpc.editor.getDrawing.queryOptions({ id })
  );
  const updateDrawing = useMutation(
    trpc.editor.updateDrawing.mutationOptions()
  );

  useLayoutEffect(() => {
    const persistedSnapshot = drawing?.snapshot;

    // Wait for the drawing to load
    if (isLoading) return;
    // There is no snapshot to load
    if (!persistedSnapshot) return;

    try {
      const snapshot = JSON.parse(persistedSnapshot as string);
      loadSnapshot(store, snapshot);
    } catch (error: any) {
      throw new Error("Error loading snapshot");
    }

    const cleanupFn = store.listen(
      throttle(() => {
        const snapshot = getSnapshot(store);
        console.log("updating drawing", id);
        updateDrawing.mutate({
          id,
          snapshot: JSON.stringify(snapshot),
        });
      }, 500)
    );

    return () => {
      cleanupFn();
    };
  }, [store, drawing, isLoading]);

  return (
    <Card className="h-full w-full rounded-lg overflow-hidden p-0 tldraw__editor">
      <Tldraw store={store} />
    </Card>
  );
}
