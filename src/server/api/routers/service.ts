import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { servicesWithWorkersSchema } from "~/utils/types";

const serviceInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  durationMinutes: z.number(),
  price: z.number(),
});

export const serviceRouter = createTRPCRouter({
  createMultiple: protectedProcedure
    .input(
      z.object({
        workerId: z.number(),
        services: z.array(serviceInput),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (prisma) => {
        const createdServices = await Promise.all(
          input.services.map((service) =>
            prisma.service.create({
              data: {
                name: service.name,
                description: service.description,
                durationMinutes: service.durationMinutes,
                price: service.price,
              },
            }),
          ),
        );

        const businessServiceLinks = createdServices.map((service) => ({
          workerId: input.workerId,
          serviceId: service.id,
        }));

        await prisma.workerService.createMany({
          data: businessServiceLinks,
        });

        return createdServices;
      });
    }),

  createServicesWorkersAndLink: protectedProcedure
    .input(
      z.object({
        businessId: z.number(),
        services: servicesWithWorkersSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { businessId, services } = input;
      return await ctx.db.$transaction(async (prisma) => {
        const serviceResults = [];
        const ownerUserId = ctx.session.user.id;
        let ownerWorker = await prisma.workers.findFirst({
          where: {
            businessId,
            userId: ownerUserId,
          },
        });
        ownerWorker ??= await prisma.workers.create({
          data: {
            businessId,
            userId: ownerUserId,
            wage: 0,
          },
        });
        for (const service of services) {
          let dbService = await prisma.service.findFirst({
            where: {
              name: service.name,
              durationMinutes: service.durationMinutes,
              price: service.price,
              description: service.description,
            },
          });
          dbService ??= await prisma.service.create({
            data: {
              name: service.name,
              durationMinutes: service.durationMinutes,
              price: service.price,
              description: service.description,
            },
          });
          for (const worker of service.workers) {
            let dbWorker = await prisma.workers.findFirst({
              where: {
                businessId,
                userId: worker.userId,
              },
            });
            dbWorker ??= await prisma.workers.create({
              data: {
                businessId,
                userId: worker.userId,
                wage: worker.wage,
              },
            });
            await prisma.workerService.upsert({
              where: {
                workerId_serviceId: {
                  workerId: dbWorker.id,
                  serviceId: dbService.id,
                },
              },
              update: {},
              create: {
                workerId: dbWorker.id,
                serviceId: dbService.id,
              },
            });
          }
          await prisma.workerService.upsert({
            where: {
              workerId_serviceId: {
                workerId: ownerWorker.id,
                serviceId: dbService.id,
              },
            },
            update: {},
            create: {
              workerId: ownerWorker.id,
              serviceId: dbService.id,
            },
          });
          serviceResults.push(dbService);
        }
        return serviceResults;
      });
    }),

  getServicesByWorkerId: protectedProcedure
    .input(z.object({ workerId: z.number() }))
    .query(({ ctx, input }) => {
      const services = ctx.db.workerService.findMany({
        where: {
          workerId: input.workerId,
        },
        include: {
          service: true,
        },
      });
      return services;
    }),
});
