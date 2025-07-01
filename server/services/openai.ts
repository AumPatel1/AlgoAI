import OpenAI from 'openai';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-proj-5NGOzeplZ4oMXagnG_yNZ5-cg2u3zTF_jl7AIZa_42DDl6tclxCFTm-Y0lWqHMLFQ68tqkhLlKT3BlbkFJqWA8KpPzhp2LZkcOMgjy8eDkT8YKX8tifbNYOEXAM67GVnVPbUHztcYb11ls9qsoEhNjFM3',
});

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AICallResponse {
  message: string;
  shouldContinue: boolean;
  nextAction?: 'listen' | 'hangup' | 'transfer';
}

export class OpenAIService {
  async generateCallResponse(
    messages: ConversationMessage[],
    objective: string,
    userInput?: string
  ): Promise<AICallResponse> {
    try {
      const systemPromptWithJsonInstruction = `You are an AI assistant making a phone call. Your objective is: ${objective}

Guidelines:
- Keep responses conversational and natural for phone calls
- Be concise but engaging
- Listen actively and respond appropriately
- If the person wants to end the call, be polite and respectful
- Always maintain a professional but friendly tone
- Respond in a way that sounds natural when spoken aloud

Current conversation context: The call is in progress.

IMPORTANT: You must respond with a JSON object in this exact format:
{
  "message": "Your response message here",
  "shouldContinue": true/false,
  "nextAction": "listen"/"hangup"/"transfer"
}`;

      const conversationMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPromptWithJsonInstruction },
        ...messages.map(msg => ({
          role: msg.role as 'system' | 'user' | 'assistant',
          content: msg.content
        }))
      ];

      if (userInput) {
        conversationMessages.push({ role: 'user', content: userInput });
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: conversationMessages,
        max_tokens: 150,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      let parsedResponse: AICallResponse;

      try {
        const jsonResponse = JSON.parse(content || '{}');
        parsedResponse = {
          message: jsonResponse.message || "I'm sorry, I didn't catch that. Could you repeat?",
          shouldContinue: jsonResponse.shouldContinue !== false,
          nextAction: jsonResponse.nextAction || 'listen'
        };
      } catch (parseError) {
        // Fallback if JSON parsing fails
        parsedResponse = {
          message: content || "I'm having trouble processing that. Let me try again.",
          shouldContinue: true,
          nextAction: 'listen'
        };
      }

      return parsedResponse;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return {
        message: "I'm experiencing some technical difficulties. Let me connect you with someone who can help.",
        shouldContinue: false,
        nextAction: 'hangup'
      };
    }
  }

  async generateInitialMessage(objective: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Generate a natural, professional opening message for a phone call. The objective is: ${objective}

Make it sound conversational and appropriate for a phone call. Keep it brief and engaging.`
          }
        ],
        max_tokens: 100,
        temperature: 0.7,
      });

      return response.choices[0].message.content || "Hello! This is an AI assistant calling to discuss your inquiry.";
    } catch (error) {
      console.error('OpenAI initial message error:', error);
      return "Hello! This is an AI assistant. How can I help you today?";
    }
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    try {
      // This would typically use Whisper API, but for phone calls
      // you'd usually use Twilio's speech recognition or a real-time service
      // For now, return a placeholder that would be replaced with actual transcription
      return "Audio transcription would be implemented here";
    } catch (error) {
      console.error('Audio transcription error:', error);
      return "";
    }
  }
}

export const openaiService = new OpenAIService();
