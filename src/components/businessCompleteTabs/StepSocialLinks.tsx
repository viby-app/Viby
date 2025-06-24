import { useEffect } from "react";
import { MessageCircle, Instagram } from "lucide-react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm } from "~/utils/types";
import { normalizePhoneNumber } from "~/utils/functions/helperFunctions";

type Props = {
  register: UseFormRegister<CompleteBusinessForm>;
  setValue: UseFormSetValue<CompleteBusinessForm>;
  phoneNumber: string;
};

export function StepSocialLinks({ register, setValue, phoneNumber }: Props) {
  useEffect(() => {
    if (phoneNumber) {
      const normalized = normalizePhoneNumber(phoneNumber);
      const link = `https://wa.me/${normalized}`;
      setValue("whatsapp", link);
    }
  }, [phoneNumber, setValue]);

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-black">
        {hebrewDictionary.links}
      </h1>

      <div className="flex items-center justify-between gap-2 mb-4 w-full rounded-lg bg-white px-4 py-2 shadow-md">
        <input
          {...register("whatsapp")}
          placeholder={hebrewDictionary.whatsappLink}
          className="w-full focus:outline-none"
        />
        <MessageCircle className="text-green-500" />
      </div>

      <div className="flex items-center justify-between gap-2 mb-4 w-full rounded-lg bg-white px-4 py-2 shadow-md">
        <input
          placeholder={hebrewDictionary.instagramLink}
          className="w-full focus:outline-none"
          onChange={(e) => setValue("instagram", `https://instagram.com/${e.target.value}`)}
        />
        <Instagram className="text-black" />
      </div>
    </>
  );
}
