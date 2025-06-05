"use client";
import { useTRPC } from "@/lib/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Box, TldrawImage } from "tldraw";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

function getLastUpdated(updatedAt: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - updatedAt.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  if (diffInMinutes < 1) {
    return "Less than a minute ago";
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}

export function Drawings() {
  const trpc = useTRPC();
  const drawingsQuery = useSuspenseInfiniteQuery(
    trpc.editor.getDrawingList.infiniteQueryOptions(
      {
        limit: 10,
      },
      { initialCursor: 0, getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  return (
    <div className="flex gap-4">
      {drawingsQuery.data?.pages.map((page) =>
        page.drawings.map((drawing) => (
          <Link href={`/editor/${drawing.name}`} key={drawing.id}>
            <Card key={drawing.id} className="w-full">
              <CardHeader>
                <CardTitle>{drawing.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-50 w-50">
                  <TldrawImage
                    bounds={new Box(0, 0, 1000, 1000)}
                    snapshot={JSON.parse(drawing.snapshot as string)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                updated: {getLastUpdated(drawing.updatedAt)}
              </CardFooter>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
}
