import { type $Enums, Gender, type User } from "@prisma/client";
import { z } from "zod";
import { hebrewDictionary } from "./constants";

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
    .min(10, "מספר הטלפון הוא שדה חובה")
    .max(15, "מספר הטלפון לא תקין"),
  description: z.string(),
  address: z
    .string({ description: "שדה חובה" })
    .min(2, "כתובת העסק היא שדה חובה"),
  lat: z.number().optional(),
  lon: z.number().optional(),
  logo: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  services: z
    .array(
      z.object({
        name: z.string().min(2, "שירות הוא שדה חובה"),
        durationMinutes: z
          .number({ invalid_type_error: hebrewDictionary.numberTypeError })
          .min(1, "משך השירות הוא שדה חובה"),
        price: z
          .number({ invalid_type_error: hebrewDictionary.numberTypeError })
          .min(1, "מחיר הוא שדה חובה"),
        description: z.string().optional(),
      }),
    )
    .optional(),
  workers: z
    .array(
      z.object({
        name: z.string(),
        phone: z.string(),
        userId: z.string(),
        wage: z.number({
          invalid_type_error: hebrewDictionary.numberTypeError,
        }),
      }),
    )
    .optional(),
  workingHours: z
    .array(
      z.object({
        dayOfWeek: z.number(),
        isOpen: z.boolean(),
        openTime: z.string().optional(),
        closeTime: z.string().optional(),
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

export type UserWorker = {
  name: string;
  phone: string | null;
  id: string;
  email: string | null;
  image: string | null;
} | null;

export interface GeoapifyResult {
  place_id: string;
  lat: number;
  lon: number;
  formatted: string;

  address_line1?: string;
  address_line2?: string;

  city?: string;
  suburb?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  state?: string;
  state_code?: string;
  country?: string;
  country_code?: string;
  county?: string;
  county_code?: string;

  result_type?: string;
  plus_code?: string;
  iso3166_2?: string;

  datasource?: {
    sourcename: string;
    attribution: string;
    license: string;
    url: string;
  };

  rank?: {
    popularity?: number;
    confidence?: number;
    confidence_city_level?: number;
    confidence_street_level?: number;
    confidence_building_level?: number;
    match_type?: string;
  };
}

export type LinkedWorker = {
  userId: string;
  wage: number;
};

export type Services = {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string | undefined;
}[];
export type OpeningHours =
  | {
      businessId: number;
      id: number;
      dayOfWeek: number;
      openTime: Date;
      closeTime: Date;
    }[]
  | undefined;

export type Images =
  | {
      id: number;
      key: string;
      businessId: number;
    }[]
  | undefined;

  export interface ProfileProps {
    user: User;
    isUserLoading: boolean;
  }

export type ServiceWithWorkers = {
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
  workers: LinkedWorker[];
};

export type ServicesWithWorkers = ServiceWithWorkers[];

export const servicesWithWorkersSchema = z.array(
  z.object({
    name: z.string(),
    durationMinutes: z.number(),
    price: z.number(),
    description: z.string().optional(),
    workers: z.array(
      z.object({
        userId: z.string(),
        wage: z.number(),
      }),
    ),
  }),
);

export type ServicesWithWorkersInput = z.infer<
  typeof servicesWithWorkersSchema
>;
export interface ProfileProps {
  user: User;
  isUserLoading: boolean;
}

export type DBService = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  durationMinutes: number;
  price: number;
  businessId: number;
  serviceId: number;
};

export type DBWorker = {
  id: number;
  name: string;
  phone: string;
  userId: string;
  wage: number;
  businessId: number;
};

export type DBWorkingHour = {
  id: number;
  dayOfWeek: number;
  openTime: Date;
  closeTime: Date;
  businessId: number;
};

export type DBImage = {
  id: number;
  businessId: number;
  key: string;
};
