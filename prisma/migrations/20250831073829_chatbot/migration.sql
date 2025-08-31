-- CreateEnum
CREATE TYPE "public"."MessageSender" AS ENUM ('USER', 'BOT');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'CODE');

-- CreateTable
CREATE TABLE "public"."chatbot_conversations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,

    CONSTRAINT "chatbot_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chatbot_messages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "sender" "public"."MessageSender" NOT NULL,
    "messageType" "public"."MessageType" NOT NULL DEFAULT 'TEXT',
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "chatbot_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chatbot_conversations_userId_idx" ON "public"."chatbot_conversations"("userId");

-- CreateIndex
CREATE INDEX "chatbot_messages_conversationId_idx" ON "public"."chatbot_messages"("conversationId");

-- AddForeignKey
ALTER TABLE "public"."chatbot_conversations" ADD CONSTRAINT "chatbot_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chatbot_messages" ADD CONSTRAINT "chatbot_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."chatbot_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
