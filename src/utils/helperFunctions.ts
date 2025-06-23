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
