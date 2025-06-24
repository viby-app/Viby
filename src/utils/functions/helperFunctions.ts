import type { NominatimAddress, Services } from "../types";

export function formatShortAddress(address: NominatimAddress): string {
  const street = address.road ?? address.pedestrian ?? address.footway ?? "";
  const number = address.house_number ?? "";
  const city = address.city ?? address.town ?? address.village ?? "";
  return (
    [street, number].filter(Boolean).join(" ") +
    (city ? `, ${city.replaceAll("-", " ")}` : "")
  );
}

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
