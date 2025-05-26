"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import dayjs from "~/utils/dayjs";
import { he } from "react-day-picker/locale";
import { useRouter } from "next/router";
import type { AppointmentModalDetails } from "~/utils";
import AppointmentModal from "~/components/appointmentModal";

const statusColors: Record<string, string> = {
  BOOKED: "border-yellow-400",
  CANCELLED: "border-red-600",
  COMPLETED: "border-green-600",
};

const TEXT = {
  BOOKED: "הוזמן",
  CANCELLED: "מבוטל",
  COMPLETED: "הושלם",
  meetingsForToday: "פגישות להיום",
  selectDate: "בחר תאריך",
  appointmentsManagement: "ניהול תורים",
  noAppointments: "אין פגישות ליום זה.",
  loadingAppointments: "טוען פגישות...",
  errorLoadingAppointments: "שגיאה בטעינת הפגישות: ",
  worker: "עובד: ",
  status: "סטטוס: ",
  time: "שעה: ",
  service: "שירות: ",
  date: "תאריך: ",
  clientDetails: "פרטי לקוח: ",
  loading: "טוען...",
};

const AppointmentsManagementPage: NextPage = () => {
  const { data: businessOwner, status } = useSession();
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentModalDetails | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return;
    if (
      businessOwner?.user.role !== "BUSINESS_OWNER" &&
      businessOwner?.user.role !== "ADMIN"
    ) {
      void router.push("/unauthorized");
    }
  }, [businessOwner, status, router]);

  const ownerId = businessOwner?.user?.id;
  const date = selectedDate?.toISOString();
  const businessAppointment = api.appointment.getAppointmentsByOwnerId.useQuery(
    {
      ownerId: ownerId!,
      date: date!,
    },
    {
      enabled: !!ownerId && !!date,
    },
  );

  if (
    status === "loading" ||
    (businessOwner?.user.role !== "BUSINESS_OWNER" &&
      businessOwner?.user.role !== "ADMIN")
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>{TEXT.loading}</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center gap-4 px-4 py-6 text-[#3A3A3A]">
        <h1 className="text-3xl font-bold">{TEXT.appointmentsManagement}</h1>

        <DayPicker
          dir="rtl"
          locale={he}
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="h-1/2 rounded-lg border bg-[#F2EFE7] p-4 shadow"
        />

        <div className="mt-6 w-full max-w-xl rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-semibold">
            {TEXT.meetingsForToday}{" "}
            {selectedDate ? dayjs(selectedDate).format("DD/MM/YYYY") : "-"}
          </h2>
          {businessAppointment.isLoading ? (
            <p>{TEXT.loadingAppointments}</p>
          ) : businessAppointment.isError ? (
            <p>
              {TEXT.errorLoadingAppointments}
              {businessAppointment.error.message}
            </p>
          ) : businessAppointment.data?.length === 0 ? (
            <p>{TEXT.noAppointments}</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-scroll">
              {businessAppointment.data?.map((appointment) => (
                <li
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className={`cursor-pointer rounded border-l-4 border-[#9ACBD0] bg-[#F2EFE7] p-3 shadow-sm ${statusColors[appointment.status]}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {appointment.service.name} - {appointment.service.price} ₪
                    </span>
                    <span className="text-sm text-gray-600">
                      {dayjs(appointment.date).format("HH:mm")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {TEXT.worker} {appointment.worker.Worker.name}
                  </div>
                  <div>
                    <p>
                      {TEXT.clientDetails} {appointment.user.name}
                      {" - "}
                      {appointment.user.phone}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          refetch={() => businessAppointment.refetch()}
        />
      )}
    </Layout>
  );
};

export default AppointmentsManagementPage;
