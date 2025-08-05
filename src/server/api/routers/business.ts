import { z } from "zod";
import dayjs from "~/utils/dayjs";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { completeBusinessSchema } from "~/utils/types";

export const businessRouter = createTRPCRouter({
  getAllBusinessesWithoutFollowing: protectedProcedure.query(
    async ({ ctx }) => {
      const followedBusinesses = await ctx.db.businessFollowing.findMany({
        where: {
          followerId: ctx.session.user.id,
        },
      });
      const businesses = await ctx.db.business.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (followedBusinesses.length === 0) {
        return businesses;
      }
      return businesses.filter((business) =>
        followedBusinesses.every(
          (followed) => followed.businessId !== business.id,
        ),
      );
    },
  ),

  createBusiness: protectedProcedure
    .input(completeBusinessSchema)
    .mutation(async ({ ctx, input }) => {
      const existingBusiness = await ctx.db.business.findFirst({
        where: {
          ownerId: ctx.session.user.id,
        },
      });
      if (existingBusiness) {
        throw new Error("User already has a business");
      }
      const business = await ctx.db.business.create({
        data: {
          ownerId: ctx.session.user.id,
          name: input.name ?? "",
          description: input.description,
          phone: input.phone,
          address: input.address ?? "",
          whatsappLink: input.whatsapp ?? "",
          instagramLink: input.instagram ?? "",
          logo: input.logo ?? "",
          lat: input.lat,
          lon: input.lon,
        },
      });
      await ctx.db.workers.create({
        data: {
          userId: ctx.session.user.id,
          businessId: business.id,
          wage: 0,
        },
      });
      return business.id;
    }),

  createOpeningHours: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        workingHours: z.array(
          z.object({
            dayOfWeek: z.number().min(0).max(6),
            isOpen: z.boolean(),
            openTime: z.string().optional(),
            closeTime: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { businessId, workingHours } = input;

      const validHours = workingHours
        .filter(
          (h) =>
            h.isOpen &&
            typeof h.openTime === "string" &&
            typeof h.closeTime === "string",
        )
        .map((h) => {
          const open = dayjs.tz(
            `2000-01-01T${h.openTime}:00`,
            "Asia/Jerusalem",
          );
          const close = dayjs.tz(
            `2000-01-01T${h.closeTime}:00`,
            "Asia/Jerusalem",
          );

          return {
            businessId,
            dayOfWeek: h.dayOfWeek,
            openTime: open.toDate(),
            closeTime: close.toDate(),
          };
        });

      if (validHours.length === 0) return [];

      await ctx.db.openingHours.createMany({
        data: validHours,
        skipDuplicates: true,
      });

      return validHours;
    }),

  updateBusiness: protectedProcedure
    .input(
      completeBusinessSchema.extend({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingBusiness = await ctx.db.business.findFirst({
        where: {
          id: input.id,
          ownerId: ctx.session.user.id,
        },
      });

      if (!existingBusiness) {
        throw new Error("Business not found or you are not the owner");
      }

      const updated = await ctx.db.business.update({
        where: { id: input.id },
        data: {
          name: input.name ?? "",
          description: input.description,
          phone: input.phone,
          address: input.address ?? "",
          whatsappLink: input.whatsapp ?? "",
          instagramLink: input.instagram ?? "",
          logo: input.logo ?? "",
          lat: input.lat,
          lon: input.lon,
          updatedAt: new Date(),
        },
      });
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

  getAvailableAppointments: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        date: z.date(),
        serviceId: z.number(),
        workerId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const dayjsDate = dayjs(input.date).tz("Asia/Jerusalem");
        const dayOfWeek = dayjsDate.day();
        const startOfDay = dayjsDate.startOf("day").toDate();
        const endOfDay = dayjsDate.endOf("day").toDate();
        const now = dayjs().tz("Asia/Jerusalem");
        const isToday = dayjsDate.isSame(now, "day");

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
            ctx.db.workerService.findMany({
              where: {
                workerId: input.workerId,
                service: {
                  id: input.serviceId,
                },
              },
              include: { service: true },
            }),
            ctx.db.appointment.findMany({
              where: {
                workerId: input.workerId,
                businessId: input.businessId,
                date: {
                  gte: startOfDay,
                  lte: endOfDay,
                },
              },
              select: {
                date: true,
                service: {
                  select: {
                    durationMinutes: true,
                  },
                },
              },
            }),
          ]);

        if (!openingHours || closedDay) return [];

        const openTime = dayjs(openingHours.openTime).tz("Asia/Jerusalem");
        const closeTime = dayjs(openingHours.closeTime).tz("Asia/Jerusalem");

        if (openTime.isAfter(closeTime)) {
          console.error("Invalid opening hours: openTime after closeTime", {
            openTime: openTime.format(),
            closeTime: closeTime.format(),
          });
          return [];
        }

        const shortestDuration = services[0]?.service.durationMinutes ?? 30;

        const intervals: string[] = [];

        for (
          let time = openTime.clone();
          time.isBefore(closeTime);
          time = time.add(shortestDuration, "minute")
        ) {
          const timeEnd = time.clone().add(shortestDuration, "minute");
          if (timeEnd.isAfter(closeTime)) break;

          if (isToday) {
            if (
              time.hour() < now.hour() ||
              (time.hour() === now.hour() && time.minute() < now.minute())
            )
              continue;
          }

          const isConflicting = appointments.some((apt) => {
            const aptTime = dayjs(apt.date).tz("Asia/Jerusalem");

            const timeStartInAptDay = aptTime
              .clone()
              .hour(time.hour())
              .minute(time.minute())
              .second(0)
              .millisecond(0);

            const timeEndInAptDay = timeStartInAptDay.add(
              shortestDuration,
              "minute",
            );

            const aptEnd = aptTime.add(apt.service.durationMinutes, "minute");
            return (
              aptTime.isBefore(timeEndInAptDay) &&
              aptEnd.isAfter(timeStartInAptDay)
            );
          });

          if (!isConflicting) {
            intervals.push(time.format("HH:mm"));
          }
        }

        return intervals;
      } catch (error) {
        console.error("getAvailableAppointments error:", {
          input,
          error: error instanceof Error ? error.message : String(error),
        });
        throw new Error(
          "Failed to fetch available times. Please try again later.",
        );
      }
    }),

  isWorkerOrOwnerByUserId: protectedProcedure.query(async ({ ctx }) => {
    const business = await ctx.db.business.findFirst({
      where: {
        OR: [
          { ownerId: ctx.session.user.id },
          {
            workers: {
              some: {
                Worker: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        ],
      },
    });

    return business ? true : false;
  }),

  deleteBusiness: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const business = await ctx.db.business.findFirst({
        where: {
          id: input.businessId,
        },
      });
      if (!business) {
        throw new Error("Business not found");
      }
      if (business?.ownerId !== ctx.session.user.id) {
        throw new Error("you are not allowed to delete this business");
      }
      await ctx.db.business.delete({
        where: {
          id: business.id,
        },
      });
      return { success: true };
    }),

  getFollowersCountByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const count = await ctx.db.businessFollowing.count({
        where: {
          businessId: input.businessId,
        },
      });
      return count;
    }),

  getBusinessRatingsByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const ratings = await ctx.db.review.findMany({
        where: {
          businessId: input.businessId,
        },
        select: {
          rating: true,
        },
      });

      const averageRating =
        ratings
          .map((review) => review.rating)
          .reduce((acc, rating) => acc + rating, 0) / ratings.length || 0;
      return averageRating.toFixed(1);
    }),
});
