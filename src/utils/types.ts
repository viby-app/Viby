import { type $Enums, Gender } from "@prisma/client";
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
  phone: z
    .string()
    .min(6, "מספר הטלפון הוא שדה חובה")
    .max(15, "מספר הטלפון לא תקין"),
  isBusinessOwner: z.boolean(),
  name: z.string().min(2, "שם הוא שדה חובה"),
  gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER]),
});

export type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export const completeBusinessSchema = z.object({
  name: z.string().min(2, "שם העסק הוא שדה חובה"),
  phone: z
    .string()
    .min(6, "מספר הטלפון הוא שדה חובה")
    .max(15, "מספר הטלפון לא תקין"),
  description: z.string(),
  address: z.string().min(2, "כתובת העסק היא שדה חובה"),
  logo: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  services: z
    .array(
      z.object({
        name: z.string().min(2, "שירות הוא שדה חובה"),
        durationMinutes: z.number().min(1, "משך השירות הוא שדה חובה"),
        price: z.number().min(1, "מחיר הוא שדה חובה"),
        description: z.string().optional(),
      }),
    )
    .optional(),
});

export type CompleteBusinessForm = z.infer<typeof completeBusinessSchema>;

export type AppointmentModalDetails = {
  id: number;
  status: $Enums.AppointmentStatus;
  service: {
    durationMinutes: number;
    name: string;
    id: number;
    price: number;
  };
  worker: {
    Worker: {
      name: string;
    };
  };
  date: Date;
  user: {
    name: string;
    id: string;
    phone: string | null;
    email: string | null;
    emailVerified: Date | null;
    isPhoneVerified: boolean;
    image: string | null;
    role: $Enums.Role;
    createdAt: Date;
    updatedAt: Date | null;
  };
};
