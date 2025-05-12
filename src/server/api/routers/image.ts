import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getImagesByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const images = await ctx.db.image.findMany({
        where: {
          businessId: input.businessId,
        },
      });

      return images;
    }),
});
