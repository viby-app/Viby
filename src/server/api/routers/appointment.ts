import { z } from "zod";
import dayjs from "~/utils/dayjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const appointmetRouter = createTRPCRouter({
  createAppointment: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        businessId: z.number(),
        serviceId: z.number(),
        workerId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const appointment = ctx.db.appointment.create({
        data: {
          workerId: input.workerId,
          status: "BOOKED",
          date: dayjs(input.date).utc().toDate(),
          businessId: input.businessId,
          serviceId: input.serviceId,
          userId: ctx.session.user.id,
        },
      });

      return appointment;
    }),
  getAppointmentsByOwnerId: protectedProcedure
    .input(
      z.object({
        ownerId: z.string(),
        date: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const business = await ctx.db.business.findFirst({
        where: { ownerId: input.ownerId },
      });

      if (!business) {
        throw new Error("Business not found for the given owner ID");
      }

      const startOfDay = dayjs(input.date)
        .tz("Asia/Jerusalem")
        .startOf("day")
        .toDate();
      const endOfDay = dayjs(input.date)
        .tz("Asia/Jerusalem")
        .endOf("day")
        .toDate();

      const appointments = await ctx.db.appointment.findMany({
        orderBy: {
          date: "asc",
        },
        where: {
          businessId: business.id,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          worker: {
            select: {
              Worker: {
                select: {
                  name: true,
                },
              },
            },
          },
          service: true,
          user: true,
        },
      });

      return appointments;
    }),
  deleteAppointment: protectedProcedure
    .input(z.object({ appointmentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const appointment = await ctx.db.appointment.findUnique({
        where: { id: input.appointmentId },
      });

      if (!appointment) {
        throw new Error("Appointment not found");
      }

      await ctx.db.appointment.delete({
        where: { id: input.appointmentId },
      });

      return { success: true, message: "Appointment deleted successfully" };
    }),
});
