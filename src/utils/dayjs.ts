import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localeData from "dayjs/plugin/localeData";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/he";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.locale("he");

dayjs.updateLocale("he", {
  weekStart: 0,
  relativeTime: {
    future: "בעוד %s",
    past: "לפני %s",
    s: "כמה שניות",
    m: "דקה",
    mm: "%d דקות",
    h: "שעה",
    hh: "%d שעות",
    d: "יום",
    dd: "%d ימים",
    M: "חודש",
    MM: "%d חודשים",
    y: "שנה",
    yy: "%d שנים",
  },
});

export default dayjs;
