import { z } from "zod";
import dayjs from "dayjs";

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
        date: z.date(),
        serviceId: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const dayjsDate = dayjs(input.date);

        const dayOfWeek = dayjsDate.day();
        const startOfDay = dayjsDate.startOf("day").toDate();
        const endOfDay = dayjsDate.endOf("day").toDate();

        const [openingHours, closedDay, services, appointments] =
          await Promise.all([
            ctx.db.openingHours.findUnique({
              where: {
                businessId_dayOfWeek: {
                  businessId: input.businessId,
                  dayOfWeek,
                },
              },
            }),
            ctx.db.closedDay.findFirst({
              where: {
                businessId: input.businessId,
                date: {
                  gte: startOfDay,
                  lte: endOfDay,
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
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
            }),
          ]);

        if (!openingHours || closedDay) return [];

        const openTime = dayjs(openingHours.openTime);
        const closeTime = dayjs(openingHours.closeTime);

        const shortestDuration = Math.min(
          ...services.map((bs) => bs.service.durationMinutes),
        );

        const intervals: string[] = [];

        for (
          let time = openTime.clone();
          time.add(shortestDuration, "minute").isBefore(closeTime);
          time = time.add(shortestDuration, "minute")
        ) {
          const timeStart = time;

          const isConflicting = appointments.some((apt) => {
            const aptTime = dayjs(apt.date);

            const timeStartInAptDay = aptTime
              .clone()
              .hour(timeStart.hour())
              .minute(timeStart.minute())
              .second(0)
              .millisecond(0);

            const timeEndInAptDay = timeStartInAptDay.add(
              shortestDuration,
              "minute",
            );

            return (
              aptTime.isBefore(timeEndInAptDay) &&
              aptTime.add(shortestDuration, "minute").isAfter(timeStartInAptDay)
            );
          });

          if (!isConflicting) {
            intervals.push(time.tz("Asia/Jerusalem").format("HH:mm"));
          }
        }

        return intervals;
      } catch (error) {
        console.error("getAvailableTimes error:", {
          input,
          error,
        });

        throw new Error(
          "Failed to fetch available times. Please try again later.",
        );
      }
    }),
});
