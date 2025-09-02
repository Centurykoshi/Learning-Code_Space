// lib/memory-utils.ts - Memory and importance calculation utilities
import prisma from "@/lib/prisma";

// Helper function to calculate importance score based on message content
export function calculateImportanceScore(message: string): number {
    const importantKeywords = [
        'crisis', 'emergency', 'suicide', 'harm', 'depression', 'anxiety', 'panic', 'trauma',
        'abuse', 'medication', 'therapy', 'breakthrough', 'progress', 'goal', 'challenge',
        'family', 'relationship', 'work', 'stress', 'sleep', 'eating', 'addiction'
    ];

    const urgentKeywords = [
        'urgent', 'help', 'scared', 'desperate', 'crisis', 'emergency', 'immediate'
    ];

    const lowerMessage = message.toLowerCase();
    let score = 5; // Base score

    // Check for important keywords
    importantKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            score += 1;
        }
    });

    // Check for urgent keywords
    urgentKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            score += 2;
        }
    });

    // Message length factor
    if (message.length > 200) score += 1;
    if (message.length > 500) score += 1;

    // Cap the score between 1 and 10
    return Math.min(Math.max(score, 1), 10);
}

// Helper function to extract key topics from messages
export function extractKeyTopics(userMessage: string, botResponse: string): string[] {
    const topicKeywords = [
        'work', 'family', 'relationship', 'health', 'anxiety', 'depression', 'stress',
        'sleep', 'eating', 'exercise', 'medication', 'therapy', 'goals', 'career',
        'friends', 'school', 'money', 'future', 'past', 'trauma', 'addiction'
    ];

    const foundTopics: string[] = [];
    const combinedText = (userMessage + ' ' + botResponse).toLowerCase();

    topicKeywords.forEach(topic => {
        if (combinedText.includes(topic)) {
            foundTopics.push(topic);
        }
    });

    return foundTopics;
}

// Helper function to extract user mentions (names, places, etc.)
export function extractUserMentions(message: string): Record<string, any> {
    const mentions: Record<string, any> = {};

    // Simple regex patterns for common mentions
    const namePattern = /(?:my|I'm|called|name is)\s+([A-Z][a-z]+)/gi;
    const locationPattern = /(?:in|from|live in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi;
    const agePattern = /(?:I'm|I am|age)\s+(\d{1,3})\s*(?:years?\s+old)?/gi;

    let match;

    // Extract names
    while ((match = namePattern.exec(message)) !== null) {
        mentions.mentionedNames = mentions.mentionedNames || [];
        mentions.mentionedNames.push(match[1]);
    }

    // Extract locations
    while ((match = locationPattern.exec(message)) !== null) {
        mentions.mentionedPlaces = mentions.mentionedPlaces || [];
        mentions.mentionedPlaces.push(match[1]);
    }

    // Extract age
    while ((match = agePattern.exec(message)) !== null) {
        mentions.mentionedAge = parseInt(match[1]);
    }

    return mentions;
}

// Helper function to generate conversation summary
export async function generateConversationSummary(messages: any[]): Promise<string> {
    try {
        const recentMessages = messages.slice(-10); // Last 10 messages
        const messageText = recentMessages.map(m =>
            `${m.sender}: ${m.content}`
        ).join('\n');

        // This would ideally use AI to generate a summary
        // For now, return a simple summary
        const topicCounts: Record<string, number> = {};
        const allText = messageText.toLowerCase();

        ['anxiety', 'depression', 'stress', 'work', 'family', 'relationship', 'sleep', 'health'].forEach(topic => {
            const count = (allText.match(new RegExp(topic, 'g')) || []).length;
            if (count > 0) topicCounts[topic] = count;
        });

        const mainTopics = Object.entries(topicCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([topic]) => topic);

        return `Recent conversation focused on: ${mainTopics.join(', ')}. ${recentMessages.length} messages exchanged.`;
    } catch (error) {
        console.error('Error generating summary:', error);
        return 'Conversation summary unavailable';
    }
}

// Helper function to update conversation memory and summary
export async function updateConversationMemory(conversationId: string, messages: any[], newUserMessage: string, newBotResponse: string) {
    try {
        // Get current memory
        const conversation = await prisma.chatbotConversation.findUnique({
            where: { id: conversationId },
            select: { memory: true, summary: true }
        });

        const currentMemory = conversation?.memory as any || {};

        // Extract key topics and themes from the new messages
        const keyTopics = extractKeyTopics(newUserMessage, newBotResponse);
        const userMentions = extractUserMentions(newUserMessage);

        // Update memory structure
        const updatedMemory = {
            ...currentMemory,
            lastUpdated: new Date().toISOString(),
            keyTopics: [...(currentMemory.keyTopics || []), ...keyTopics].slice(-10), // Keep last 10 topics
            userMentions: { ...currentMemory.userMentions, ...userMentions },
            importantMessages: [
                ...(currentMemory.importantMessages || []),
                {
                    timestamp: new Date().toISOString(),
                    userMessage: newUserMessage,
                    botResponse: newBotResponse,
                    importance: calculateImportanceScore(newUserMessage)
                }
            ].slice(-5), // Keep last 5 important messages
            messageCount: (currentMemory.messageCount || 0) + 2
        };

        // Generate summary if conversation has enough messages
        let updatedSummary = conversation?.summary;
        if (messages.length > 5 && messages.length % 10 === 0) {
            updatedSummary = await generateConversationSummary(messages);
        }

        // Update the conversation
        await prisma.chatbotConversation.update({
            where: { id: conversationId },
            data: {
                memory: updatedMemory,
                summary: updatedSummary,
                updatedAt: new Date()
            }
        });
    } catch (error) {
        console.error('Error updating conversation memory:', error);
        // Don't throw error to avoid breaking the main flow
    }
}
