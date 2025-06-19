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

      <div className="relative">
        <input
          {...register("whatsapp")}
          placeholder={hebrewDictionary.whatsappLink}
          className="w-full rounded-lg bg-white px-4 py-2 pr-10 shadow-md"
        />
        <MessageCircle className="absolute top-2.5 right-3 text-green-500" />
      </div>

      <div className="relative">
        <input
          {...register("instagram")}
          placeholder={hebrewDictionary.instagramLink}
          className="w-full rounded-lg bg-white px-4 py-2 pr-10 shadow-md"
        />
        <Instagram className="absolute top-2.5 right-3 text-black" />
      </div>
    </>
  );
}
