"use client";

import { useEffect } from "react";
import {
    useFieldArray,
    type Control,
    type UseFormRegister,
} from "react-hook-form";
import { daysOfWeek } from "~/utils";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm } from "~/utils/types";

type Props = {
    control: Control<CompleteBusinessForm>;
    register: UseFormRegister<CompleteBusinessForm>;
};

export function StepWorkingHours({ control, register }: Props) {
    const { fields, replace, update } = useFieldArray({
        control,
        name: "workingHours",
    });

    useEffect(() => {
        if (fields.length === 0) {
            const defaultHours = daysOfWeek.map((day) => ({
                dayOfWeek: day.value,
                isOpen: true,
                openTime: "09:00",
                closeTime: "18:00",
            }));
            replace(defaultHours);
        }
    }, [fields.length, replace]);

    const handleDayToggle = (index: number, isOpen: boolean) => {
        update(index, {
            dayOfWeek: index,
            isOpen,
            openTime: isOpen ? "09:00" : "",
            closeTime: isOpen ? "18:00" : "",
        });
    };

    return (
        <>
            <h1 className="mb-6 text-center text-2xl font-bold text-black">
                {hebrewDictionary.workingHours}
            </h1>

            <div className="space-y-3">
                {fields.map((field, index) => {
                    const dayLabel = daysOfWeek.find((d) => d.value === field.dayOfWeek)?.label;
                    return (
                        <div
                            key={field.id}
                            className="flex items-center w-full justify-between p-3 rounded-lg border border-gray-200"
                        >
                            <span className="font-medium w-[25px] text-black ml-1">{dayLabel}</span>

                            <div className="flex items-center gap-2">
                                {field.isOpen ? (
                                    <>
                                        <input
                                            {...register(`workingHours.${index}.openTime` as const)}
                                            type="time"
                                            className="rounded-lg bg-white px-3 py-2 border border-gray-300 text-sm"
                                            defaultValue={field.openTime ?? "09:00"}
                                        />
                                        <span className="text-gray-500">-</span>
                                        <input
                                            {...register(`workingHours.${index}.closeTime` as const)}
                                            type="time"
                                            className="rounded-lg bg-white px-3 py-2 border border-gray-300 text-sm"
                                            defaultValue={field.closeTime ?? "18:00"}
                                        />
                                    </>
                                ) : <p>{hebrewDictionary.close}</p>}

                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={field.isOpen}
                                    onChange={(e) => handleDayToggle(index, e.target.checked)}
                                    className="toggle text-[#A3C8C8] focus:ring-[#A3C8C8]"
                                />
                            </label>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
