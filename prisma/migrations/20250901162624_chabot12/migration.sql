-- AlterTable
ALTER TABLE "public"."chatbot_conversations" ADD COLUMN     "memory" JSONB,
ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "public"."chatbot_messages" ADD COLUMN     "importance" DOUBLE PRECISION,
ADD COLUMN     "tokenCount" INTEGER;
