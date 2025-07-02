import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileText, GitBranch, Hand, Phone } from "lucide-react";

export default function Documentation() {
  return (
    <DashboardLayout>
      <div className="space-y-8 text-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Documentation</h1>
            <p className="text-gray-400">Your guide to using the AI Call Assistant.</p>
          </div>
          <FileText className="w-10 h-10 text-gray-500" />
        </div>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Hand className="w-6 h-6 mr-3 text-[hsl(207,90%,54%)]"/>
              Welcome to Algo AI Call Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white">
            <p>
              This platform empowers you to create, manage, and deploy intelligent AI-powered voice agents. Whether you're looking to automate customer service, conduct surveys, or build complex interactive voice response (IVR) systems, you'll find the tools you need right here.
            </p>
            <p>
              This guide will walk you through the core features of the platform and help you get started on building your first AI agent.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Phone className="w-6 h-6 mr-3 text-[hsl(207,90%,54%)]"/>
              Making Your First Call
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-li:text-gray-300">
            <p>
              The easiest way to see the platform in action is to make a test call.
            </p>
            <ol>
              <li>Navigate to the <strong>Send Call</strong> page from the sidebar.</li>
              <li>Enter the phone number you wish to call in the provided field.</li>
              <li>Write a simple objective for the call (e.g., "Book a dinner reservation for two people at 7 PM tomorrow").</li>
              <li>Select the AI model and voice you'd like to use.</li>
              <li>Click "Start Call". The system will handle the rest!</li>
            </ol>
            <p>
              You can monitor the call's progress and see the full conversation transcript in the <strong>Call Logs</strong> section.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[hsl(0,0%,5.1%)] border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <GitBranch className="w-6 h-6 mr-3 text-[hsl(207,90%,54%)]"/>
              Conversational Pathways
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-pre:bg-[hsl(0,0%,8%)] prose-code:text-white">
            <p>
              "Conversational Pathways" are the heart of your AI agents. They are structured workflows that define how the AI should behave, what it should say, and what actions it can take at different points in the conversation.
            </p>
            <p>
              Currently, pathways are defined using a JSON structure in the <strong>Pathway Editor</strong>. This gives you fine-grained control over the conversation flow.
            </p>
            <h4 className="font-semibold text-white">Example Node Structure:</h4>
            <p>A pathway is an array of "nodes". Here is an example of a simple node:</p>
            <pre>
              <code>
{`[
  {
    "id": "start",
    "type": "play_audio",
    "text": "Hello! How can I help you today?",
    "transitions": [
      {
        "event": "user_spoke",
        "target": "main_logic"
      }
    ]
  },
  {
    "id": "main_logic",
    "type": "decision",
    "prompt": "The user said: {{userInput}}. Is their intent to book an appointment or ask a question?",
    "branches": [
      {
        "condition": "intent == 'book_appointment'",
        "target": "collect_details"
      },
      {
        "condition": "intent == 'ask_question'",
        "target": "answer_question"
      }
    ]
  }
]`}
              </code>
            </pre>
            <p>
              In the future, we will be releasing a visual, drag-and-drop editor to make building these pathways even more intuitive!
            </p>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
} 