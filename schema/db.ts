import { integer, numeric, pgTable, varchar } from "drizzle-orm/pg-core"

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  username: varchar({ length: 255 }).notNull().unique(),
  balance: numeric({ precision: 7, scale: 2 }).notNull().default("0.0"),
  password: varchar({ length: 255 }).notNull(),
})
