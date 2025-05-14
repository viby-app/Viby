import { businessRouter } from "~/server/api/routers/business";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { imageRouter } from "./routers/image";
import { workersRouter } from "./routers/workers";
import { serviceRouter } from "./routers/service";

export const appRouter = createTRPCRouter({
  image: imageRouter,
  business: businessRouter,
  workers: workersRouter,
  service: serviceRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
