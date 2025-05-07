import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
});
