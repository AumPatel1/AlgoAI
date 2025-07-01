import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertCallSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import { TwilioService } from "./twilio-service";
import twilio from "twilio";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "fallback-secret-key";

// Middleware to verify JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(validatedData);
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { id: user.id, email: user.email, name: user.name, credits: user.credits },
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({ 
        user: { id: user.id, email: user.email, name: user.name, credits: user.credits },
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Protected routes
  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ 
        user: { id: user.id, email: user.email, name: user.name, credits: user.credits }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Call management routes - Now with real Twilio integration
  app.post("/api/calls", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCallSchema.parse(req.body);
      
      // Get the base URL for webhooks
      const baseUrl = process.env.REPLIT_DOMAIN 
        ? `https://${process.env.REPLIT_DOMAIN}` 
        : `http://localhost:5000`;
      
      // Initiate real Twilio call
      const twilioCallSid = await TwilioService.initiateCall({
        toNumber: validatedData.toNumber,
        prompt: (validatedData.metadata as any)?.prompt || "Hello, this is Algo AI calling. How can I help you today?",
        userId: (req as any).user.userId
      }, baseUrl);
      
      // Store call in database with Twilio SID
      const call = await storage.createCall({ 
        ...validatedData, 
        userId: req.user.userId,
        metadata: { 
          ...validatedData.metadata,
          twilioCallSid,
          status: 'initiated'
        }
      });
      
      res.json({ ...call, twilioCallSid });
    } catch (error: any) {
      console.error("Error creating call:", error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/calls", authenticateToken, async (req, res) => {
    try {
      const calls = await storage.getUserCalls(req.user.userId);
      res.json(calls);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/calls/:id", authenticateToken, async (req, res) => {
    try {
      const call = await storage.getCall(parseInt(req.params.id));
      if (!call || call.userId !== req.user.userId) {
        return res.status(404).json({ message: "Call not found" });
      }
      res.json(call);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Twilio webhook endpoints for live AI conversation
  app.post("/api/webhooks/twilio/call-start", async (req, res) => {
    try {
      const callSid = req.body.CallSid;
      const initialPrompt = TwilioService.getInitialPrompt(callSid);
      
      const twiml = new twilio.twiml.VoiceResponse();
      const gather = twiml.gather({
        input: ['speech'],
        action: '/api/webhooks/twilio/process-speech',
        speechTimeout: 'auto',
        speechModel: 'experimental_conversations'
      });
      
      gather.say({
        voice: 'Polly.Joanna-Neural'
      }, initialPrompt);
      
      res.type('text/xml');
      res.send(twiml.toString());
    } catch (error) {
      console.error('Error in call-start webhook:', error);
      const twiml = new twilio.twiml.VoiceResponse();
      twiml.say('I apologize, there was an error. Please try again later.');
      twiml.hangup();
      res.type('text/xml');
      res.send(twiml.toString());
    }
  });

  app.post("/api/webhooks/twilio/process-speech", async (req, res) => {
    try {
      const callSid = req.body.CallSid;
      const userSpeech = req.body.SpeechResult || 'No speech detected';
      
      console.log(`Call ${callSid}: User said "${userSpeech}"`);
      
      // Generate AI response
      const aiResponse = await TwilioService.generateAIResponse(callSid, userSpeech);
      
      const twiml = new twilio.twiml.VoiceResponse();
      
      // Check if AI wants to end the call
      if (aiResponse.includes('HANGUP_NOW')) {
        twiml.say({
          voice: 'Polly.Joanna-Neural'
        }, aiResponse.replace('HANGUP_NOW', 'Thank you for your time. Goodbye!'));
        twiml.hangup();
        
        // Clean up conversation history
        TwilioService.cleanupCall(callSid);
      } else {
        // Continue the conversation
        const gather = twiml.gather({
          input: ['speech'],
          action: '/api/webhooks/twilio/process-speech',
          speechTimeout: 'auto',
          speechModel: 'experimental_conversations'
        });
        
        gather.say({
          voice: 'Polly.Joanna-Neural'
        }, aiResponse);
      }
      
      console.log(`Call ${callSid}: AI responded "${aiResponse}"`);
      
      res.type('text/xml');
      res.send(twiml.toString());
    } catch (error) {
      console.error('Error processing speech:', error);
      const twiml = new twilio.twiml.VoiceResponse();
      twiml.say('I apologize, I had trouble understanding. Could you please repeat that?');
      twiml.gather({
        input: ['speech'],
        action: '/api/webhooks/twilio/process-speech',
        speechTimeout: 'auto'
      });
      res.type('text/xml');
      res.send(twiml.toString());
    }
  });

  // Webhook for call status updates (optional)
  app.post("/api/webhooks/twilio/call-status", async (req, res) => {
    try {
      const callSid = req.body.CallSid;
      const callStatus = req.body.CallStatus;
      const duration = req.body.CallDuration;
      
      console.log(`Call ${callSid} status: ${callStatus}, duration: ${duration}s`);
      
      // Update call status in database if needed
      // This would require finding the call by twilioCallSid in metadata
      
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing call status:', error);
      res.status(200).send('OK'); // Always return 200 to Twilio
    }
  });

  // Test endpoint to verify Twilio integration
  app.get("/api/test/twilio", authenticateToken, async (req, res) => {
    try {
      const baseUrl = process.env.REPLIT_DOMAIN 
        ? `https://${process.env.REPLIT_DOMAIN}` 
        : `http://localhost:5000`;
      
      res.json({
        status: "Twilio integration ready",
        twilioNumber: "+13372704657",
        accountSid: "ACf36b0f6d3bd4473ad1fdaf9c9d9bc5df",
        webhookUrl: `${baseUrl}/api/webhooks/twilio/call-start`,
        hasAuthToken: !!process.env.TWILIO_AUTH_TOKEN,
        hasOpenAI: !!process.env.OPENAI_API_KEY
      });
    } catch (error) {
      res.status(500).json({ error: "Twilio test failed", message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
