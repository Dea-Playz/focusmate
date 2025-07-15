import { users, notes, tasks, userSettings, type User, type InsertUser, type Note, type Task, type UserSettings, type InsertNote, type InsertTask, type InsertUserSettings } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Notes
  getNotesByUserId(userId: number): Promise<Note[]>;
  createNote(note: InsertNote & { userId: number }): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  
  // Tasks
  getTasksByUserId(userId: number): Promise<Task[]>;
  createTask(task: InsertTask & { userId: number }): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // User Settings
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notes: Map<number, Note>;
  private tasks: Map<number, Task>;
  private userSettings: Map<number, UserSettings>;
  private currentUserId: number;
  private currentNoteId: number;
  private currentTaskId: number;
  private currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
    this.tasks = new Map();
    this.userSettings = new Map();
    this.currentUserId = 1;
    this.currentNoteId = 1;
    this.currentTaskId = 1;
    this.currentSettingsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getNotesByUserId(userId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.userId === userId);
  }

  async createNote(note: InsertNote & { userId: number }): Promise<Note> {
    const id = this.currentNoteId++;
    const newNote: Note = {
      id,
      content: note.content || "",
      userId: note.userId,
      updatedAt: new Date(),
    };
    this.notes.set(id, newNote);
    return newNote;
  }

  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;
    
    const updatedNote: Note = {
      ...existingNote,
      ...note,
      updatedAt: new Date(),
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async createTask(task: InsertTask & { userId: number }): Promise<Task> {
    const id = this.currentTaskId++;
    const newTask: Task = {
      id,
      text: task.text,
      completed: task.completed || false,
      userId: task.userId,
      createdAt: new Date(),
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask: Task = {
      ...existingTask,
      ...task,
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(settings => settings.userId === userId);
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existingSettings = Array.from(this.userSettings.values()).find(s => s.userId === userId);
    
    if (existingSettings) {
      const updatedSettings: UserSettings = {
        ...existingSettings,
        ...settings,
      };
      this.userSettings.set(existingSettings.id, updatedSettings);
      return updatedSettings;
    } else {
      const id = this.currentSettingsId++;
      const newSettings: UserSettings = {
        id,
        userId,
        backgroundTheme: "background-theme-1",
        pomodoroTime: 25,
        audioUrl: null,
        audioVolume: 50,
        ...settings,
      };
      this.userSettings.set(id, newSettings);
      return newSettings;
    }
  }
}

export const storage = new MemStorage();
