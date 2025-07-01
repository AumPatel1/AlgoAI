import { users, calls, type User, type InsertUser, type Call, type InsertCall } from "@shared/schema";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // Call methods
  createCall(call: InsertCall & { userId: number }): Promise<Call>;
  getUserCalls(userId: number): Promise<Call[]>;
  getCall(id: number): Promise<Call | undefined>;
  updateCallStatus(id: number, status: string, duration?: number, transcript?: string): Promise<Call | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calls: Map<number, Call>;
  private currentUserId: number;
  private currentCallId: number;

  constructor() {
    this.users = new Map();
    this.calls = new Map();
    this.currentUserId = 1;
    this.currentCallId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      credits: 100, // Starting credits
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async createCall(callData: InsertCall & { userId: number }): Promise<Call> {
    const id = this.currentCallId++;
    const call: Call = {
      id,
      userId: callData.userId,
      fromNumber: callData.fromNumber,
      toNumber: callData.toNumber,
      duration: 0,
      status: "pending",
      transcript: null,
      metadata: callData.metadata || null,
      createdAt: new Date(),
    };
    this.calls.set(id, call);
    return call;
  }

  async getUserCalls(userId: number): Promise<Call[]> {
    return Array.from(this.calls.values()).filter(call => call.userId === userId);
  }

  async getCall(id: number): Promise<Call | undefined> {
    return this.calls.get(id);
  }

  async updateCallStatus(id: number, status: string, duration?: number, transcript?: string): Promise<Call | undefined> {
    const call = this.calls.get(id);
    if (!call) return undefined;
    
    const updatedCall: Call = {
      ...call,
      status,
      duration: duration || call.duration,
      transcript: transcript || call.transcript,
    };
    this.calls.set(id, updatedCall);
    return updatedCall;
  }
}

// PostgreSQL Storage Implementation
export class PostgresStorage implements IStorage {
  private db: any;

  constructor() {
    const client = postgres(process.env.DATABASE_URL!);
    this.db = drizzle(client);
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const result = await this.db.insert(users).values({
      ...insertUser,
      password: hashedPassword,
      credits: 100, // Starting credits
    }).returning();
    return result[0];
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async createCall(callData: InsertCall & { userId: number }): Promise<Call> {
    const result = await this.db.insert(calls).values(callData).returning();
    return result[0];
  }

  async getUserCalls(userId: number): Promise<Call[]> {
    return await this.db.select().from(calls).where(eq(calls.userId, userId)).orderBy(desc(calls.createdAt));
  }

  async getCall(id: number): Promise<Call | undefined> {
    const result = await this.db.select().from(calls).where(eq(calls.id, id)).limit(1);
    return result[0];
  }

  async updateCallStatus(id: number, status: string, duration?: number, transcript?: string): Promise<Call | undefined> {
    const updateData: any = { status };
    if (duration !== undefined) updateData.duration = duration;
    if (transcript !== undefined) updateData.transcript = transcript;
    
    const result = await this.db.update(calls).set(updateData).where(eq(calls.id, id)).returning();
    return result[0];
  }
}

// Use in-memory storage for now - database connection has authentication issues
export const storage = new MemStorage();
