import { type FC } from "react";
import dayjs from "~/utils/dayjs";
import { statusBadgeColors, type AppointmentModalDetails } from "~/utils";
import { Clock, Scissors, User, UserCircle, PhoneCall } from "lucide-react";
import { api } from "~/utils/api";

interface AppointmentModalProps {
  appointment: AppointmentModalDetails;
  onClose: () => void;
  refetch: () => void;
}

const AppointmentModal: FC<AppointmentModalProps> = ({
  appointment,
  onClose,
  refetch,
}) => {
  const deleteAppointment = api.appointment.deleteAppointment.useMutation({
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  return (
    <dialog id="appointment_modal" className="modal modal-open">
      <div className="modal-box max-w-md bg-[#F2EFE7] text-[#3A3A3A] shadow-lg">
        <div
          className="card space-y-4 rounded-xl bg-white p-5 shadow"
          dir="rtl"
        >
          <h3 className="text-center text-2xl font-bold">פרטי פגישה</h3>

          <div className="flex justify-center">
            <div
              className={`badge ${statusBadgeColors[appointment.status]} px-4 py-2 text-sm text-white`}
            >
              {appointment.status}
            </div>
          </div>

          <div className="space-y-3 text-right text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#3A3A3A]" />
              <span>
                <strong>זמן:</strong>{" "}
                {dayjs(appointment.date).tz("Asia/Jerusalem").fromNow()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-[#3A3A3A]" />
              <span>
                <strong>שירות:</strong> {appointment.service.name} -{" "}
                {appointment.service.price} ₪
              </span>
            </div>

            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#3A3A3A]" />
              <span>
                <strong>עובד:</strong> {appointment.worker.Worker.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-[#3A3A3A]" />
              <span>
                <strong>לקוח:</strong> {appointment.user.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-[#3A3A3A]" />
              <a
                href={`tel:${appointment.user.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#9ACBD0] px-4 py-1 text-white hover:bg-[#7db4b8]"
              >
                התקשר ללקוח
              </a>
            </div>
          </div>

          <div className="modal-action mt-6 flex justify-between">
            <button
              className="btn btn-error"
              onClick={() =>
                deleteAppointment.mutate({ appointmentId: appointment.id })
              }
            >
              מחק פגישה
            </button>
            <button className="btn" onClick={onClose}>
              סגור
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default AppointmentModal;
