"use client";

import { useState } from "react";
import Button from "./button";
import { api } from "~/utils/api";

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
  const [step, setStep] = useState<"worker" | "service" | "time">("worker");
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: workers } = api.workers.getAllWorkersByBusinessId.useQuery({
    businessId: businessId,
  });
  const { data: businessService } =
    api.service.getServicesByBusinessId.useQuery({
      bussinesId: businessId,
    });
  const { data: times } = api.business.getAvailableTimes.useQuery({
    businessId: businessId,
  });

  const handleSubmit = () => {
    if (selectedWorker && selectedService && selectedTime) {
      console.log({ selectedWorker, selectedService, selectedTime });
      setShowModal(false);
    }
  };

  const handleReset = () => {
    setShowModal(false);
    setSelectedService(null);
    setSelectedTime(null);
    setSelectedWorker(null);
    setStep("worker");
  };

  const TEXT = {
    bookAnAppointment: "קבע תור",
    selectWorker: "בחר עובד",
    selectService: "בחר שירות",
    selectTime: "בחר שעה",
    back: "חזור",
    confirm: "אישור",
    cancel: "ביטול",
  };

  return (
    <dialog
      id="booking_modal"
      className={`modal ${showModal ? "modal-open" : ""}`}
    >
      <div className="modal-box w-full max-w-sm bg-[#F2EFE7] transition-all duration-300 ease-in-out sm:max-w-lg">
        <h3 className="mb-4 text-center text-lg font-bold">
          {TEXT.bookAnAppointment}
        </h3>

        {step === "worker" && (
          <div className="space-y-4">
            <p>{TEXT.selectWorker}</p>
            <div className="grid w-1/2 grid-cols-1 items-center gap-2">
              {workers?.map((worker) => (
                <Button
                  key={worker.id}
                  onClick={() => {
                    setSelectedWorker(worker.id);
                    setStep("service");
                  }}
                  className="w-full"
                >
                  {worker.name}
                </Button>
              ))}
            </div>
            <div className="w-1/2 text-center">
              <Button onClick={handleReset}>{TEXT.cancel}</Button>
            </div>
          </div>
        )}

        {step === "service" && (
          <div className="space-y-4">
            <p>{TEXT.selectService}</p>
            <div className="self- mb-5 grid grid-cols-1 gap-2">
              {businessService?.map(({ service }) => (
                <Button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setStep("time");
                  }}
                  className="w-full"
                >
                  {service.name} - ₪{service.price}
                </Button>
              ))}
            </div>
            <div className="w-1/2 text-center">
              <Button onClick={() => setStep("worker")}>{TEXT.back}</Button>
            </div>
          </div>
        )}

        {step === "time" && (
          <div className="space-y-4">
            <p>{TEXT.selectTime}</p>
            <div className="grid grid-cols-3 gap-2">
              {times?.map((time, idx) => (
                <Button
                  key={idx}
                  onClick={() => setSelectedTime(time)}
                  className={`w-full ${selectedTime === time ? "btn-primary" : ""}`}
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setStep("service")}>{TEXT.back}</Button>
              <Button
                onClick={() => {
                  handleSubmit();
                  handleReset();
                }}
                disabled={!selectedTime}
              >
                {TEXT.confirm}
              </Button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
