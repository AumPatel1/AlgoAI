import { users, calls, callEvents, pathways, type User, type InsertUser, type Call, type InsertCall, type CallEvent, type InsertCallEvent, type Pathway, type InsertPathway } from "../shared/schema.js";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema.js";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: number, credits: number): Promise<void>;

  // Call methods
  createCall(call: InsertCall & { userId: number }): Promise<Call>;
  getCall(id: number): Promise<Call | undefined>;
  getCallByTwilioSid(twilioCallSid: string): Promise<Call | undefined>;
  updateCall(id: number, updates: Partial<Call>): Promise<Call | undefined>;
  getCallsByUser(userId: number, limit?: number): Promise<Call[]>;
  getActiveCalls(userId: number): Promise<Call[]>;

  // Call event methods
  createCallEvent(event: InsertCallEvent): Promise<CallEvent>;
  getCallEvents(callId: number): Promise<CallEvent[]>;

  // Pathway methods
  createPathway(pathway: InsertPathway & { userId: number }): Promise<Pathway>;
  getPathway(id: number): Promise<Pathway | undefined>;
  getPathwaysByUser(userId: number): Promise<Pathway[]>;
  updatePathway(id: number, updates: Partial<Pathway>): Promise<Pathway | undefined>;
  deletePathway(id: number): Promise<void>;
}

