"use client";

import { useEffect, useMemo, useState } from "react";
import type { AppointmentModalDetails } from "~/utils";
import dayjs from "~/utils/dayjs";
import Image from "next/image";
import {
  CircleUserIcon,
  Phone,
  Clock,
  UserCog,
  Scissors,
  DollarSign,
} from "lucide-react";
import { indexToCurrentAppointmentStatus } from "~/lib/utils";

interface Props {
  appointments: AppointmentModalDetails[];
}

const CurrentAppointmentsTab = ({ appointments }: Props) => {
  const [currentAppointments, setCurrentAppointments] = useState<
    (AppointmentModalDetails | null)[]
  >([null, null, null]);

  useEffect(() => {
    const updateAppointments = () => {
      const now = dayjs();
      const sorted = appointments
        .slice()
        .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

      let last: AppointmentModalDetails | null = null;
      let current: AppointmentModalDetails | null = null;
      let upcoming: AppointmentModalDetails | null = null;

      for (const appt of sorted) {
        const start = dayjs(appt.date);
        const end = start.add(appt.service.durationMinutes, "minutes");

        if (end.isBefore(now)) {
          last = appt;
        } else if (start.isBefore(now) && end.isAfter(now)) {
          current = appt;
        } else if (start.isAfter(now)) {
          upcoming = appt;
          break;
        }
      }

      setCurrentAppointments([last, current, upcoming]);
    };

    updateAppointments();
    const interval = setInterval(updateAppointments, 60_000);

    return () => clearInterval(interval);
  }, [appointments]);

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {currentAppointments.map((appt, index) => (
        <div
          key={index}
          className="mx-auto mb-6 w-full max-w-md rounded-2xl border bg-white p-6 shadow-md"
        >
          <h2 className="mb-4 text-center text-xl font-bold text-[#3A3A3A]">
            {indexToCurrentAppointmentStatus(index)}
          </h2>
          {appt ? (
            <>
              <div className="mb-4 flex items-center gap-4">
                {appt.user?.image ? (
                  <Image
                    src={appt.user.image}
                    alt="User"
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full border border-gray-300 object-cover shadow"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 bg-gray-100">
                    <CircleUserIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div className="flex w-fit space-x-2">
                  <span className="text-base font-semibold">
                    {appt.user.name}
                  </span>
                  {appt.user.phone && (
                    <a
                      href={`tel:${appt.user.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-[#9ACBD0] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#80b4bb]"
                    >
                      <Phone className="h-4 w-4" />
                      התקשר
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-x-2 gap-y-2 text-sm text-gray-800">
                <div className="flex items-center rounded-lg bg-[#5ed1d3] p-1">
                  <Scissors className="h-4 w-4 text-black" />
                  {appt.service.name}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[#5ed1d3] p-1">
                  <UserCog className="h-4 w-4 text-black" />
                  {appt.worker.Worker.name}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[#5ed1d3] p-1">
                  <Clock className="h-4 w-4 text-black" />
                  {dayjs(appt.date).format("HH:mm") +
                    " - " +
                    dayjs(appt.date)
                      .add(appt.service.durationMinutes, "minutes")
                      .format("HH:mm")}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-[#5ed1d3] p-1">
                  <DollarSign className="h-4 w-4 text-black" />
                  {appt.service.price.toFixed(2)}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">אין פגישה</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CurrentAppointmentsTab;
