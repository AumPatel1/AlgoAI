import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  credits: integer("credits").notNull().default(1000),
  twilioAccountSid: text("twilio_account_sid"),
  twilioAuthToken: text("twilio_auth_token"),
  openaiApiKey: text("openai_api_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  phoneNumber: text("phone_number").notNull(),
  twilioCallSid: text("twilio_call_sid"),
  status: text("status").notNull().default("initiated"), // initiated, ringing, in-progress, completed, failed, cancelled
  duration: integer("duration").default(0), // in seconds
  aiModel: text("ai_model").notNull().default("gpt-4o"),
  voice: text("voice").notNull().default("alloy"),
  objective: text("objective"),
  conversation: jsonb("conversation").default([]), // array of conversation messages
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  creditsUsed: integer("credits_used").default(0),
});

export const callEvents = pgTable("call_events", {
  id: serial("id").primaryKey(),
  callId: integer("call_id").notNull(),
  eventType: text("event_type").notNull(), // webhook, ai_response, user_input, etc.
  eventData: jsonb("event_data").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const pathways = pgTable("pathways", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  nodes: jsonb("nodes").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
});

export const insertCallSchema = createInsertSchema(calls).pick({
  phoneNumber: true,
  aiModel: true,
  voice: true,
  objective: true,
});

export const insertCallEventSchema = createInsertSchema(callEvents).pick({
  callId: true,
  eventType: true,
  eventData: true,
});

export const insertPathwaySchema = createInsertSchema(pathways).pick({
  name: true,
  description: true,
  nodes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;
export type InsertCallEvent = z.infer<typeof insertCallEventSchema>;
export type CallEvent = typeof callEvents.$inferSelect;
export type InsertPathway = z.infer<typeof insertPathwaySchema>;
export type Pathway = typeof pathways.$inferSelect;
