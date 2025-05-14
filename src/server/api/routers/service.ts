import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const serviceRouter = createTRPCRouter({
  getServicesByBusinessId: protectedProcedure
    .input(z.object({ bussinesId: z.number() }))
    .query(({ ctx, input }) => {
      const services = ctx.db.businessService.findMany({
        where: {
          businessId: input.bussinesId,
        },
        include: {
          service: true,
        },
      });
      return services;
    }),
});
