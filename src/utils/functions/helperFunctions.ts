import type { GeoapifyResult, Services } from "../types";

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
