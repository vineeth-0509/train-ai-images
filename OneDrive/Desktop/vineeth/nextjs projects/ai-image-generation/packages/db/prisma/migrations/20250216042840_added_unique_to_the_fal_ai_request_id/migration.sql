/*
  Warnings:

  - A unique constraint covering the columns `[falAiRequestId]` on the table `Model` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Model_falAiRequestId_key" ON "Model"("falAiRequestId");
