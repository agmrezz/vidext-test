"use client";
import { useLayoutEffect, useMemo, useState } from "react";
import {
  createTLStore,
  DefaultSpinner,
  getSnapshot,
  loadSnapshot,
  throttle,
  Tldraw,
} from "tldraw";
import "tldraw/tldraw.css";
import { Card } from "./ui/card";

export function Editor() {
  const store = useMemo(() => createTLStore(), []);
  const [loadingState, setLoadingState] = useState<
    | { status: "loading" }
    | { status: "ready" }
    | { status: "error"; error: string }
  >({
    status: "loading",
  });

  useLayoutEffect(() => {
    const persistedSnapshot = localStorage.getItem("tldraw-snapshot");

    if (persistedSnapshot) {
      try {
        const snapshot = JSON.parse(persistedSnapshot);
        loadSnapshot(store, snapshot);
        setLoadingState({ status: "ready" });
      } catch (error: any) {
        setLoadingState({ status: "error", error: error.message }); // Something went wrong
      }
    } else {
      setLoadingState({ status: "ready" }); // Nothing persisted, continue with the empty store
    }

    const cleanupFn = store.listen(
      throttle(() => {
        const snapshot = getSnapshot(store);
        localStorage.setItem("tldraw-snapshot", JSON.stringify(snapshot));
      }, 500)
    );

    return () => {
      cleanupFn();
    };
  }, [store]);

  // [4]
  if (loadingState.status === "loading") {
    return (
      <div className="tldraw__editor">
        <h2>
          <DefaultSpinner />
        </h2>
      </div>
    );
  }

  if (loadingState.status === "error") {
    return (
      <div className="tldraw__editor">
        <h2>Error!</h2>
        <p>{loadingState.error}</p>
      </div>
    );
  }

  return (
    <Card className="h-full w-full rounded-lg overflow-hidden p-0 tldraw__editor">
      <Tldraw store={store} />
    </Card>
  );
}
