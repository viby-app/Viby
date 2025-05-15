import { z } from "zod";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
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
  getBusinessTimesById: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const businessTimes = await ctx.db.openingHours.findMany({
        where: {
          businessId: input.businessId,
        },
        orderBy: {
          dayOfWeek: "asc",
        },
      });
      return businessTimes;
    }),
  addFollowerBusiness: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingFollow = await ctx.db.businessFollowing.findFirst({
        where: {
          businessId: input.businessId,
          followerId: input.userId,
        },
      });
      if (existingFollow) {
        throw new Error("User is already following this business");
      }
      const business = await ctx.db.businessFollowing.create({
        data: {
          businessId: input.businessId,
          followerId: input.userId,
        },
      });
      return business;
    }),
  isUserFollowingBusiness: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const follow = await ctx.db.businessFollowing.findFirst({
        where: {
          businessId: input.businessId,
          followerId: input.userId,
        },
      });
      return follow !== null;
    }),
  removeFollowerBusiness: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.businessFollowing.delete({
        where: {
          followerId_businessId: {
            followerId: input.userId,
            businessId: input.businessId,
          },
        },
      });
    }),
  getAvailableTimes: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        date: z.date(), // local date (without time) from frontend
        serviceId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Assume input.date is a date at midnight in local time — convert to dayjs in local and then to UTC
      const dateLocal = dayjs(input.date);
      const inputDateUTC = dateLocal.utc();

      const dayOfWeek = dateLocal.day(); // still use local day of week (business logic)

      const startOfDayUTC = inputDateUTC.startOf("day");
      const endOfDayUTC = inputDateUTC.endOf("day");

      const [openingHours, closedDay, services, appointments] =
        await Promise.all([
          ctx.db.openingHours.findUnique({
            where: {
              businessId_dayOfWeek: { businessId: input.businessId, dayOfWeek },
            },
          }),
          ctx.db.closedDay.findFirst({
            where: {
              businessId: input.businessId,
              date: {
                gte: startOfDayUTC.toDate(),
                lte: endOfDayUTC.toDate(),
              },
            },
          }),
          ctx.db.businessService.findMany({
            where: { businessId: input.businessId },
            include: { service: true },
          }),
          ctx.db.appointment.findMany({
            where: {
              businessId: input.businessId,
              date: {
                gte: startOfDayUTC.toDate(),
                lte: endOfDayUTC.toDate(),
              },
            },
          }),
        ]);

      if (!openingHours || closedDay) return [];

      // Convert business open/close times into UTC for that day
      const openTimeUTC = startOfDayUTC
        .hour(openingHours.openTime.getHours())
        .minute(openingHours.openTime.getMinutes());

      const closeTimeUTC = startOfDayUTC
        .hour(openingHours.closeTime.getHours())
        .minute(openingHours.closeTime.getMinutes());

      const shortestDuration = Math.min(
        ...services.map((bs) => bs.service.durationMinutes),
      );

      const intervals: string[] = [];

      for (
        let time = openTimeUTC.clone();
        time.add(shortestDuration, "minute").isBefore(closeTimeUTC);
        time = time.add(shortestDuration, "minute")
      ) {
        const timeStart = time;
        const timeEnd = timeStart.add(shortestDuration, "minute");

        const isConflicting = appointments.some((apt) => {
          const aptStart = dayjs.utc(apt.date);
          const aptEnd = aptStart.add(shortestDuration, "minute");
          return aptStart.isBefore(timeEnd) && aptEnd.isAfter(timeStart);
        });

        if (!isConflicting) {
          intervals.push(time.local().format("HH:mm")); 
        }
      }

      return intervals;
    }),
});
