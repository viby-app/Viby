import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const appointmetRouter = createTRPCRouter({
  createAppointment: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        businessId: z.number(),
        serviceId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const appointment = ctx.db.appointment.create({
        data: {
          status: "BOOKED",
          date: dayjs(input.date).utc().toDate(),
          businessId: input.businessId,
          serviceId: input.serviceId,
          userId: ctx.session.user.id,
        },
      });

      return appointment;
    }),
});
