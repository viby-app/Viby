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
});
