import { PlusCircle, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm } from "~/utils/types";

type Props = {
    control: Control<CompleteBusinessForm>;
    register: UseFormRegister<CompleteBusinessForm>;
    errors: FieldErrors<CompleteBusinessForm>;
};

export function StepServices({ control, register, errors }: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "services",
    });

    useEffect(() => {
        if (fields.length === 0) {
            append({ name: "", durationMinutes: 0, price: 0, description: "" });
        }
    }, []);

    return (
        <>
            <h1 className="mb-6 text-center text-2xl font-bold text-black">
                {hebrewDictionary.services}
            </h1>

            <div className="space-y-4 overflow-scroll max-h-[400px]">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-2 rounded-lg border border-gray-300 shadow-sm mb-1 p-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {hebrewDictionary.serviceName}
                                </label>
                                <input
                                    {...register(`services.${index}.name` as const)}
                                    className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
                                />
                                {errors.services?.[index]?.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.services[index].name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {hebrewDictionary.description}
                                </label>
                                <textarea
                                    {...register(`services.${index}.description` as const)}
                                    className="w-full rounded-lg bg-white px-4 py-2 shadow-md resize-none"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {hebrewDictionary.durationInMinutes}
                                    </label>
                                    <input
                                        {...register(`services.${index}.durationMinutes` as const, { valueAsNumber: true })}
                                        type="number"
                                        className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
                                    />
                                    {errors.services?.[index]?.durationMinutes && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.services[index].durationMinutes.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {hebrewDictionary.price}
                                    </label>
                                    <input
                                        {...register(`services.${index}.price` as const, { valueAsNumber: true })}
                                        type="number"
                                        className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
                                    />
                                    {errors.services?.[index]?.price && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.services[index].price.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-end justify-end col-span-2">
                                    {fields.length > 0 && (
                                        <button type="button" onClick={() => remove(index)}>
                                            <Trash2 className="text-red-500" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={() => append({ name: "", durationMinutes: 0, price: 0, description: "" })}
                className="mt-4 flex items-center gap-2 text-black"
            >
                <PlusCircle />
                <span>{hebrewDictionary.addService}</span>
            </button>
        </>
    );
} 