// types/chat.ts
export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
}

export interface ChatbotFormProps {
    chat?: any;
    conversationId?: string;
}

export interface ConversationState {
    messages: Message[];
    currentConversationId: string | undefined;
    isTyping: boolean;
    isFocused: boolean;
    charCount: number;
}