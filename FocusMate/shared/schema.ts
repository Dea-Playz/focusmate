import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  content: text("content").notNull().default(""),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  text: text("text").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  backgroundTheme: text("background_theme").default("background-theme-1"),
  pomodoroTime: integer("pomodoro_time").default(25),
  audioUrl: text("audio_url"),
  audioVolume: integer("audio_volume").default(50),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertNoteSchema = createInsertSchema(notes).pick({
  content: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  text: true,
  completed: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  backgroundTheme: true,
  pomodoroTime: true,
  audioUrl: true,
  audioVolume: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
