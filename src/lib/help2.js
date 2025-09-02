import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/api';
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  createdAt: Date;
}

import { ConversationState, Message } from "@/types/types";

const ChatInterface: React.FC = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // Get conversation ID from URL if it exists
  const { conversationId: urlConversationId } = router.query;

  // tRPC mutations and queries
  const createConversation = trpc.chatbot.createConversation.useMutation();
  const generateResponse = trpc.chatbot.generateResponse.useMutation();
  
  // Query to load existing conversation if ID is in URL
  const { data: existingConversation, isLoading: loadingConversation } = trpc.chatbot.getConversation.useQuery(
    { conversationId: urlConversationId as string },
    { 
      enabled: !!urlConversationId && typeof urlConversationId === 'string',
      onSuccess: (data) => {
        setConversationId(data.id);
        setMessages(data.messages.map(msg => ({
          id: msg.id,
          message: msg.message,
          isUser: msg.isUser,
          createdAt: msg.createdAt
        })));
      }
    }
  );

  // Auto-generate title from first message
  const generateTitle = (firstMessage: string): string => {
    // Take first 50 characters and add ellipsis if longer
    const title = firstMessage.length > 50 
      ? firstMessage.substring(0, 50) + '...' 
      : firstMessage;
    return title;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      let currentConversationId = conversationId;

      // If no conversation exists, create one (first message)
      if (!currentConversationId) {
        const newConversation = await createConversation.mutateAsync({
          title: generateTitle(userMessage)
        });
        
        currentConversationId = newConversation.id;
        setConversationId(currentConversationId);
        
        // Update URL with new conversation ID
        router.push(`/c/${currentConversationId}`, undefined, { shallow: true });
      }

      // Add user message to UI immediately
      const tempUserMessage: Message = {
        id: `temp-user-${Date.now()}`,
        message: userMessage,
        isUser: true,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, tempUserMessage]);

      // Generate AI response
      const result = await generateResponse.mutateAsync({
        conversationId: currentConversationId,
        message: userMessage
      });

      // Update messages with the real saved message and AI response
      setMessages(prev => {
        // Remove temp message and add real ones
        const withoutTemp = prev.filter(msg => msg.id !== tempUserMessage.id);
        return [
          ...withoutTemp,
          {
            id: result.message.id,
            message: userMessage,
            isUser: true,
            createdAt: new Date()
          },
          {
            id: result.message.id + '_ai',
            message: result.response,
            isUser: false,
            createdAt: new Date()
          }
        ];
      });

    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
      // Show error message
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setInput('');
    router.push('/', undefined, { shallow: true });
  };

  // Show loading for existing conversations
  if (loadingConversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Dr. Maya - Mental Health Assistant
          </h1>
          <button
            onClick={startNewConversation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            // Welcome screen (like ChatGPT's initial state)
            <div className="text-center py-20">
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🧠</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Hello! I'm Dr. Maya
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Your compassionate mental health assistant. How can I help you today?
                </p>
              </div>
              
              {/* Suggested prompts */}
              <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  "I'm feeling anxious about work",
                  "How can I manage stress better?",
                  "I'm having trouble sleeping",
                  "I need help with self-confidence"
                ].map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl p-4 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {message.isUser ? (
                    <p className="whitespace-pre-wrap">{message.message}</p>
                  ) : (
                    <MarkdownRenderer 
                      content={message.message} 
                      className="text-gray-900 dark:text-gray-100"
                    />
                  )}
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Dr. Maya is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;