class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calls: Map<number, Call>;
  private callEvents: Map<number, CallEvent>;
  private pathways: Map<number, Pathway>;
  private currentUserId: number;
  private currentCallId: number;
  private currentEventId: number;
  private currentPathwayId: number;

  constructor() {
    this.users = new Map();
    this.calls = new Map();
    this.callEvents = new Map();
    this.pathways = new Map();
    this.currentUserId = 1;
    this.currentCallId = 1;
    this.currentEventId = 1;
    this.currentPathwayId = 1;

    // Create a demo user
    this.createUser({
      username: 'demo',
      password: 'password',
      name: 'Demo User',
      email: 'demo@algo.ai'
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      credits: 1000,
      twilioAccountSid: null,
      twilioAuthToken: null,
      openaiApiKey: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserCredits(userId: number, credits: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.credits = credits;
      this.users.set(userId, user);
    }
  }

  async createCall(callData: InsertCall & { userId: number }): Promise<Call> {
    const id = this.currentCallId++;
    const call: Call = {
      ...callData,
      id,
      twilioCallSid: null,
      status: 'initiated',
      duration: 0,
      aiModel: callData.aiModel || 'gpt-4o',
      voice: callData.voice || 'alloy',
      objective: callData.objective || null,
      conversation: [],
      startedAt: new Date(),
      endedAt: null,
      creditsUsed: 0,
    };
    this.calls.set(id, call);
    return call;
  }

  async getCall(id: number): Promise<Call | undefined> {
    return this.calls.get(id);
  }

  async getCallByTwilioSid(twilioCallSid: string): Promise<Call | undefined> {
    return Array.from(this.calls.values()).find(
      (call) => call.twilioCallSid === twilioCallSid,
    );
  }

  async updateCall(id: number, updates: Partial<Call>): Promise<Call | undefined> {
    const call = this.calls.get(id);
    if (call) {
      const updatedCall = { ...call, ...updates };
      this.calls.set(id, updatedCall);
      return updatedCall;
    }
    return undefined;
  }

  async getCallsByUser(userId: number, limit: number = 50): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter((call) => call.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, limit);
  }

  async getActiveCalls(userId: number): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter((call) => 
        call.userId === userId && 
        ['initiated', 'ringing', 'in-progress'].includes(call.status)
      );
  }

  async createCallEvent(eventData: InsertCallEvent): Promise<CallEvent> {
    const id = this.currentEventId++;
    const event: CallEvent = {
      ...eventData,
      id,
      timestamp: new Date(),
    };
    this.callEvents.set(id, event);
    return event;
  }

  async getCallEvents(callId: number): Promise<CallEvent[]> {
    return Array.from(this.callEvents.values())
      .filter((event) => event.callId === callId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createPathway(pathwayData: InsertPathway & { userId: number }): Promise<Pathway> {
    const id = this.currentPathwayId++;
    const pathway: Pathway = {
      ...pathwayData,
      id,
      description: pathwayData.description ?? null,
      nodes: pathwayData.nodes ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.pathways.set(id, pathway);
    return pathway;
  }

  async getPathway(id: number): Promise<Pathway | undefined> {
    return this.pathways.get(id);
  }

  async getPathwaysByUser(userId: number): Promise<Pathway[]> {
    return Array.from(this.pathways.values())
      .filter((pathway) => pathway.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updatePathway(id: number, updates: Partial<Pathway>): Promise<Pathway | undefined> {
    const pathway = this.pathways.get(id);
    if (pathway) {
      const updatedPathway = { ...pathway, ...updates, updatedAt: new Date() };
      this.pathways.set(id, updatedPathway);
      return updatedPathway;
    }
    return undefined;
  }

  async deletePathway(id: number): Promise<void> {
    this.pathways.delete(id);
  }
}

class DbStorage implements IStorage {
  private db;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    const sql = neon(connectionString);
    this.db = drizzle(sql, { schema });
  }

  async getUser(id: number) {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string) {
    const result = await this.db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser) {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUserCredits(userId: number, credits: number) {
    await this.db.update(users).set({ credits }).where(eq(users.id, userId));
  }

  async createCall(call: Omit<InsertCall, 'userId'> & { userId: number }) {
    const result = await this.db.insert(calls).values(call).returning();
    return result[0];
  }

  async getCall(id: number) {
    const result = await this.db.select().from(calls).where(eq(calls.id, id));
    return result[0];
  }

  async getCallsByUser(userId: number, limit: number) {
    const result = await this.db
      .select()
      .from(calls)
      .where(eq(calls.userId, userId))
      .orderBy(calls.startedAt)
      .limit(limit);
    return result;
  }

  async getActiveCalls(userId: number) {
    const result = await this.db
      .select()
      .from(calls)
      .where(eq(calls.userId, userId));
    return result.filter(call => 
      ['initiated', 'ringing', 'in-progress'].includes(call.status)
    );
  }

  async getCallByTwilioSid(twilioSid: string) {
    const result = await this.db.select().from(calls).where(eq(calls.twilioCallSid, twilioSid));
    return result[0];
  }

  async updateCall(id: number, updates: Partial<Call>) {
    const result = await this.db
      .update(calls)
      .set(updates)
      .where(eq(calls.id, id))
      .returning();
    return result[0];
  }

  async createCallEvent(event: InsertCallEvent) {
    const result = await this.db.insert(callEvents).values(event).returning();
    return result[0];
  }

  async getCallEvents(callId: number) {
    const result = await this.db
      .select()
      .from(callEvents)
      .where(eq(callEvents.callId, callId))
      .orderBy(callEvents.timestamp);
    return result;
  }

  async createPathway(pathway: InsertPathway & { userId: number }): Promise<Pathway> {
    const result = await this.db.insert(pathways).values(pathway).returning();
    return result[0];
  }

  async getPathway(id: number): Promise<Pathway | undefined> {
    const result = await this.db.select().from(pathways).where(eq(pathways.id, id));
    return result[0];
  }

  async getPathwaysByUser(userId: number): Promise<Pathway[]> {
    const result = await this.db
      .select()
      .from(pathways)
      .where(eq(pathways.userId, userId))
      .orderBy(pathways.createdAt);
    return result;
  }

  async updatePathway(id: number, updates: Partial<Pathway>): Promise<Pathway | undefined> {
    const result = await this.db
      .update(pathways)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(pathways.id, id))
      .returning();
    return result[0];
  }

  async deletePathway(id: number): Promise<void> {
    await this.db.delete(pathways).where(eq(pathways.id, id));
  }
}

function createStorage(): IStorage {
  // In serverless environments like Vercel, always use memory storage unless explicitly configured
  if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL && process.env.USE_DATABASE === 'true') {
    try {
      return new DbStorage();
    } catch (error) {
      console.error("Failed to connect to database, falling back to memory storage:", error);
      return new MemStorage();
    }
  }
  return new MemStorage();
}

export const storage = createStorage(); 