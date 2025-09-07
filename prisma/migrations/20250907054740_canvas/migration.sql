-- CreateTable
CREATE TABLE "public"."Mood" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "date" TEXT NOT NULL,
    "mood" TEXT NOT NULL,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mood_userId_idx" ON "public"."Mood"("userId");

-- CreateIndex
CREATE INDEX "Mood_date_idx" ON "public"."Mood"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_date_userId_key" ON "public"."Mood"("date", "userId");

-- AddForeignKey
ALTER TABLE "public"."Mood" ADD CONSTRAINT "Mood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
