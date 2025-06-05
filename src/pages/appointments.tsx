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
import { hebrewDictionary } from "~/utils/constants";

const AppointmentsManagementPage: NextPage = () => {
  const { data: user, status } = useSession();
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentModalDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "current" | "customers">(
    "all",
  );

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  const isWorker = api.business.isWorkerOrOwnerByUserId.useQuery();

  const router = useRouter();
  useEffect(() => {
    if (status === "loading" || isWorker.isLoading) return;
    if (!isWorker.data) {
      void router.push("/unauthorized");
    }
  }, [status, isWorker.data]);

  const userId = user?.user?.id;
  const date = selectedDate?.toISOString();
  const businessAppointments =
    api.appointment.getAppointmentsByOwnerOrWorkerId.useQuery(
      {
        userId: userId!,
        date: date!,
      },
      {
        enabled: !!userId && !!date,
      },
    );

  if (status === "loading" || !isWorker.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>{hebrewDictionary.loading}</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center p-4">
        <div className="tabs tabs-boxed rtl:tabs-boxed rounded-xl bg-[#6fc0c2] text-white">
          <button
            className={`tab ${activeTab === "all" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            {hebrewDictionary.allMyAppointments}
          </button>
          <button
            className={`tab ${activeTab === "current" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            {hebrewDictionary.currentAppointments}
          </button>
        </div>
        <>
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
        </>
      </div>
    </Layout>
  );
};

export default AppointmentsManagementPage;
