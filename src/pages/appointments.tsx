"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import "react-day-picker/dist/style.css";
import { useRouter } from "next/router";
import type { AppointmentModalDetails } from "~/utils";
import AllAppointmentsTab from "~/components/appointmentManagementTabs/allAppointmentsTab";
import CurrentAppointmentsView from "~/components/appointmentManagementTabs/currentAppointmentsView";

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
  const [activeTab, setActiveTab] = useState<"all" | "current" | "customers">(
    "all",
  );

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
  const businessAppointments =
    api.appointment.getAppointmentsByOwnerId.useQuery(
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
      <div className="flex flex-col items-center gap-5 p-4">
        <h1 className="text-3xl font-bold">ניהול פגישות</h1>

        <div className="tabs tabs-boxed rtl:tabs-boxed rounded-xl bg-[#6fc0c2] text-white">
          <button
            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            כל הפגישות
          </button>
          <button
            className={`tab ${activeTab === "current" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            פגישות נוכחיות
          </button>
        </div>
        <div className="w-full max-w-3xl">
          {activeTab === "all" && (
            <AllAppointmentsTab
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              isLoadingAppointments={businessAppointments.isLoading}
              businessAppointments={businessAppointments.data ?? []}
              selectedAppointment={selectedAppointment}
              setSelectedAppointment={setSelectedAppointment}
              refetchAppointments={businessAppointments.refetch}
            />
          )}
          {activeTab === "current" && (
            <CurrentAppointmentsView
              appointments={businessAppointments.data ?? []}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentsManagementPage;
