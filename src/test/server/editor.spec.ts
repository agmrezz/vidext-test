import { AppRouter, appRouter } from "@/server/trpc";
import { createTRPCContext } from "@/server/trpc/trpc";
import { inferProcedureInput } from "@trpc/server";
import { expect, test } from "vitest";

async function createCaller() {
  const ctx = await createTRPCContext({
    headers: new Headers(),
  });
  return appRouter.createCaller(ctx);
}

test("createDrawing", async () => {
  const caller = await createCaller();

  const drawing = await caller.editor.createDrawing({
    name: "test",
  });

  expect(drawing).toMatchObject({
    name: "test",
  });
});

test("updateDrawing", async () => {
  const caller = await createCaller();

  const drawing = await caller.editor.createDrawing({
    name: "test",
  });

  await caller.editor.updateDrawing({
    id: drawing.id,
    snapshot: {
      type: "test",
    },
  });

  type getDrawingInput = inferProcedureInput<AppRouter["editor"]["getDrawing"]>;
  const input: getDrawingInput = {
    id: drawing.id,
  };
  const updatedDrawing = await caller.editor.getDrawing(input);

  expect(updatedDrawing).toMatchObject({
    name: "test",
    snapshot: {
      type: "test",
    },
  });
});
