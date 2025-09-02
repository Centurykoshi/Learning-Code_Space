import { PrismaClient } from "@/generated/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const prisma = new PrismaClient();

// Simple user interface
interface UserData {
  name: string;
  age: number | null;
  gender: string | null;
}

// Get user data from database
async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        age: true,
        gender: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Create personalized system prompt with memory context
function createSystemPrompt(user: UserData, userMessage: string, conversationHistory?: any): string {
  // Decide guidance based on age, but don't include age in output repeatedly
  let guidance = "";
  if (user.age !== null) {
    if (user.age < 13) {
      guidance = "Use very simple, friendly, and supportive language. Focus on school, hobbies, family, and social confidence.";
    } else if (user.age < 18) {
      guidance = "Use encouraging and relatable language. Focus on school, friendships, self-esteem, and family support.";
    } else if (user.age < 30) {
      guidance = "Address career, relationships, and life transition challenges.";
    } else if (user.age < 50) {
      guidance = "Focus on work-life balance, family responsibilities, and personal growth.";
    } else {
      guidance = "Consider health, life reflection, and finding continued purpose.";
    }
  } else {
    guidance = "Address general life challenges and personal growth.";
  }

  // Adjust response length based on user message length
  const isShortMessage = userMessage.trim().length < 20;
  const lengthInstruction = isShortMessage
    ? "Respond naturally and concisely, just a few sentences."
    : "Provide detailed, helpful, and empathetic responses (150-400 words).";

  // Build memory context if available
  let memoryContext = "";
  if (conversationHistory?.memory) {
    const memory = conversationHistory.memory;
    if (memory.keyTopics?.length > 0) {
      memoryContext += `\nREMEMBER: Previous topics discussed: ${memory.keyTopics.join(', ')}.`;
    }
    if (memory.userMentions) {
      if (memory.userMentions.mentionedNames?.length > 0) {
        memoryContext += ` User mentioned these names: ${memory.userMentions.mentionedNames.join(', ')}.`;
      }
      if (memory.userMentions.mentionedPlaces?.length > 0) {
        memoryContext += ` Places mentioned: ${memory.userMentions.mentionedPlaces.join(', ')}.`;
      }
    }
    if (memory.importantMessages?.length > 0) {
      const recentImportant = memory.importantMessages.slice(-2);
      memoryContext += `\nIMPORTANT CONTEXT: ${recentImportant.map(msg =>
        `User said: "${msg.userMessage.substring(0, 100)}..."`
      ).join(' ')}`;
    }
  }

  // Add conversation summary if available
  let summaryContext = "";
  if (conversationHistory?.summary) {
    summaryContext = `\nCONVERSATION SUMMARY: ${conversationHistory.summary}`;
  }

  // Add recent message history for context
  let historyContext = "";
  if (conversationHistory?.messages?.length > 1) {
    const recentMessages = conversationHistory.messages.slice(-6); // Last 6 messages
    historyContext = "\nRECENT CONVERSATION:\n" + recentMessages.map(msg =>
      `${msg.sender === 'USER' ? user.name : 'Dr. Maya'}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`
    ).join('\n');
  }

  return `
You are Dr. Maya, a compassionate mental health expert.

USER: ${user.name}${user.gender ? `, ${user.gender}` : ''}

INSTRUCTIONS:
- Use ${user.name}'s name naturally in your responses.
- ${guidance}
- ${lengthInstruction}
- Be warm, empathetic, and professional.
- Give practical advice and coping strategies when appropriate.
- Ask follow-up questions to help the user reflect.
- Do not mention the user's age unless specifically asked.
- Use formatting such as paragraphs, bullet points, or numbered lists when helpful for clarity.
- Reference previous conversations naturally when relevant.
${memoryContext}${summaryContext}${historyContext}

Respond personally and thoughtfully to ${user.name}'s message, taking into account our conversation history.
`;
}

// Main function to generate personalized response with memory
export async function generateText(userId: string, userMessage: string, conversationHistory?: any): Promise<string> {
  try {
    // Fetch user data
    const user = await getUserData(userId);
    if (!user) {
      return "I'm sorry, I couldn't find your profile. Please make sure you're logged in.";
    }

    // Create AI model
    const model = genAi.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    });

    // Create personalized prompt with memory context
    const systemPrompt = createSystemPrompt(user, userMessage, conversationHistory);
    const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Error generating text:", error);
    return "I'm sorry, I'm having trouble responding right now. Please try again later or consult a professional.";
  }
}
