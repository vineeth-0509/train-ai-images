import { PrismaClient } from "@prisma/client";
let count: number = 0;
export const prismaClient = new PrismaClient();
console.log(`connection is increased to: ${count}`);
