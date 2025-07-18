import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACf36b0f6d3bd4473ad1fdaf9c9d9bc5df';
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!authToken) {
  throw new Error('TWILIO_AUTH_TOKEN environment variable is required');
}

const client = twilio(accountSid, authToken);

export interface CallOptions {
  to: string;
  from?: string;
  url: string;
  method?: 'GET' | 'POST';
  statusCallback?: string;
  statusCallbackMethod?: 'GET' | 'POST';
}

export interface CallStatus {
  sid: string;
  status: string;
  duration?: string;
  startTime?: string;
  endTime?: string;
}

export class TwilioService {
  private defaultFromNumber: string;

  constructor() {
    // You'll need to set up a Twilio phone number or use the default
    this.defaultFromNumber = process.env.TWILIO_PHONE_NUMBER || '+15005550006'; // Twilio test number
  }

  async makeCall(options: CallOptions): Promise<CallStatus> {
    try {
      const call = await client.calls.create({
        to: options.to,
        from: options.from || this.defaultFromNumber,
        url: options.url,
        method: options.method || 'POST',
        statusCallback: options.statusCallback,
        statusCallbackMethod: options.statusCallbackMethod || 'POST',
      });

      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime?.toISOString(),
        endTime: call.endTime?.toISOString(),
      };
    } catch (error) {
      console.error('Twilio call error:', error);
      throw new Error(`Failed to make call: ${error.message}`);
    }
  }

  async getCallStatus(callSid: string): Promise<CallStatus> {
    try {
      const call = await client.calls(callSid).fetch();
      
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime?.toISOString(),
        endTime: call.endTime?.toISOString(),
      };
    } catch (error) {
      console.error('Twilio fetch call error:', error);
      throw new Error(`Failed to fetch call status: ${error.message}`);
    }
  }

  async endCall(callSid: string): Promise<CallStatus> {
    try {
      const call = await client.calls(callSid).update({ status: 'completed' });
      
      return {
        sid: call.sid,
        status: call.status,
        duration: call.duration,
        startTime: call.startTime?.toISOString(),
        endTime: call.endTime?.toISOString(),
      };
    } catch (error) {
      console.error('Twilio end call error:', error);
      throw new Error(`Failed to end call: ${error.message}`);
    }
  }

  generateTwiML(message: string, continueUrl?: string): string {
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${message}</Say>`;

    if (continueUrl) {
      twiml += `
  <Redirect method="POST">${continueUrl}</Redirect>`;
    }

    twiml += `
</Response>`;

    return twiml;
  }

  async getAvailableNumbers(): Promise<Array<{ phoneNumber: string; friendlyName: string }>> {
    try {
      const phoneNumbers = await client.incomingPhoneNumbers.list({ limit: 20 });
      
      return phoneNumbers.map(number => ({
        phoneNumber: number.phoneNumber,
        friendlyName: number.friendlyName || number.phoneNumber,
      }));
    } catch (error) {
      console.error('Twilio get numbers error:', error);
      return [];
    }
  }
}

export const twilioService = new TwilioService();
