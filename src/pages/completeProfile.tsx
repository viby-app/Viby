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
            data.isBusinessOwner
              ? router.push("/profile/business")
              : router.push("/"),
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
          className="h-1/2 w-5/6 space-y-4 rounded-lg bg-[#9ACBD0] p-6 shadow-md"
        >
          <h1 className="text-center text-2xl font-bold text-[#3A3A3A]">
            {TEXT.completeProfile}
          </h1>

          <div>
            <label className="block text-sm font-medium">{TEXT.phone}</label>
            <input
              {...register("phone")}
              className="mt-1 w-full rounded-md border p-2"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              {...register("isBusinessOwner")}
              type="checkbox"
              className="rounded border-gray-300"
            />
            <label className="text-sm font-medium">
              {TEXT.isBusinessOwner}
            </label>
          </div>

          <Button type="submit">{TEXT.submit}</Button>
        </form>
      </div>
    </div>
  );
}
