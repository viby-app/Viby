import { profile } from "console";
import { businessRouter } from "~/server/api/routers/business";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { imageRouter } from "./routers/image";
import { profileRouter } from "./routers/profile";

export const appRouter = createTRPCRouter({
  image: imageRouter,
  business: businessRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
