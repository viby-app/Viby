import { MessageCircle, Instagram } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { hebrewDictionary } from "~/utils/constants";
import type { CompleteBusinessForm } from "~/utils/types";

type Props = {
  register: UseFormRegister<CompleteBusinessForm>;
};

export function StepSocialLinks({ register }: Props) {
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
        <MessageCircle className=" text-green-500" />
      </div>

      <div className="flex items-center justify-between gap-2 mb-4 w-full rounded-lg bg-white px-4 py-2 shadow-md">
        <input
          {...register("instagram")}
          placeholder={hebrewDictionary.instagramLink}
          className="w-full focus:outline-none"
        />
        <Instagram className="text-black" />
      </div>
    </>
  );
}
