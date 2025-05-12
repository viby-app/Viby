import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const businessRouter = createTRPCRouter({
  getAllBusinesses: protectedProcedure.query(async ({ ctx }) => {
    const businesses = await ctx.db.business.findMany({
      orderBy: { createdAt: "desc" },
    });

    return businesses;
  }),

  getFollowedBusinessesByUser: protectedProcedure.query(async ({ ctx }) => {
    const businesses = await ctx.db.businessFollowing.findMany({
      where: {
        follower: {
          id: ctx.session.user.id,
        },
      },
      select: {
        business: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return businesses;
  }),
  getBusinessById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const business = await ctx.db.business.findUnique({
        where: {
          id: input.id,
        },
      });
      return business;
    }),
});
