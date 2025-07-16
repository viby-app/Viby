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
    getLastAppointmentByUserId: protectedProcedure.input(z.object({ userId: z.string() })).query(async ({ ctx, input }) => {
        const appointment = await ctx.db.appointment.findFirst({
            where: {
                userId: input.userId,
            },
            include: {
                service: {
                    select: {
                        name: true
                    }
                },
                business: {
                    select: {
                        name: true,
                        logo: true
                    }
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        return appointment;
    }),
  getAppointmentsByOwnerOrWorkerId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        startUtc: z.string(),
        endUtc: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const business = await ctx.db.business.findFirst({
        where: {
          OR: [
            { ownerId: input.userId },
            {
              workers: {
                some: {
                  Worker: {
                    id: input.userId,
                  },
                },
              },
            },
          ],
        },
      });

      if (!business) {
        throw new Error("Business not found for the given owner ID");
      }

      const appointments = await ctx.db.appointment.findMany({
        orderBy: {
          date: "asc",
        },
        where: {
          businessId: business.id,
          date: {
            gte: new Date(input.startUtc),
            lte: new Date(input.endUtc),
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
          service: {
            select: {
              durationMinutes: true,
              name: true,
              id: true,
              price: true,
            },
          },
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
