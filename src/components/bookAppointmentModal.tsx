"use client";

import { useState, useRef, useEffect } from "react";
import Button from "./button";
import { api } from "~/utils/api";
import { DayPicker } from "react-day-picker";
import { he } from "react-day-picker/locale";
import dayjs from "~/utils/dayjs";
import { showSuccessToast } from "./successToast";
import ScrollTimePicker from "./scrollTimePicker";
import { hebrewDictionary } from "~/utils/constants";

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
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: workers } = api.workers.getAllWorkersByBusinessId.useQuery({
    businessId,
  });

  const { data: businessService } =
    api.service.getServicesByBusinessId.useQuery({ businessId });

  const {
    data: times,
    refetch: refetchTimes,
    isLoading: isLoadingTimes,
  } = api.business.getAvailableAppointments.useQuery(
    {
      workerId: selectedWorker ?? 0,
      businessId,
      date: dayjs(bookingDate).tz("Asia/Jerusalem").toDate(),
    },
    { enabled: !!businessId && !!selectedWorker },
  );

  useEffect(() => {
    if (selectedTime && times && times.length > 0) {
      setSelectedTime(times[0] ?? "");
    }
  }, [times]);

  const createAppointmentMutation =
    api.appointment.createAppointment.useMutation();

  const handleSubmit = () => {
    if (selectedWorker && selectedService && selectedTime) {
      createAppointmentMutation.mutate(
        {
          businessId,
          workerId: selectedWorker,
          date: dayjs(bookingDate)
            .hour(Number(selectedTime.split(":")[0]))
            .minute(Number(selectedTime.split(":")[1]))
            .second(0)
            .millisecond(0)
            .tz("Asia/Jerusalem")
            .toDate(),
          serviceId: selectedService,
        },
        {
          onSuccess: () => {
            showSuccessToast(hebrewDictionary.successfullAppointment);
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
    setSelectedWorker(null);
    setSelectedTime(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        handleReset();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <dialog className={`modal ${showModal ? "modal-open" : ""}`}>
      <div
        ref={modalRef}
        className="modal-box h-2/3 w-full max-w-sm bg-[#F2EFE7] transition-all duration-300 ease-in-out sm:max-w-lg"
      >
        <h3 className="mb-4 text-center text-lg font-bold">
          {hebrewDictionary.bookAppointment}
        </h3>

        <div className="mb-2">
          <p>{hebrewDictionary.selectWorker}</p>
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
          <p>{hebrewDictionary.selectService}</p>
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
          <p>{hebrewDictionary.selectDay}</p>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="input input-border mb-2 w-full text-left"
          >
            {bookingDate
              ? bookingDate.toLocaleDateString()
              : hebrewDictionary.chooseDate}
          </button>
          {showDatePicker && (
            <DayPicker
              dir="rtl"
              locale={he}
              mode="single"
              selected={bookingDate}
              disabled={{
                before: dayjs().tz("Asia/Jerusalem").startOf("day").toDate(),
              }}
              onSelect={(date) => {
                if (date) {
                  const normalized = dayjs(date).startOf("day").toDate();
                  setBookingDate(normalized);
                }
                setShowDatePicker(false);
              }}
              className="react-day-picker fixed left-1/2 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-4 shadow-lg"
            />
          )}

          <div>
            {isLoadingTimes ? (
              <div className="loading" />
            ) : times?.length === 0 ? (
              <p>{hebrewDictionary.noAvailableAppointments}</p>
            ) : !selectedWorker ? (
              <h1>{hebrewDictionary.selectWorkerToSeeTimes}</h1>
            ) : (
              <ScrollTimePicker
                times={times ?? []}
                selectedTime={selectedTime ?? ""}
                setSelectedTime={setSelectedTime}
              />
            )}
          </div>
        </div>

        <div className="my-4 flex space-x-2">
          <Button
            onClick={handleSubmit}
            disabled={!selectedTime || !selectedService || !selectedWorker}
          >
            {hebrewDictionary.confirm}
          </Button>
          <Button className="bg-red-400" onClick={handleReset}>
            {hebrewDictionary.cancel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
