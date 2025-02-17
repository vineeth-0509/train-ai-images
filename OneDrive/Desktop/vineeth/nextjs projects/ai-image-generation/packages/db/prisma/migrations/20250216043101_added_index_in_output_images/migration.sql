/*
  Warnings:

  - A unique constraint covering the columns `[falAiRequestId]` on the table `OutputImages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OutputImages_falAiRequestId_key" ON "OutputImages"("falAiRequestId");
