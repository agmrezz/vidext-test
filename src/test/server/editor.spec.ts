import { db } from "@/server/db";
import { tldrawSnapshots } from "@/server/db/schema";
import { AppRouter, appRouter } from "@/server/trpc";
import { createTRPCContext } from "@/server/trpc/trpc";
import { inferProcedureInput } from "@trpc/server";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { afterAll, expect, test } from "vitest";

const TEST_DRAWING_NAME = crypto.randomUUID();

async function createCaller() {
  const ctx = await createTRPCContext({
    headers: new Headers(),
  });
  return appRouter.createCaller(ctx);
}

test("createDrawing", async () => {
  const caller = await createCaller();

  const drawing = await caller.editor.createDrawing({
    name: TEST_DRAWING_NAME,
  });

  expect(drawing).toMatchObject({
    name: TEST_DRAWING_NAME,
  });
});

test("updateDrawing", async () => {
  const caller = await createCaller();

  const drawing = await caller.editor.createDrawing({
    name: TEST_DRAWING_NAME,
  });

  await caller.editor.updateDrawing({
    id: drawing.id,
    snapshot: {
      type: TEST_DRAWING_NAME,
    },
  });

  type getDrawingInput = inferProcedureInput<AppRouter["editor"]["getDrawing"]>;
  const input: getDrawingInput = {
    id: drawing.id,
  };
  const updatedDrawing = await caller.editor.getDrawing(input);

  expect(updatedDrawing).toMatchObject({
    name: TEST_DRAWING_NAME,
    snapshot: {
      type: TEST_DRAWING_NAME,
    },
  });
});

afterAll(async () => {
  await db
    .delete(tldrawSnapshots)
    .where(eq(tldrawSnapshots.name, TEST_DRAWING_NAME));
});
