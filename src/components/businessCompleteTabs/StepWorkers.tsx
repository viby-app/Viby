"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm, ServicesWithWorkers, ServiceWithWorkers, UserWorker } from "~/utils/types";
import { Trash2, Search, User } from "lucide-react";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import ImageWithDynamicSrc from "../image";
import { getPreSignedUrlFromKey } from "~/utils/functions/imageFunctions";
import logger from "~/lib/logger";

type Props = {
    control: Control<CompleteBusinessForm>;
    register: UseFormRegister<CompleteBusinessForm>;
    errors: FieldErrors<CompleteBusinessForm>;
    servicesWorkers: ServiceWithWorkers[];
    setServicesWorkers: Dispatch<SetStateAction<ServicesWithWorkers>>;
};

export function StepWorkers({ control, register, errors, servicesWorkers, setServicesWorkers }: Props) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "workers",
    });

    const [searchPhone, setSearchPhone] = useState("");
    const [searching, setSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<UserWorker | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null)

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

    const handleToggleWorkerService = (
        serviceIndex: number,
        worker: { userId: string; name: string; phone: string; wage: number },
        checked: boolean
    ) => {
        setServicesWorkers((prev) =>
            prev.map((service, idx) =>
                idx === serviceIndex
                    ? {
                        ...service,
                        workers: checked
                            ? [...service.workers, worker]
                            : service.workers.filter((w) => w.userId !== worker.userId),
                    }
                    : service
            )
        );
    };

    const handleRemoveWorker = (index: number) => {
        const userId = fields[index]?.userId;
        if (userId !== undefined) {
            remove(index);
            setServicesWorkers(prev =>
                prev.map(service => ({
                    ...service,
                    workers: service.workers.filter(w => w.userId !== userId)
                }))
            );
        }
    };

    useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                if (foundUser?.image && !foundUser.image.includes("google")) {
                    const url = await getPreSignedUrlFromKey(foundUser.image);
                    setProfileImageUrl(url);
                } else {
                    setProfileImageUrl(foundUser?.image ?? "");
                }
            } catch (err) {
                logger.error("Failed to fetch image URL:", err);
                setProfileImageUrl("");
            }
        };
        void fetchImageUrl()
    }, [foundUser])

    return (
        <>
            <h1 className="mb-2 text-center text-2xl font-bold text-black">
                {hebrewDictionary.workers}
            </h1>

            <div className="mb-4 space-y-4 rounded-lg border border-gray-200 p-4">
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
                    <div className="flex flex-col rounded-lg bg-green-50 p-4 border border-green-200">
                        <div className="flex gap-3">
                            {profileImageUrl ? <ImageWithDynamicSrc className="h-16 w-16 rounded-full" src={profileImageUrl} alt="image" height={200} width={200} />
                                : <User className="h-8 w-8 text-green-600" />}
                            <div className="flex-1">
                                <p className="font-semibold text-green-800">{foundUser.name}</p>
                                <p className="text-sm text-green-600">{foundUser.phone}</p>
                                {foundUser.email && (
                                    <p className="text-sm text-green-600">{foundUser.email}</p>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleAddWorker}
                            className="rounded-lg self-end mt-2 bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                            {hebrewDictionary.addWorker}
                        </button>
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
                                onClick={() => handleRemoveWorker(index)}
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
                            {
                                servicesWorkers.length > 0 && (
                                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                                        {servicesWorkers
                                            .map((service, serviceIdx) => {
                                                const isChecked = service.workers.some(w => w.userId === field.userId);
                                                return (
                                                    <label key={serviceIdx} className="flex items-center gap-1 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox checkbox-sm"
                                                            checked={isChecked}
                                                            onChange={e => handleToggleWorkerService(
                                                                serviceIdx,
                                                                {
                                                                    userId: field.userId,
                                                                    name: field.name,
                                                                    phone: field.phone,
                                                                    wage: field.wage ?? 0,
                                                                },
                                                                e.target.checked
                                                            )}
                                                        />
                                                        <span>{service.name}</span>
                                                    </label>
                                                );
                                            })
                                        }
                                    </div>
                                )
                            }
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