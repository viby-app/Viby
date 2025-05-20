import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "~/utils/dayjs";

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

export const numberToWeekday = (number: number) => {
  switch (number) {
    case 0:
      return "ראשון";
    case 1:
      return "שני";
    case 2:
      return "שלישי";
    case 3:
      return "רביעי";
    case 4:
      return "חמישי";
    case 5:
      return "שישי";
    case 6:
      return "שבת";
    default:
      return "";
  }
};

export const formatTime = (date: Date) => {
  return dayjs.utc(date).tz("Asia/Jerusalem").format("HH:mm");
};
