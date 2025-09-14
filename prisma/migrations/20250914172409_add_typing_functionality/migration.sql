-- CreateTable
CREATE TABLE "public"."typing_content" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "characterCount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "typing_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."typing_sessions" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeSpent" INTEGER NOT NULL,
    "wordsPerMinute" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "correctCharacters" INTEGER NOT NULL,
    "incorrectCharacters" INTEGER NOT NULL,
    "totalCharacters" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    CONSTRAINT "typing_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "typing_content_userId_idx" ON "public"."typing_content"("userId");

-- CreateIndex
CREATE INDEX "typing_sessions_userId_idx" ON "public"."typing_sessions"("userId");

-- CreateIndex
CREATE INDEX "typing_sessions_contentId_idx" ON "public"."typing_sessions"("contentId");

-- AddForeignKey
ALTER TABLE "public"."typing_content" ADD CONSTRAINT "typing_content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_sessions" ADD CONSTRAINT "typing_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."typing_sessions" ADD CONSTRAINT "typing_sessions_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "public"."typing_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
