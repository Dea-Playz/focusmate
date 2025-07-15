import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertTaskSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // For demo purposes, we'll use a fixed user ID
  const DEMO_USER_ID = 1;

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    try {
      const notes = await storage.getNotesByUserId(DEMO_USER_ID);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const noteData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote({ ...noteData, userId: DEMO_USER_ID });
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid note data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create note" });
      }
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const noteData = insertNoteSchema.parse(req.body);
      const note = await storage.updateNote(id, noteData);
      if (!note) {
        res.status(404).json({ message: "Note not found" });
      } else {
        res.json(note);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid note data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update note" });
      }
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasksByUserId(DEMO_USER_ID);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({ ...taskData, userId: DEMO_USER_ID });
      res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid task data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create task" });
      }
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json(task);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid task data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update task" });
      }
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (!success) {
        res.status(404).json({ message: "Task not found" });
      } else {
        res.json({ message: "Task deleted successfully" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // User settings routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings(DEMO_USER_ID);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settingsData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.updateUserSettings(DEMO_USER_ID, settingsData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update settings" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
