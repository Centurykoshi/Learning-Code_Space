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
      guidance = "Use very simple, friendly language like talking to a young friend.";
    } else if (user.age < 18) {
      guidance = "Be encouraging and relatable, like a supportive older sibling.";
    } else if (user.age < 30) {
      guidance = "Talk about career, relationships, and life challenges in a casual, understanding way.";
    } else if (user.age < 50) {
      guidance = "Focus on work-life balance and personal growth with mature understanding.";
    } else {
      guidance = "Be respectful and thoughtful about life experiences and wisdom.";
    }
  } else {
    guidance = "Be supportive and understanding about general life challenges.";
  }

  // Analyze the user message to determine response style
  const messageLength = userMessage.trim().length;
  const isGreeting = /^(hi|hello|hey|sup|good morning|good afternoon|good evening)\b/i.test(userMessage.trim());
  const isShortResponse = /^(yes|no|ok|okay|sure|thanks|thank you|bye|goodbye)\b/i.test(userMessage.trim());
  const isEmotional = /\b(sad|angry|frustrated|depressed|anxious|worried|scared|happy|excited|great|amazing)\b/i.test(userMessage);
  const isQuestion = userMessage.includes('?');

  let responseStyle = "";
  if (isGreeting) {
    responseStyle = "Respond with a warm, casual greeting. Ask how they're doing or how their day is going. Keep it brief and friendly.";
  } else if (isShortResponse) {
    responseStyle = "Give a brief, natural response that acknowledges what they said and gently encourages more conversation.";
  } else if (messageLength < 20) {
    responseStyle = "Keep your response short and conversational, like texting a friend. 1-2 sentences max.";
  } else if (isEmotional) {
    responseStyle = "Show empathy and understanding. Ask follow-up questions to help them explore their feelings. Be supportive but not overwhelming.";
  } else if (isQuestion) {
    responseStyle = "Answer their question directly and conversationally. Add a gentle follow-up if appropriate.";
  } else {
    responseStyle = "Respond naturally and thoughtfully. Match their energy level and provide helpful insights when appropriate.";
  }

  // Build memory context if available
  let memoryContext = "";
  if (conversationHistory?.memory) {
    const memory = conversationHistory.memory;
    if (memory.keyTopics?.length > 0) {
      memoryContext += `\nYou've talked about: ${memory.keyTopics.slice(-3).join(', ')}.`;
    }
    if (memory.userMentions?.mentionedNames?.length > 0) {
      memoryContext += ` They mentioned: ${memory.userMentions.mentionedNames.slice(-2).join(', ')}.`;
    }
  }

  // Add recent conversation context
  let recentContext = "";
  if (conversationHistory?.messages?.length > 1) {
    const lastMessage = conversationHistory.messages[conversationHistory.messages.length - 2];
    if (lastMessage) {
      recentContext = `\nLast time they said: "${lastMessage.content.substring(0, 100)}..."`;
    }
  }

  return `
You are a friendly, supportive AI companion helping ${user.name}. You're like a caring friend who listens and offers genuine support.

ABOUT ${user.name}: ${user.gender ? `${user.gender}, ` : ''}${user.name}

YOUR PERSONALITY:
- Warm, genuine, and conversational
- Never robotic or overly formal
- Use ${user.name}'s name naturally but not excessively
- ${guidance}
- Match their communication style and energy

RESPONSE STYLE:
${responseStyle}

IMPORTANT RULES:
- Don't introduce yourself as "Dr. Maya" or any specific title
- Don't mention being an AI unless asked directly
- Avoid therapy-speak or overly clinical language
- Be authentic and human-like in your responses
- Use natural conversation flow
- Ask questions when it feels right, not forced
${memoryContext}${recentContext}

Respond to ${user.name} as a supportive friend would, keeping the conversation natural and flowing.
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

    // Create AI model with more conversational settings
    const model = genAi.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8, // Increased for more natural, varied responses
        maxOutputTokens: 1000, // Reduced for more concise responses
        topP: 0.9, // Added for more natural language flow
        topK: 40, // Added for better word choice variety
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


export async function generatetypingtext(mode: "Story" | "Affirmation", time: number): Promise<string> {
  try {
    const model = genAi.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const targetWords = Math.max(50, Math.floor((time * 80) / 60));
    let prompt: string;

    if (mode === "Story") {
      prompt = `Generate a ${targetWords}-word engaging short story suitable for typing practice. 
      The story should be:
      - Interesting and motivational
      - Use common, everyday vocabulary (avoid complex technical terms)
      - Include a good mix of punctuation (periods, commas, apostrophes, quotation marks)
      - Use varied sentence lengths (mix of short and medium sentences)
      - Include contractions naturally (don't, can't, it's, won't)
      - Feature both uppercase and lowercase letters in natural contexts
      - Include numbers when they fit naturally in the story
      - Flow naturally for typing practice without awkward phrasing
      - Avoid excessive repetition of the same words
      - Be exactly ${targetWords} words
      
      Create content that helps practice different typing skills while remaining engaging.
      Just return the story text without any formatting or extra explanation.`;
    } else {
      prompt = `Generate ${targetWords} words of positive affirmations and motivational content for typing practice.
      The content should be:
      - Uplifting and encouraging
      - Use simple, clear everyday language
      - Include proper punctuation (periods, commas, apostrophes)
      - Use varied sentence lengths for good typing rhythm
      - Include contractions naturally (you're, I'm, we'll, don't)
      - Flow well for typing practice with natural phrasing
      - Include both positive statements and actionable advice
      - Avoid repetitive phrases or words
      - Be exactly ${targetWords} words
      
      Format as flowing paragraphs of affirmations and motivational thoughts.
      Just return the text without any formatting or extra explanation.`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();


    const wordCount = text.split(/\s+/).length;
    if (wordCount < targetWords * 0.8) {
      console.warn("Generated text has :" + wordCount + " words, target was " + targetWords);
    }

    return text;

  }
  catch (error) {
    console.error("Error generating typing text : ", error);
    throw new Error("Failed to generate typing content. Please check your Api Configuration");
  }

}
