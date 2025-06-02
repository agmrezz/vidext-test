"use client";
import { useTRPC } from "@/lib/trpc/client";
import { useQuery } from "@tanstack/react-query";

export function TrpcClientDemo() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.editor.helloWorld.queryOptions());

  return (
    <div>
      <p>{isLoading ? "loading..." : data}</p>
    </div>
  );
}
