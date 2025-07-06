"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Instagram } from "lucide-react";
import type {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm } from "~/utils/types";
import { normalizePhoneNumber } from "~/utils/functions/helperFunctions";

type Props = {
  register: UseFormRegister<CompleteBusinessForm>;
  setValue: UseFormSetValue<CompleteBusinessForm>;
  phoneNumber: string;
  getValues: UseFormGetValues<CompleteBusinessForm>;
};

export function StepSocialLinks({
  register,
  setValue,
  getValues,
  phoneNumber,
}: Props) {
  const [instagramInput, setInstagramInput] = useState("");

  useEffect(() => {
    const current = getValues("instagram")?.replace("https://instagram.com/", "");
    if (current) setInstagramInput(current);
  }, [getValues]);

  useEffect(() => {
    if (phoneNumber) {
      const normalized = normalizePhoneNumber(phoneNumber);
      const link = `https://wa.me/${normalized}`;
      setValue("whatsapp", link);
    }
  }, [phoneNumber, setValue]);

  useEffect(() => {
    setValue("instagram", instagramInput ? `https://instagram.com/${instagramInput}` : "");
  }, [instagramInput, setValue]);

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-black">
        {hebrewDictionary.links}
      </h1>

      <div className="mb-4 flex w-full items-center justify-between gap-2 rounded-lg bg-white px-4 py-2 shadow-md">
        <input
          {...register("whatsapp")}
          placeholder={hebrewDictionary.whatsappLink}
          className="w-full focus:outline-none"
        />
        <MessageCircle className="text-green-500" />
      </div>

      <div className="mb-4 flex w-full items-center justify-between gap-2 rounded-lg bg-white px-4 py-2 shadow-md">
        <input
          placeholder={hebrewDictionary.instagramLink}
          className="w-full focus:outline-none"
          value={instagramInput}
          onChange={(e) => setInstagramInput(e.target.value)}
        />
        <Instagram className="text-black" />
      </div>
    </>
  );
}
