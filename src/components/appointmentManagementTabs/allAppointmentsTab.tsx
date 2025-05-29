import dayjs from "~/utils/dayjs";
import { DayPicker } from "react-day-picker";
import { he } from "react-day-picker/locale";
import AppointmentModal from "../appointmentModal";
import { statusBorderColors, type AppointmentModalDetails } from "~/utils";
import { hebrewDictionary } from "~/utils/constants";
import { useState } from "react";

interface AppointmentTabProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isLoadingAppointments: boolean;
  businessAppointments: AppointmentModalDetails[];
  selectedAppointment: AppointmentModalDetails | null;
  setSelectedAppointment: (appointment: AppointmentModalDetails | null) => void;
  refetchAppointments: () => void;
}
const AllAppointmentsTab = ({
  selectedDate,
  setSelectedDate,
  isLoadingAppointments,
  businessAppointments,
  selectedAppointment,
  setSelectedAppointment,
  refetchAppointments,
}: AppointmentTabProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <>
      <div className="mt-7 flex w-full flex-col items-center gap-2 text-[#3A3A3A]">
        <div className="relative z-10 max-w-xl px-4 text-[#3A3A3A]">
          <button
            onClick={() => setShowDatePicker((prev) => !prev)}
            className="input input-border w-3xs rounded-lg"
          >
            {selectedDate
              ? dayjs(selectedDate).format("DD/MM/YYYY")
              : hebrewDictionary.chooseDate}
          </button>

          {showDatePicker && (
            <div className="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-4 shadow-xl">
              <DayPicker
                dir="rtl"
                locale={he}
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}
        </div>

        <div className="w-full max-w-xl rounded-lg bg-white p-4 shadow">
          {isLoadingAppointments ? (
            <p>{hebrewDictionary.loadingAppointments}</p>
          ) : businessAppointments?.length === 0 ? (
            <p>{hebrewDictionary.noAppointments}</p>
          ) : (
            <ul className="max-h-[600px] space-y-2 overflow-y-scroll">
              {businessAppointments?.map((appointment) => (
                <li
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(appointment)}
                  className={`cursor-pointer rounded border-l-4 bg-[#F2EFE7] p-3 shadow-sm ${statusBorderColors[appointment.status]}`}
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
                    {hebrewDictionary.worker} {appointment.worker.Worker.name}
                  </div>
                  <div>
                    <p>
                      {hebrewDictionary.clientDetails} {appointment.user.name}
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
          refetch={() => refetchAppointments()}
        />
      )}
    </>
  );
};

export default AllAppointmentsTab;
