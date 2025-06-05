"use client";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/lib/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Box, TldrawImage } from "tldraw";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { SidebarTrigger } from "./ui/sidebar";

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

const formSchema = z.object({
  name: z.string().min(1),
});

function NewDrawing({
  handleSubmit,
}: {
  handleSubmit: (name: string) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleSubmit(values.name);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New Drawing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new drawing</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="doofenshmirtz blueprints" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a name for your new drawing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="submit">Create</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function Drawings() {
  const router = useRouter();
  const trpc = useTRPC();
  const drawingsQuery = useSuspenseInfiniteQuery(
    trpc.editor.getDrawingList.infiniteQueryOptions(
      {
        limit: 10,
      },
      { initialCursor: 0, getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const createDrawingQuery = useMutation(
    trpc.editor.createDrawing.mutationOptions({
      onSuccess: ({ id }) => {
        router.push(`/editor/${id}`);
      },
    })
  );

  function createDrawing(name: string) {
    createDrawingQuery.mutate({
      name,
    });
  }

  return (
    <div>
      <header className="p-3 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-mediumd">Drawings</h1>
        </div>
        <NewDrawing handleSubmit={createDrawing} />
      </header>
      <div className="flex gap-4 m-4 flex-wrap">
        {drawingsQuery.data?.pages.map((page) =>
          page.drawings.map((drawing) => (
            <Link href={`/editor/${drawing.id}`} key={drawing.id}>
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
    </div>
  );
}
