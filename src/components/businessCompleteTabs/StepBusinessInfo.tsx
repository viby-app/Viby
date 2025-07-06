"use client";

import { useState } from "react";
import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import { formatShortAddress } from "~/utils/functions/helperFunctions";
import type { CompleteBusinessForm, GeoapifyResult } from "~/utils/types";
import { useGeoapifySearch } from "~/hooks/useAddressSearch";

type Props = {
  register: UseFormRegister<CompleteBusinessForm>;
  errors: FieldErrors<CompleteBusinessForm>;
  setValue: UseFormSetValue<CompleteBusinessForm>;
  getValues: UseFormGetValues<CompleteBusinessForm>;
};

export function StepBusinessInfo({ register, errors, setValue, getValues }: Props) {
  const [input, setInput] = useState(getValues("address") ?? "");
  const { results, loading } = useGeoapifySearch(input);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (address: GeoapifyResult) => {
    setInput(formatShortAddress(address));
    setValue("address", formatShortAddress(address));
    setValue("lat", address.lat);
    setValue("lon", address.lon);
    setShowDropdown(false);
  };

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-black">
        {hebrewDictionary.businessDetails}
      </h1>

      <div>
        <label className="mb-1 block font-medium">
          {hebrewDictionary.businessName}
        </label>
        <input
          {...register("name")}
          className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">
          {hebrewDictionary.businessDescription}
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full resize-none rounded-lg bg-white px-4 py-2 shadow-md"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="relative">
        <label className="mb-1 block font-medium">
          {hebrewDictionary.businessAddress}
        </label>
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
          }}
          autoComplete="off"
          className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
        />
        {loading && <div className="loading loading-dots" />}
        {showDropdown && results.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto rounded-lg bg-white shadow-lg border border-gray-200">
            {results.map((res, i) => (
              <li
                key={i}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                onClick={() => handleSelect(res)}
              >
                {formatShortAddress(res)}
              </li>
            ))}
          </ul>
        )}
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-medium">
          {hebrewDictionary.phone}
        </label>
        <input
          {...register("phone")}
          className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>
    </>
  );
}
