
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
      }
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Create personalized system prompt
function createSystemPrompt(User: UserData): string {
  let ageGuidance = "";
  
  if (User.age !== null) {
    if (User.age < 18) {
      ageGuidance = "Use simple, encouraging language. Focus on school and family issues.";
    } else if (User.age < 30) {
      ageGuidance = "Address career, relationships, and life transition challenges.";
    } else if (User.age < 50) {
      ageGuidance = "Focus on work-life balance, family responsibilities, and personal growth.";
    } else {
      ageGuidance = "Consider health, life reflection, and finding continued purpose.";
    }
  } else {
    ageGuidance = "Address general life challenges and personal growth.";
  }

  return `You are Dr. Maya, a compassionate mental health expert. 

USER: ${User.name}, ${User.age ? User.age + ' years old' : 'age not specified'}, ${User.gender || 'gender not specified'}

INSTRUCTIONS:
- Always use ${User.name}'s name in your response
- ${ageGuidance}
- Provide comprehensive, helpful responses (300-600 words)
- Be warm, empathetic, and professional
- Give practical advice and coping strategies
- Ask follow-up questions to help them reflect

Respond as if you're talking to ${User.name} personally, considering their age and background.`;
}

// Main function to generate personalized response
export async function generateText(userId: string, userMessage: string): Promise<string> {
  try {
    // Fetch user data from database
    const User = await getUserData(userId);
    if (!User) {
      return "I'm sorry, I couldn't find your profile. Please make sure you're logged in.";
    }

    // Create AI model
    const model = genAi.getGenerativeModel({
      model: "gemini-2.5-flash", // Use the stable model
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
      },
    });

    // Create personalized system prompt
    const systemPrompt = createSystemPrompt(User);

    // Combine system prompt and user message
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