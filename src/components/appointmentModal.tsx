import { type FC, useState } from "react";
import dayjs from "~/utils/dayjs";
import { statusBadgeColors, type AppointmentModalDetails } from "~/utils";
import {
  Clock,
  Scissors,
  User,
  UserCircle,
  PhoneCall,
  Trash2,
  X,
} from "lucide-react";
import { api } from "~/utils/api";
import { hebrewDictionary } from "~/utils/constants";
import ConfirmDialog from "./deleteConfirmation";

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
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteAppointment = api.appointment.deleteAppointment.useMutation({
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  return (
    <>
      <dialog id="appointment_modal" className="modal modal-open">
        <div className="modal-box max-w-md bg-[#F2EFE7] text-[#3A3A3A] shadow-lg">
          <div className="card rounded-xl bg-white p-5 shadow" dir="rtl">
            <button className="btn w-1/6" onClick={onClose}>
              <X />
            </button>
            <div className="flex justify-center">
              <div
                className={`badge ${statusBadgeColors[appointment.status]} h-1/2 w-1/2 px-4 py-2 text-lg text-yellow-900`}
              >
                {
                  hebrewDictionary[
                    appointment.status.toLowerCase() as keyof typeof hebrewDictionary
                  ]
                }
              </div>
            </div>
            <div className="divider" />
            <div className="space-y-3 text-right text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#3A3A3A]" />
                <span>
                  {dayjs(appointment.date).tz("Asia/Jerusalem").fromNow()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-[#3A3A3A]" />
                <span>
                  {appointment.service.name} - {appointment.service.price} ₪
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#3A3A3A]" />
                <span>
                  <strong>{hebrewDictionary.worker}:</strong>{" "}
                  {appointment.worker.Worker.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-[#3A3A3A]" />
                <span>
                  <strong>{hebrewDictionary.client}:</strong>{" "}
                  {appointment.user.name}
                </span>
                <a
                  href={`tel:${appointment.user.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-[#9ACBD0] px-4 py-1 text-white hover:bg-[#7db4b8]"
                >
                  <PhoneCall className="h-5 w-5 text-[#3A3A3A]" />
                </a>
              </div>
            </div>

            <div className="modal-action mt-6 flex justify-start">
              <button
                className="btn btn-error w-1/3"
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 />
              </button>
            </div>
          </div>
        </div>
      </dialog>

      <ConfirmDialog
        open={showConfirm}
        onConfirm={() => {
          deleteAppointment.mutate({ appointmentId: appointment.id });
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default AppointmentModal;
