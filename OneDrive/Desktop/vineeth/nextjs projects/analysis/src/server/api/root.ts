import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { projectRouter } from "./routers/project";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
//this is the place where all the routes will be written here.
//in trpc root route we have many subroutes, like projectRouter and postRouter and userRouter
export const appRouter = createTRPCRouter({
  post: postRouter,
  project: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
