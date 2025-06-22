import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workersRouter = createTRPCRouter({
  createWorker: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        userId: z.string(),
        wage: z.number().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const worker = await ctx.db.workers.create({
        data: {
          businessId: input.businessId,
          userId: input.userId,
          wage: input.wage,
        },
        include: {
          Worker: true,
        },
      });

      return worker;
    }),

  getAllWorkersByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const workers = await ctx.db.workers.findMany({
        where: {
          businessId: input.businessId,
        },
        include: {
          Worker: true,
        },
      });

      return workers.map((worker) => {
        return {
          id: worker.id,
          name: worker.Worker.name,
          businessId: worker.businessId,
          wage: worker.wage,
        };
      });
    }),
});
