import { businessRouter } from "~/server/api/routers/business";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { imageRouter } from "./routers/image";
import { workersRouter } from "./routers/workers";
import { serviceRouter } from "./routers/service";
import { appointmetRouter } from "./routers/appointment";
import { profileRouter } from "./routers/profile";

export const appRouter = createTRPCRouter({
  image: imageRouter,
  business: businessRouter,
  workers: workersRouter,
  service: serviceRouter,
  appointment: appointmetRouter,
  profile: profileRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
