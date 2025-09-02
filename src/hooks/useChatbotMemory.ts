// hooks/useChatbotMemory.ts - Custom hook for chatbot memory features
"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

interface MemoryData {
    keyTopics?: string[];
    userMentions?: {
        mentionedNames?: string[];
        mentionedPlaces?: string[];
        mentionedAge?: number;
    };
    importantMessages?: Array<{
        timestamp: string;
        userMessage: string;
        botResponse: string;
        importance: number;
    }>;
    messageCount?: number;
    lastUpdated?: string;
}

interface ConversationMemory {
    summary?: string;
    memory?: MemoryData;
}

export function useChatbotMemory(conversationId?: string) {
    const trpc = useTRPC();

    // Get conversation with memory using correct tRPC pattern
    const conversationQuery = useQuery({
        ...trpc.chatbot.getConversation.queryOptions({
            conversationId: conversationId!
        }),
        enabled: !!conversationId,
        staleTime: 30000, // Consider data fresh for 30 seconds
    });

    // Get all user conversations
    const allConversationsQuery = useQuery({
        ...trpc.chatbot.getUserConversations.queryOptions(),
        staleTime: 60000, // Consider data fresh for 1 minute
    });

    const conversation = conversationQuery.data;
    const allConversations = allConversationsQuery.data;

    // Extract memory data
   const memoryData = (conversation?.memory ?? {}) as MemoryData;

    const summary = conversation?.summary;

    // Helper functions
    const getKeyTopics = () => memoryData.keyTopics || [];

    const getImportantMessages = () => memoryData.importantMessages || [];

    const getUserMentions = () => memoryData.userMentions || {};

    const getMessageCount = () => memoryData.messageCount || 0;

    const getLastUpdated = () => memoryData.lastUpdated ? new Date(memoryData.lastUpdated) : null;

    // Get conversation insights
    const getConversationInsights = () => {
        const topics = getKeyTopics();
        const importantMsgs = getImportantMessages();
        const mentions = getUserMentions();

        return {
            totalMessages: getMessageCount(),
            mainTopics: topics.slice(0, 5), // Top 5 topics
            highImportanceMessages: importantMsgs.filter(msg => msg.importance >= 7),
            mentionedPeople: mentions.mentionedNames || [],
            mentionedPlaces: mentions.mentionedPlaces || [],
            userAge: mentions.mentionedAge,
            lastActivity: getLastUpdated(),
            summary
        };
    };

    // Get recent conversation patterns
    const getRecentPatterns = () => {
        if (!allConversations) return null;

        const recentConversations = allConversations.slice(0, 5);
        const allTopics: string[] = [];

        recentConversations.forEach((conv: any) => {
            const convMemory = conv.memory as MemoryData;
            if (convMemory?.keyTopics) {
                allTopics.push(...convMemory.keyTopics);
            }
        });

        // Count topic frequency
        const topicCounts: Record<string, number> = {};
        allTopics.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });

        const sortedTopics = Object.entries(topicCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10);

        return {
            frequentTopics: sortedTopics,
            totalConversations: allConversations.length,
            recentConversations: recentConversations.map((conv: any) => ({
                id: conv.id,
                title: conv.title,
                messageCount: conv._count?.messages || 0,
                lastUpdated: conv.updatedAt,
                summary: conv.summary
            }))
        };
    };

    return {
        // Data
        conversation,
        allConversations,
        memoryData,
        summary,

        // Loading states
        isLoading: conversationQuery.isLoading,
        isLoadingAll: allConversationsQuery.isLoading,
        error: conversationQuery.error || allConversationsQuery.error,

        // Helper functions
        getKeyTopics,
        getImportantMessages,
        getUserMentions,
        getMessageCount,
        getLastUpdated,
        getConversationInsights,
        getRecentPatterns
    };
}
