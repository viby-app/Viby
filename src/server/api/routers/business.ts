import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const businessRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const business = await ctx.db.business.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return business ?? null;
  }),
});
