import dayjs from "dayjs";
import { DayPicker } from "react-day-picker";
import { he } from "react-day-picker/locale";
import AppointmentModal from "../appointmentModal";
import type { AppointmentModalDetails } from "~/utils";

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

const statusColors: Record<string, string> = {
  BOOKED: "border-yellow-400",
  CANCELLED: "border-red-600",
  COMPLETED: "border-green-600",
};

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
  return (
    <>
      <div className="flex flex-col items-center gap-2 px-4 py-6 text-[#3A3A3A]">
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
          {isLoadingAppointments ? (
            <p>{TEXT.loadingAppointments}</p>
          ) : businessAppointments?.length === 0 ? (
            <p>{TEXT.noAppointments}</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-scroll">
              {businessAppointments?.map((appointment) => (
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
          refetch={() => refetchAppointments()}
        />
      )}
    </>
  );
};

export default AllAppointmentsTab;
