import { users, calls, callEvents, type User, type InsertUser, type Call, type InsertCall, type CallEvent, type InsertCallEvent } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private calls: Map<number, Call>;
  private callEvents: Map<number, CallEvent>;
  private currentUserId: number;
  private currentCallId: number;
  private currentEventId: number;

  constructor() {
    this.users = new Map();
    this.calls = new Map();
    this.callEvents = new Map();
    this.currentUserId = 1;
    this.currentCallId = 1;
    this.currentEventId = 1;

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
}

export const storage = new MemStorage();
