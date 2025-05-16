"use client";

import { useState } from "react";
import Button from "./button";
import { api } from "~/utils/api";
import { DayPicker } from "react-day-picker";
import { he } from "react-day-picker/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { showSuccessToast } from "./successToast";

interface Props {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  businessId: number;
}

export default function BookingModal({
  showModal,
  setShowModal,
  businessId,
}: Props) {
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: workers } = api.workers.getAllWorkersByBusinessId.useQuery({
    businessId,
  });

  const { data: businessService } =
    api.service.getServicesByBusinessId.useQuery({
      businessId: businessId,
    });

  const {
    data: times,
    refetch: refetchTimes,
    isLoading: isLoadingTimes,
  } = api.business.getAvailableTimes.useQuery(
    {
      businessId,
      date: bookingDate,
    },
    { enabled: !!businessId },
  );

  const createAppointmentMutation =
    api.appointment.createAppointment.useMutation();

  const handleSubmit = () => {
    if (selectedWorker && selectedService && selectedTime) {
      createAppointmentMutation.mutate(
        {
          businessId,
          date: dayjs(bookingDate)
            .hour(Number(selectedTime.split(":")[0]))
            .minute(Number(selectedTime.split(":")[1]))
            .tz("Asia/Jerusalem")
            .toDate(),
          serviceId: selectedService,
        },

        {
          onSuccess: () => {
            showSuccessToast(TEXT.successfullAppointment);
            void refetchTimes();
          },
        },
      );
      handleReset();
    }
  };

  const handleReset = () => {
    setShowModal(false);
    setSelectedService(null);
    setSelectedTime(null);
    setSelectedWorker(null);
  };

  const TEXT = {
    bookAnAppointment: "קבע תור",
    selectWorker: "בחר עובד",
    selectService: "בחר שירות",
    selectDay: "בחר יום",
    back: "חזור",
    confirm: "אישור",
    cancel: "ביטול",
    noAvailableAppointments: "אין תורים להיום",
    successfullAppointment: "תור נקבע בהצלחה!",
  };

  return (
    <dialog
      id="booking_modal"
      className={`modal ${showModal ? "modal-open" : ""}`}
    >
      <div className="modal-box h-2/3 w-full max-w-sm bg-[#F2EFE7] transition-all duration-300 ease-in-out sm:max-w-lg">
        <h3 className="mb-4 text-center text-lg font-bold">
          {TEXT.bookAnAppointment}
        </h3>

        <div className="mb-2">
          <p>{TEXT.selectWorker}</p>
          <div className="grid grid-cols-1 items-center gap-2">
            {workers?.map((worker) => (
              <Button
                key={worker.id}
                onClick={() => setSelectedWorker(worker.id)}
                className={`w-full ${worker.id === selectedWorker ? "bg-[#028a93]" : "bg-[#48A6A7]"}`}
              >
                {worker.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p>{TEXT.selectService}</p>
          <div className="mb-5 grid grid-cols-1 gap-2">
            {businessService?.map(({ service }) => (
              <Button
                key={service.id}
                onClick={() => setSelectedService(service.id)}
                className={`w-full ${selectedService === service.id ? "bg-[#028a93]" : "bg-[#48A6A7]"}`}
              >
                {service.name} - ₪{service.price}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p>{TEXT.selectDay}</p>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="input input-border mb-2 w-full text-left"
          >
            {bookingDate ? bookingDate.toLocaleDateString() : "בחר תאריך"}
          </button>

          {showDatePicker && (
            <DayPicker
              dir="rtl"
              locale={he}
              mode="single"
              selected={bookingDate}
              onSelect={(date) => {
                if (date) setBookingDate(dayjs(date).utc().toDate());
                setShowDatePicker(false);
              }}
              className="react-day-picker fixed left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-4 shadow-lg"
            />
          )}

          <div className="mt-3 grid grid-cols-3 gap-2">
            {isLoadingTimes ? (
              <div className="loading" />
            ) : times?.length === 0 ? (
              <p>{TEXT.noAvailableAppointments}</p>
            ) : (
              <>
                {times?.map((time, idx) => (
                  <Button
                    key={idx}
                    onClick={() => setSelectedTime(time)}
                    className={`w-full ${selectedTime === time ? "bg-[#028a93]" : "bg-[#48A6A7]"}`}
                  >
                    {time}
                  </Button>
                ))}
              </>
            )}
          </div>

          <div className="my-4 flex space-x-2">
            <Button
              onClick={handleSubmit}
              disabled={!selectedTime || !selectedService || !selectedWorker}
            >
              {TEXT.confirm}
            </Button>
            <Button className="bg-red-400" onClick={handleReset}>
              {TEXT.cancel}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
