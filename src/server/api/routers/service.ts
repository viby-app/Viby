import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const serviceRouter = createTRPCRouter({
  getServicesByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(({ ctx, input }) => {
      const services = ctx.db.businessService.findMany({
        where: {
          businessId: input.businessId,
        },
        include: {
          service: true,
        },
      });
      return services;
    }),
});
