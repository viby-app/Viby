import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
        businessId: z.number(),
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
          businessId: input.businessId,
          serviceId: service.id,
        }));

        await prisma.businessService.createMany({
          data: businessServiceLinks,
        });

        return createdServices;
      });
    }),

  getServicesByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(({ ctx, input }) => {
      const services = ctx.db.businessService.findMany({
        where: {
          businessId: input.businessId,
        },
        include: {
          service: true,
        },
      });
      return services;
    }),
});
