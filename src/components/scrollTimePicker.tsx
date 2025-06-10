import React, {
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import Picker from "react-mobile-picker";

interface Props {
  times: string[];
  selectedTime: string;
  setSelectedTime: Dispatch<SetStateAction<string | null>>;
}

export default function TimeScrollPicker({
  times,
  selectedTime,
  setSelectedTime,
}: Props) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedTime && times.length > 0) {
      setSelectedTime(times[0] ?? "");
    }
  }, [selectedTime, times, setSelectedTime]);

  useEffect(() => {
    const el = pickerRef.current;
    if (!el) return;

    const preventTouchMove = (e: TouchEvent) => e.stopPropagation();
    el.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      el.removeEventListener("touchmove", preventTouchMove);
    };
  }, []);

  return (
    <div ref={pickerRef} className="mx-auto w-full max-w-xs p-4">
      <Picker
        value={{ time: selectedTime }}
        onChange={(val) => setSelectedTime(val.time)}
      >
        <Picker.Column name="time">
          {times.map((time) => (
            <Picker.Item key={time} value={time}>
              {time}
            </Picker.Item>
          ))}
        </Picker.Column>
      </Picker>
    </div>
  );
}
