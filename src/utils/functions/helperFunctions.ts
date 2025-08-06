import type { Business } from "@prisma/client";
import type {
  CompleteBusinessForm,
  DBImage,
  DBService,
  DBWorker,
  DBWorkingHour,
  GeoapifyResult,
  Services,
} from "../types";

export const formatShortAddress = (res: GeoapifyResult) => {
  const parts = [
    `${res.street ?? ""} ${res.housenumber ?? ""}`.trim(),
    res.city ?? res.suburb ?? "",
  ];
  return parts.filter(Boolean).join(", ");
};

export function normalizePhoneNumber(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("+972")) return digits;
  if (digits.startsWith("0")) return `+972${digits.slice(1)}`;
  return `+972${digits}`;
}

export function removeEmptyServices(services: Services) {
  return services.filter(
    (service) =>
      service.name &&
      service.name.trim() !== "" &&
      service.durationMinutes > 0 &&
      service.price > 0,
  );
}

type BusinessFormData = {
  business: Business;
  images?: DBImage[];
  services?: DBService[];
  workers?: DBWorker[];
  workingHours?: DBWorkingHour[];
};

export const mapBusinessToForm = ({
  business,
  images,
  services,
  workers,
  workingHours,
}: BusinessFormData): CompleteBusinessForm & { businessId: number } => {
  return {
    businessId: business.id,
    name: business.name,
    phone: business.phone,
    description: business.description ?? "",
    address: business.address,
    lat: business.lat ?? undefined,
    lon: business.lon ?? undefined,
    logo: business.logo ?? undefined,
    whatsapp: business.whatsappLink ?? undefined,
    instagram: business.instagramLink ?? undefined,
    gallery: images?.map((image) => image.key) ?? [],
    services:
      services?.map((service) => ({
        name: service.name,
        durationMinutes: service.durationMinutes,
        price: service.price,
        description: service.description ?? undefined,
      })) ?? [],
    workers:
      workers?.map((worker) => ({
        name: worker.name,
        phone: worker.phone,
        userId: worker.userId,
        wage: worker.wage,
      })) ?? [],
    workingHours:
      workingHours?.map((hour) => ({
        dayOfWeek: hour.dayOfWeek,
        isOpen: true,
        openTime: hour.openTime.toISOString().slice(11, 16),
        closeTime: hour.closeTime.toISOString().slice(11, 16),
      })) ?? [],
  };
};
