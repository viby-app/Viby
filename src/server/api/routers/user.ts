import { Role } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(
      z.object({
        phone: z.string().min(6).max(15),
        role: z.enum([Role.USER, Role.BUSINESS_OWNER, Role.ADMIN]),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          phone: input.phone,
          role: input.role,
        },
      });
    }),
});
