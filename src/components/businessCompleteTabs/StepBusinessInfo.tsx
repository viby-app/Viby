import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm } from "~/utils/types";

type Props = {
  register: UseFormRegister<CompleteBusinessForm>;
  errors: FieldErrors<CompleteBusinessForm>;
};

export function StepBusinessInfo({ register, errors }: Props) {
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

      <div>
        <label className="mb-1 block font-medium">
          {hebrewDictionary.businessAddress}
        </label>
        <input
          {...register("address")}
          className="w-full rounded-lg bg-white px-4 py-2 shadow-md"
        />
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
