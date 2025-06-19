import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const imageRouter = createTRPCRouter({
  getImagesByBusinessId: protectedProcedure
    .input(z.object({ businessId: z.number() }))
    .query(async ({ ctx, input }) => {
      const images = await ctx.db.image.findMany({
        where: {
          businessId: input.businessId,
        },
      });

      return images;
    }),
  uploadImage: protectedProcedure
    .input(
      z.object({
        images: z.array(z.string().min(1, "Image key is required")),
        businessId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const uploadedImages = await Promise.all(
        input.images.map(
          async (image) =>
            await ctx.db.image.create({
              data: {
                key: image,
                businessId: input.businessId,
              },
            }),
        ),
      );

      return uploadedImages;
    }),
});
