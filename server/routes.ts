import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { twilioService } from "./services/twilio";
import { openaiService } from "./services/openai";
import { 
  insertCallSchema, 
  insertUserSchema,
  insertPathwaySchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
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
                    (process.env.REPLIT_DOMAINS?.split(',')[0] ? 
                    `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
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
      } catch (twilioError) {
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
    } catch (error) {
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

  app.post("/api/calls/:id/end", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const callId = parseInt(req.params.id);
      const call = await storage.getCall(callId);
      
      if (!call || call.userId !== req.session.userId) {
        return res.status(404).json({ message: "Call not found" });
      }

      if (call.twilioCallSid) {
        try {
          await twilioService.endCall(call.twilioCallSid);
        } catch (twilioError) {
          console.error("Error ending Twilio call:", twilioError);
          // Continue with local cleanup even if Twilio call end fails
        }
      }

      const updatedCall = await storage.updateCall(callId, {
        status: 'completed',
        endedAt: new Date(),
      });

      await storage.createCallEvent({
        callId: callId,
        eventType: 'call_ended_by_user',
        eventData: { endedAt: new Date().toISOString() },
      });

      res.json({ call: updatedCall });
    } catch (error) {
      console.error("End call error:", error);
      res.status(500).json({ message: "Failed to end call" });
    }
  });

  // Twilio webhook endpoints
  app.post("/api/webhooks/twilio/voice/:callId", async (req, res) => {
    try {
      const callId = parseInt(req.params.callId);
      const call = await storage.getCall(callId);
      
      if (!call) {
        console.error(`Call not found for webhook: ${callId}`);
        return res.status(404).send("Call not found");
      }

      console.log(`Voice webhook called for call ${callId}`, req.body);

      // Get or generate initial message
      let message = "Hello! This is an AI assistant. How can I help you today?";
      
      if (call.objective) {
        message = await openaiService.generateInitialMessage(call.objective);
      }

      // Update call status
      await storage.updateCall(callId, { status: 'in-progress' });
      
      // Log the event
      await storage.createCallEvent({
        callId: callId,
        eventType: 'call_answered',
        eventData: { 
          timestamp: new Date().toISOString(),
          initialMessage: message 
        },
      });

      // Return TwiML to speak the message and gather response
      const baseUrl = process.env.BASE_URL || 
                    process.env.REPLIT_DOMAINS?.split(',')[0] ? 
                    `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
                    `${req.protocol}://${req.get('host')}`;
      
      const continueUrl = `${baseUrl}/api/webhooks/twilio/gather/${callId}`;
      
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>
  <Gather input="speech" action="${continueUrl}" method="POST" speechTimeout="3" timeout="10">
    <Say voice="alice">Please tell me how I can help you.</Say>
  </Gather>
  <Redirect method="POST">${continueUrl}</Redirect>
</Response>`;
      
      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error("Voice webhook error:", error);
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">I'm sorry, I'm experiencing technical difficulties. Goodbye.</Say>
  <Hangup/>
</Response>`;
      res.type('text/xml').send(errorTwiml);
    }
  });

  app.post("/api/webhooks/twilio/gather/:callId", async (req, res) => {
    try {
      const callId = parseInt(req.params.callId);
      const call = await storage.getCall(callId);
      
      if (!call) {
        console.error(`Call not found for gather webhook: ${callId}`);
        return res.status(404).send("Call not found");
      }

      console.log(`Gather webhook called for call ${callId}`, req.body);

      const userSpeech = req.body.SpeechResult || req.body.Digits || "";
      
      // Log user input
      await storage.createCallEvent({
        callId: callId,
        eventType: 'user_input',
        eventData: { 
          speech: userSpeech,
          timestamp: new Date().toISOString()
        },
      });

      // Get AI response
      const conversation = (call.conversation as any[]) || [];
      
      let aiResponse;
      try {
        aiResponse = await openaiService.generateCallResponse(
          conversation,
          call.objective || "General inquiry",
          userSpeech
        );
      } catch (aiError) {
        console.error("OpenAI error:", aiError);
        aiResponse = {
          message: "I'm having trouble processing that. Let me connect you with someone who can help.",
          shouldContinue: false,
          nextAction: 'hangup'
        };
      }

      // Update conversation
      const updatedConversation = [
        ...conversation,
        {
          role: 'user' as const,
          content: userSpeech,
          timestamp: new Date().toISOString()
        },
        {
          role: 'assistant' as const,
          content: aiResponse.message,
          timestamp: new Date().toISOString()
        }
      ];

      await storage.updateCall(callId, { 
        conversation: updatedConversation 
      });

      // Log AI response
      await storage.createCallEvent({
        callId: callId,
        eventType: 'ai_response',
        eventData: { 
          message: aiResponse.message,
          shouldContinue: aiResponse.shouldContinue,
          nextAction: aiResponse.nextAction,
          timestamp: new Date().toISOString()
        },
      });

      // Generate appropriate TwiML response
      let twiml: string;
      
      if (aiResponse.shouldContinue && aiResponse.nextAction === 'listen') {
        const baseUrl = process.env.BASE_URL || 
                      process.env.REPLIT_DOMAINS?.split(',')[0] ? 
                      `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 
                      `${req.protocol}://${req.get('host')}`;
        
        const continueUrl = `${baseUrl}/api/webhooks/twilio/gather/${callId}`;
        
        twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${aiResponse.message}</Say>
  <Gather input="speech" action="${continueUrl}" method="POST" speechTimeout="3" timeout="10">
    <Say voice="alice">Please continue.</Say>
  </Gather>
  <Redirect method="POST">${continueUrl}</Redirect>
</Response>`;
      } else {
        // End the call
        twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${aiResponse.message}</Say>
  <Hangup/>
</Response>`;
        
        await storage.updateCall(callId, { 
          status: 'completed',
          endedAt: new Date()
        });
      }

      res.type('text/xml').send(twiml);
    } catch (error) {
      console.error("Gather webhook error:", error);
      const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">I'm sorry, I'm experiencing technical difficulties. Goodbye.</Say>
  <Hangup/>
</Response>`;
      res.type('text/xml').send(errorTwiml);
    }
  });

  app.post("/api/webhooks/twilio/status/:callId", async (req, res) => {
    try {
      const callId = parseInt(req.params.callId);
      const callStatus = req.body.CallStatus;
      const callDuration = req.body.CallDuration;
      
      console.log(`Status webhook for call ${callId}:`, req.body);
      
      const call = await storage.getCall(callId);
      if (call) {
        const updates: any = { status: callStatus.toLowerCase() };
        
        if (callDuration) {
          updates.duration = parseInt(callDuration);
          // Calculate credits used (1 credit per minute)
          updates.creditsUsed = Math.ceil(parseInt(callDuration) / 60);
        }
        
        if (['completed', 'failed', 'busy', 'no-answer', 'canceled'].includes(callStatus.toLowerCase())) {
          updates.endedAt = new Date();
        }

        await storage.updateCall(callId, updates);
        
        await storage.createCallEvent({
          callId: callId,
          eventType: 'status_update',
          eventData: { 
            status: callStatus,
            duration: callDuration,
            timestamp: new Date().toISOString()
          },
        });

        // Update user credits if call completed
        if (updates.creditsUsed && call.userId) {
          const user = await storage.getUser(call.userId);
          if (user) {
            const newCredits = Math.max(0, user.credits - updates.creditsUsed);
            await storage.updateUserCredits(call.userId, newCredits);
          }
        }
      }

      res.send("OK");
    } catch (error) {
      console.error("Status webhook error:", error);
      res.status(500).send("Internal server error");
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

  // Test endpoints for debugging
  app.get("/api/test/twilio", async (req, res) => {
    try {
      const numbers = await twilioService.getAvailableNumbers();
      res.json({ 
        message: "Twilio connection successful", 
        numbers: numbers.length,
        accountSid: process.env.TWILIO_ACCOUNT_SID?.substring(0, 10) + '...'
      });
    } catch (error) {
      console.error("Twilio test error:", error);
      res.status(500).json({ message: "Twilio connection failed", error: error.message });
    }
  });

  app.get("/api/test/openai", async (req, res) => {
    try {
      const testMessage = await openaiService.generateInitialMessage("Test call");
      res.json({ 
        message: "OpenAI connection successful", 
        testResponse: testMessage 
      });
    } catch (error) {
      console.error("OpenAI test error:", error);
      res.status(500).json({ message: "OpenAI connection failed", error: error.message });
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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Create pathway error:", error);
      res.status(500).json({ message: "Failed to create pathway", error: error.message });
    }
  });

  app.get("/api/pathways/:id", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getPathway(pathwayId);
      
      if (!pathway || pathway.userId !== req.session.userId) {
        return res.status(404).json({ message: "Pathway not found" });
      }
      
      res.json({ pathway });
    } catch (error) {
      console.error("Get pathway error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/pathways/:id", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getPathway(pathwayId);

      if (!pathway || pathway.userId !== req.session.userId) {
        return res.status(404).json({ message: "Pathway not found" });
      }

      const pathwayData = insertPathwaySchema.partial().parse(req.body);

      const updatedPathway = await storage.updatePathway(pathwayId, pathwayData);

      res.json({ pathway: updatedPathway });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Update pathway error:", error);
      res.status(500).json({ message: "Failed to update pathway", error: error.message });
    }
  });

  app.delete("/api/pathways/:id", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const pathwayId = parseInt(req.params.id);
      const pathway = await storage.getPathway(pathwayId);

      if (!pathway || pathway.userId !== req.session.userId) {
        return res.status(404).json({ message: "Pathway not found" });
      }

      await storage.deletePathway(pathwayId);

      res.status(204).send();
    } catch (error) {
      console.error("Delete pathway error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
