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
                workerId: z.number()
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
            orderBy: {
                date: "desc",
            },
        });

        return appointment;
    }),
});