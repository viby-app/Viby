import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const workersRouter = createTRPCRouter({
  getAllWorkersByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const workers = await ctx.db.workers.findMany({
        where: {
          businessId: input.businessId,
        },
      });

      return workers;
    }),
});
