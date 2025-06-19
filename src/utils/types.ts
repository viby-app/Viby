import  { type $Enums, Gender } from "@prisma/client";
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

export const completeBusinessSchema = z.object({
  name: z.string().min(1, "נדרש שם עסק"),
  description: z.string().min(1, "נדרש תיאור"),
  address: z.string().min(1, "נדרשת כתובת"),
  phone: z.string().min(7, "מספר טלפון לא תקין"),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  logo: z.string().optional(),
  gallery: z.array(z.string()).default([]).optional(),
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
