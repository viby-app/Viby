import { useState } from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm, UserWorker } from "~/utils/types";
import { Trash2, Search, User } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";

type Props = {
    control: Control<CompleteBusinessForm>;
    register: UseFormRegister<CompleteBusinessForm>;
    errors: FieldErrors<CompleteBusinessForm>;
};

export function StepWorkers({ control, register, errors }: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workers",
    });

    const [searchPhone, setSearchPhone] = useState("");
    const [searching, setSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<UserWorker | null>(null);

    const searchUserMutation = api.user.searchUserByPhone.useMutation();

    const handleSearchUser = async () => {
        if (!searchPhone.trim()) {
            toast.error(hebrewDictionary.enterPhoneNumber);
            return;
        }

        setSearching(true);
        try {
            const user = await searchUserMutation.mutateAsync({ phone: searchPhone });
            if (user) {
                setFoundUser(user);
            } else {
                setFoundUser(null);
                toast.error(hebrewDictionary.workerNotFound);
            }
        } catch (error) {
            toast.error(hebrewDictionary.searchWorkerError);
        } finally {
            setSearching(false);
        }
    };

    const handleAddWorker = () => {
        if (!foundUser) {
            toast.error(hebrewDictionary.searchWorkerFirst);
            return;
        }

        const existingWorker = fields.find(worker => worker.userId === foundUser.id);
        if (existingWorker) {
            toast.error(hebrewDictionary.workerAlreadyAdded);
            return;
        }

        append({
            userId: foundUser.id,
            name: foundUser.name,
            phone: foundUser.phone ?? "",
            wage: 0,
        });

        setFoundUser(null);
        setSearchPhone("");
    };

    return (
        <>
            <h1 className="mb-6 text-center text-2xl font-bold text-black">
                {hebrewDictionary.workers}
            </h1>

            <div className="mb-6 space-y-4 rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-black">
                    {hebrewDictionary.searchWorker}
                </h3>

                <div className="flex gap-2">
                    <input
                        type="tel"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        placeholder={hebrewDictionary.searchByPhone}
                        dir="rtl"
                        className="flex-1 rounded-lg bg-white px-4 py-2 shadow-md"
                    />
                    <button
                        type="button"
                        onClick={handleSearchUser}
                        disabled={searching}
                        className="rounded-lg bg-[#A3C8C8] px-4 py-2 text-black hover:bg-[#88b6b6] disabled:opacity-50"
                    >
                        {searching ? "..." : <Search className="h-5 w-5" />}
                    </button>
                </div>

                {foundUser && (
                    <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                        <div className="flex items-center gap-3">
                            <User className="h-8 w-8 text-green-600" />
                            <div className="flex-1">
                                <p className="font-semibold text-green-800">{foundUser.name}</p>
                                <p className="text-sm text-green-600">{foundUser.phone}</p>
                                {foundUser.email && (
                                    <p className="text-sm text-green-600">{foundUser.email}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddWorker}
                                className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                {hebrewDictionary.addWorker}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-black">
                    {hebrewDictionary.workers} ({fields.length})
                </h3>

                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 rounded-lg border border-gray-300 shadow-sm p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <User className="h-6 w-6 text-gray-600" />
                                <div>
                                    <p className="font-semibold text-black">{field.name}</p>
                                    <p className="text-sm text-gray-600">{field.phone}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {hebrewDictionary.workerWage}
                            </label>
                            <input
                                {...register(`workers.${index}.wage` as const, { valueAsNumber: true })}
                                type="number"
                                placeholder={hebrewDictionary.workerWage}
                                className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
                            />
                            {errors.workers?.[index]?.wage && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.workers[index].wage.message}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p>{hebrewDictionary.noWorkersAddedYet}</p>
                        <p className="text-sm">{hebrewDictionary.searchWorkerToAdd}</p>
                    </div>
                )}
            </div>
        </>
    );
} 