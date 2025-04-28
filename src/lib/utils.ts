import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, ensuring the last one overrides previous styles.
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}