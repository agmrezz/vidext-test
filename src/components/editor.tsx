"use client";
import { useTRPC } from "@/lib/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useLayoutEffect, useMemo } from "react";
import {
  createTLStore,
  DefaultColorStyle,
  DefaultDashStyle,
  GeoShapeGeoStyle,
  getSnapshot,
  loadSnapshot,
  throttle,
  Tldraw,
  useEditor,
} from "tldraw";
import "tldraw/tldraw.css";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

function pickRandom<T>(values: T[]) {
  return values[Math.floor(Math.random() * values.length)];
}

const RandomizeGeo = () => {
  const editor = useEditor();

  const handleClick = () => {
    const selectedShapes = editor.getSelectedShapes();
    const shapesToUpdate = selectedShapes
      .filter((shape) => editor.isShapeOfType(shape, "geo"))
      .map((shape, i) => {
        return {
          id: shape.id,
          type: shape.type,
          props: {
            dash: pickRandom([...DefaultDashStyle.values]),
            geo: pickRandom([...GeoShapeGeoStyle.values]),
            color: pickRandom([...DefaultColorStyle.values]),
          },
        };
      });

    if (shapesToUpdate.length > 0) {
      editor.updateShapes(shapesToUpdate);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="absolute top-[60px] left-3 z-[1000]"
    >
      Randomize Geo
    </Button>
  );
};

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
      <Tldraw
        store={store}
        components={{
          InFrontOfTheCanvas: RandomizeGeo,
        }}
      />
    </Card>
  );
}
