import { Gender, Role } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    return user;
  }),
  searchUserByPhone: protectedProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          phone: input.phone,
        },
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
          image: true,
        },
      });

      return user;
    }),
  getUserFriends: protectedProcedure.query(async ({ ctx }) => {
    const linkedUsers = await ctx.db.userConnection.findMany({
      where: {
        OR: [
          { userConnectionA: ctx.session.user.id },
          { userConnectionB: ctx.session.user.id },
        ],
      },
    });

    return linkedUsers;
  }),
  getUserBusinesses: protectedProcedure.query(async ({ ctx }) => {
    const businesses = await ctx.db.business.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });

    return businesses;
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
        },
      });

      return updatedUser;
    }),
  updateImage: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          image: input.image,
        },
      });

      return updatedUser;
    }),
  firstLoginUpdateUser: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(6).max(15),
        role: z.enum([Role.USER, Role.BUSINESS_OWNER, Role.ADMIN]),
        name: z.string().min(2, "Name is required"),
        gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          phone: input.phone,
          role: input.role,
          name: input.name,
          gender: input.gender,
        },
      });
    }),
  getRecommendedUsers: protectedProcedure.query(async ({ ctx }) => {
    const userFriends = await ctx.db.userConnection.findMany({
      where: {
        OR: [
          { userConnectionA: ctx.session.user.id },
          { userConnectionB: ctx.session.user.id },
        ],
      },
      select: {
        userConnectionA: true,
        userConnectionB: true,
      },
    });

    const friendsIds = userFriends.flatMap((connection) => [
      connection.userConnectionA,
      connection.userConnectionB,
    ]);

    const recommendedUsers = await ctx.db.user.findMany({
      where: {
        id: {
          notIn: [ctx.session.user.id, ...friendsIds],
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        image: true,
      },
    });

    return recommendedUsers;
  }),
  createUserConnection: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingConnection = await ctx.db.userConnection.findFirst({
        where: {
          OR: [
            {
              userConnectionA: ctx.session.user.id,
              userConnectionB: input.userId,
            },
            {
              userConnectionA: input.userId,
              userConnectionB: ctx.session.user.id,
            },
          ],
        },
      });

      if (existingConnection) {
        throw new Error("Connection already exists");
      }

      const newConnection = await ctx.db.userConnection.create({
        data: {
          userConnectionA: ctx.session.user.id,
          userConnectionB: input.userId,
        },
      });

      return newConnection;
    }),
});
