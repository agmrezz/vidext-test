import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tldrawSnapshots = sqliteTable("tldraw_snapshots", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  snapshot: text("snapshot", { mode: "json" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).notNull(),
});
