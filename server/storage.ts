import { User, InsertUser, Document, InsertDocument } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  createDocument(doc: InsertDocument & { userId: number }): Promise<Document>;
  updateDocument(id: number, updates: Partial<Document>): Promise<Document>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private currentUserId: number;
  private currentDocId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.currentUserId = 1;
    this.currentDocId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
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

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.userId === userId,
    );
  }

  async createDocument(doc: InsertDocument & { userId: number }): Promise<Document> {
    const id = this.currentDocId++;
    const document: Document = {
      ...doc,
      id,
      copyrightAnalysis: null,
      alternativeVersion: null,
      analyzed: false,
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<Document> {
    const existing = await this.getDocument(id);
    if (!existing) throw new Error("Document not found");
    
    const updated = { ...existing, ...updates };
    this.documents.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
