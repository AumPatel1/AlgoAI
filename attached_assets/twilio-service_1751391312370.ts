import twilio from 'twilio';
import OpenAI from 'openai';

// Twilio configuration
const TWILIO_ACCOUNT_SID = 'ACf36b0f6d3bd4473ad1fdaf9c9d9bc5df';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = '+13372704657';

// Initialize Twilio client
export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Initialize OpenAI client
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CallRequest {
  toNumber: string;
  prompt: string;
  userId: number;
}

export interface ConversationTurn {
  callSid: string;
  userSpeech: string;
  aiResponse: string;
  timestamp: Date;
}

// In-memory conversation storage (replace with database in production)
const conversationHistory = new Map<string, ConversationTurn[]>();

export class TwilioService {
  /**
   * Initiate an outbound AI phone call
   */
  static async initiateCall(callRequest: CallRequest, webhookBaseUrl: string): Promise<string> {
    try {
      const call = await twilioClient.calls.create({
        to: callRequest.toNumber,
        from: TWILIO_PHONE_NUMBER,
        url: `${webhookBaseUrl}/api/webhooks/twilio/call-start`,
        method: 'POST'
      });

      // Store the initial prompt for this call
      conversationHistory.set(call.sid, [{
        callSid: call.sid,
        userSpeech: 'CALL_INITIATED',
        aiResponse: callRequest.prompt,
        timestamp: new Date()
      }]);

      return call.sid;
    } catch (error) {
      console.error('Error initiating Twilio call:', error);
      throw new Error('Failed to initiate call');
    }
  }

  /**
   * Generate AI response using OpenAI
   */
  static async generateAIResponse(callSid: string, userSpeech: string): Promise<string> {
    try {
      // Get conversation history
      const history = conversationHistory.get(callSid) || [];
      
      // Build conversation context
      const systemPrompt = `You are Algo, a friendly AI assistant making phone calls. Be conversational, natural, and helpful. Keep responses under 100 words. If the user wants to end the call, respond with exactly "HANGUP_NOW" to end the conversation.`;
      
      const conversationContext = history.map(turn => 
        `User: ${turn.userSpeech}\nAI: ${turn.aiResponse}`
      ).join('\n\n');

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Conversation so far:\n${conversationContext}\n\nUser just said: "${userSpeech}"\n\nRespond naturally:` }
      ];

      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 150,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, I did not understand that. Could you please repeat?';

      // Store this conversation turn
      history.push({
        callSid,
        userSpeech,
        aiResponse,
        timestamp: new Date()
      });
      conversationHistory.set(callSid, history);

      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'I apologize, I am having trouble processing your request right now. Please try again.';
    }
  }

  /**
   * Get initial prompt for a call
   */
  static getInitialPrompt(callSid: string): string {
    const history = conversationHistory.get(callSid);
    return history?.[0]?.aiResponse || 'Hello, this is Algo AI calling. How can I help you today?';
  }

  /**
   * Get conversation history for a call
   */
  static getConversationHistory(callSid: string): ConversationTurn[] {
    return conversationHistory.get(callSid) || [];
  }

  /**
   * Clean up conversation history (call this when call ends)
   */
  static cleanupCall(callSid: string): void {
    conversationHistory.delete(callSid);
  }
}