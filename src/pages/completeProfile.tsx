"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/button";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import router from "next/router";

const completeProfileSchema = z.object({
  phone: z.string().min(6, "Phone number is required"),
  isBusinessOwner: z.boolean(),
});

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export default function CompleteProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: "",
      isBusinessOwner: false,
    },
  });

  const updateUserMutation = api.user.firstLoginUpdateUser.useMutation();

  const onSubmit = (data: CompleteProfileFormValues) => {
    try {
      updateUserMutation.mutate(
        {
          phone: data.phone,
          role: data.isBusinessOwner ? "BUSINESS_OWNER" : "USER",
        },
        {
          onSuccess: () =>
            void router.push(data.isBusinessOwner ? "/profile/business" : "/"),
        },
      );
    } catch (error) {
      toast.error(`Error updating user: ${String(error)}`);
    }
  };

  const TEXT = {
    completeProfile: "השלם את הפרופיל שלך",
    phone: "טלפון",
    isBusinessOwner: "אני בעל עסק",
    submit: "שלח",
  };

  return (
    <div>
      <div className="flex h-screen items-center justify-center bg-[#F2EFE7]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="m-5 flex h-1/2 w-full max-w-md flex-col justify-between rounded-lg bg-[#9ACBD0] p-6 shadow-md"
        >
          <div className="space-y-6">
            <h1 className="text-center text-2xl font-bold text-[#3A3A3A]">
              {TEXT.completeProfile}
            </h1>

            <div>
              <label className="block text-sm font-medium text-[#3A3A3A]">
                {TEXT.phone}
              </label>
              <input
                {...register("phone")}
                className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-[#3A3A3A] shadow-sm focus:ring-2 focus:ring-[#3A3A3A] focus:outline-none"
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register("isBusinessOwner")}
                type="checkbox"
                className="toggle border-gray-300 bg-white text-gray-400 checked:bg-white checked:text-gray-800 focus:ring-[#3A3A3A]"
              />
              <label className="text-sm font-medium text-[#3A3A3A]">
                {TEXT.isBusinessOwner}
              </label>
            </div>
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              {TEXT.submit}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
