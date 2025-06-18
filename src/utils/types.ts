import { Gender } from "@prisma/client";
import { z } from "zod";

export type UserDataForm = {
  name: string;
  email: string;
  phone: string;
};

export type ImageUrlResponse = {
  url: string;
};

export const completeProfileSchema = z.object({
  phone: z.string().min(6, "Phone number is required"),
  isBusinessOwner: z.boolean(),
  name: z.string().min(2, "Name is required"),
  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;
