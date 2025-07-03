import express from 'express';
import session from 'express-session';
import { storage } from './storage';
import { twilioService } from './twilio';
import { openaiService } from './openai';
import { 
  insertCallSchema, 
  insertUserSchema,
  insertPathwaySchema
} from "../shared/schema";
import { z } from "zod";

// Define Vercel types inline to avoid import issues
interface VercelRequest {
  query: { [key: string]: string | string[] | undefined };
  body: any;
  cookies: { [key: string]: string };
  method?: string;
  url?: string;
  headers: { [key: string]: string | string[] | undefined };
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (object: any) => VercelResponse;
  send: (body: any) => VercelResponse;
  setHeader: (name: string, value: string | string[]) => VercelResponse;
  end: () => VercelResponse;
}

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'algo-ai-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Add session type declaration
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

// Authentication endpoints
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Simple session - in production use proper session management
    req.session.userId = user.id;
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await storage.createUser(userData);
    
    req.session.userId = user.id;
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
    }
  });
  res.json({ message: "Logged out successfully" });
});

app.get("/api/auth/me", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Call endpoints
app.post("/api/calls", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const callData = insertCallSchema.parse(req.body);
    
    // Create call record
    const call = await storage.createCall({
      ...callData,
      userId: req.session.userId,
    });

    // Generate initial AI message
    const initialMessage = await openaiService.generateInitialMessage(
      callData.objective || "General inquiry call"
    );

    // Get webhook base URL from environment or construct from request
    const baseUrl = process.env.BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                  `${req.protocol}://${req.get('host')}`);

    const webhookUrl = `${baseUrl}/api/webhooks/twilio/voice/${call.id}`;
    const statusUrl = `${baseUrl}/api/webhooks/twilio/status/${call.id}`;

    console.log(`Making call with webhook URL: ${webhookUrl}`);

    try {
      // Make the call via Twilio
      const twilioCall = await twilioService.makeCall({
        to: callData.phoneNumber,
        url: webhookUrl,
        statusCallback: statusUrl,
      });

      // Update call with Twilio SID
      await storage.updateCall(call.id, {
        twilioCallSid: twilioCall.sid,
        status: 'ringing',
      });

      // Log the initial AI message
      await storage.createCallEvent({
        callId: call.id,
        eventType: 'ai_message_prepared',
        eventData: { message: initialMessage },
      });

      res.json({ 
        call: await storage.getCall(call.id),
        initialMessage 
      });
    } catch (twilioError: any) {
      console.error("Twilio call error:", twilioError);
      
      // Update call status to failed
      await storage.updateCall(call.id, {
        status: 'failed',
        endedAt: new Date(),
      });

      // Log the error
      await storage.createCallEvent({
        callId: call.id,
        eventType: 'call_failed',
        eventData: { 
          error: twilioError.message,
          timestamp: new Date().toISOString()
        },
      });

      return res.status(500).json({ 
        message: "Failed to initiate call", 
        error: twilioError.message || "Twilio service unavailable"
      });
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Create call error:", error);
    res.status(500).json({ message: "Failed to initiate call", error: error.message });
  }
});

app.get("/api/calls", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const calls = await storage.getCallsByUser(req.session.userId, limit);
    
    res.json({ calls });
  } catch (error) {
    console.error("Get calls error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/calls/active", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const activeCalls = await storage.getActiveCalls(req.session.userId);
    res.json({ calls: activeCalls });
  } catch (error) {
    console.error("Get active calls error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/calls/:id", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const callId = parseInt(req.params.id);
    const call = await storage.getCall(callId);
    
    if (!call || call.userId !== req.session.userId) {
      return res.status(404).json({ message: "Call not found" });
    }

    const events = await storage.getCallEvents(callId);
    
    res.json({ call, events });
  } catch (error) {
    console.error("Get call error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Analytics endpoints
app.get("/api/analytics/stats", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userCalls = await storage.getCallsByUser(req.session.userId, 1000);
    const activeCalls = await storage.getActiveCalls(req.session.userId);
    
    const totalCalls = userCalls.length;
    const completedCalls = userCalls.filter(call => call.status === 'completed').length;
    const failedCalls = userCalls.filter(call => call.status === 'failed').length;
    const successRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0;
    const totalCreditsUsed = userCalls.reduce((sum, call) => sum + (call.creditsUsed || 0), 0);

    res.json({
      totalCalls,
      activeCalls: activeCalls.length,
      successRate: parseFloat(successRate.toFixed(1)),
      creditsUsed: totalCreditsUsed,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Pathway Endpoints
app.get("/api/pathways", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const pathways = await storage.getPathwaysByUser(req.session.userId);
    res.json({ pathways });
  } catch (error) {
    console.error("Get pathways error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/pathways", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const pathwayData = insertPathwaySchema.parse(req.body);
    
    const pathway = await storage.createPathway({
      ...pathwayData,
      userId: req.session.userId,
    });

    res.status(201).json({ pathway });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    console.error("Create pathway error:", error);
    res.status(500).json({ message: "Failed to create pathway", error: error.message });
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Use express app to handle the request
  return app(req as any, res as any);
} 