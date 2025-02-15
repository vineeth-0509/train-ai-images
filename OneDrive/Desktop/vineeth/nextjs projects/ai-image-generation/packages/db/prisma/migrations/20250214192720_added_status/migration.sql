/*
  Warnings:

  - You are about to drop the column `UserId` on the `OutputImages` table. All the data in the column will be lost.
  - Added the required column `prompt` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OutputImageStatusEnum" AS ENUM ('Pending', 'Generated');

-- AlterTable
ALTER TABLE "OutputImages" DROP COLUMN "UserId",
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "status" "OutputImageStatusEnum" NOT NULL DEFAULT 'Pending';
