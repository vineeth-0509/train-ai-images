/*
  Warnings:

  - Added the required column `userId` to the `OutputImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OutputImages" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "imageUrl" SET DEFAULT '';
