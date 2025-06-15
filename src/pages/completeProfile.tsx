"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/button";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import router from "next/router";
import { getSession } from "next-auth/react";
import { hebrewDictionary } from "~/utils/constants";
import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from "~/utils/types";

export default function CompleteProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      isBusinessOwner: false,
      gender: "OTHER",
    },
  });

  const updateUserMutation = api.user.firstLoginUpdateUser.useMutation();
  const createBusinessMutation = api.business.createBusiness.useMutation();
  const onSubmit = async (data: CompleteProfileFormValues) => {
    try {
      await updateUserMutation.mutateAsync({
        phone: data.phone,
        role: data.isBusinessOwner ? "BUSINESS_OWNER" : "USER",
        name: data.name,
        gender: data.gender,
      });
      await fetch("/api/auth/session");
      await getSession();
      if (data.isBusinessOwner) {
        await createBusinessMutation.mutateAsync({ phone: data.phone });
        toast.success(hebrewDictionary.businessCreated);
        void router.push("/profile/business");
      } else {
        toast.success(hebrewDictionary.profileUpdated);
        void router.push("/");
      }
    } catch (error) {
      toast.error(`Error: ${String(error)}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2EFE7] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl bg-[#9ACBD0] p-8 shadow-xl"
      >
        <h1 className="mb-8 text-center text-3xl font-bold text-[#3A3A3A]">
          {hebrewDictionary.completeProfile}
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              {hebrewDictionary.name}
            </label>
            <input
              {...register("name")}
              className="mt-1 w-full rounded-md bg-white p-2 text-[#3A3A3A] shadow-md"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              {hebrewDictionary.phone}
            </label>
            <input
              {...register("phone")}
              className="mt-1 w-full rounded-md bg-white p-2 text-[#3A3A3A] shadow-md"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3A3A3A]">
              {hebrewDictionary.gender}
            </label>
            <select
              {...register("gender")}
              className="mt-1 w-full rounded-md bg-white p-2 text-[#3A3A3A] shadow-md"
            >
              <option value="OTHER" disabled>
                {hebrewDictionary.chooseGender}
              </option>
              <option value="MALE">{hebrewDictionary.male}</option>
              <option value="FEMALE">{hebrewDictionary.female}</option>
              <option value="OTHER">{hebrewDictionary.other}</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              {...register("isBusinessOwner")}
              type="checkbox"
              className="toggle border-gray-300 bg-white text-gray-400 checked:bg-white checked:text-gray-800 focus:ring-[#3A3A3A]"
            />
            <label className="text-sm font-semibold text-[#3A3A3A]">
              {hebrewDictionary.isBusinessOwner}
            </label>
          </div>
        </div>

        <div className="mt-8">
          <Button type="submit" className="w-full py-3 text-lg font-semibold">
            {hebrewDictionary.confirm}
          </Button>
        </div>
      </form>
    </div>
  );
}
