import type { NominatimAddress } from "./types";

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
