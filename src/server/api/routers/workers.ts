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

  getBusinessWorkersWithUserInfo: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const workers = await ctx.db.workers.findMany({
        where: {
          businessId: input.businessId,
        },
        include: {
          Worker: {
            select: {
              id: true, // userId
              name: true,
              phone: true,
            },
          },
        },
      });

      return workers.map((worker) => {
        if (!worker.Worker.phone) {
          throw new Error(`Missing phone for worker ${worker.Worker.name}`);
        }

        return {
          id: worker.id,
          name: worker.Worker.name,
          phone: worker.Worker.phone,
          userId: worker.Worker.id,
          wage: worker.wage,
          businessId: worker.businessId,
        };
      });
    }),
});
