import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { CompleteBusinessForm } from "~/utils/types";
import { hebrewDictionary } from "~/utils/constants";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import Image from "next/image";

type Props = {
  setValue: UseFormSetValue<CompleteBusinessForm>;
  watch: UseFormWatch<CompleteBusinessForm>;
  logoPreview: File | null;
  galleryPreviews: FileList | null;
  setLogoPreview: Dispatch<SetStateAction<File | null>>;
  setGalleryPreviews: Dispatch<SetStateAction<FileList | null>>;
};

const StepImages = ({
  setValue,
  watch,
  logoPreview,
  galleryPreviews,
  setLogoPreview,
  setGalleryPreviews,
}: Props) => {
  const logoKey = watch("logo");
  const maxImages = 5;

  const [galleryIndex, setGalleryIndex] = useState(0);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const key = `${uuidv4()}-${file.name}`;

    setValue("logo", key);
    setLogoPreview(file);
  };

  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > maxImages) {
      toast.warning(`ניתן להעלות עד ${maxImages} תמונות בלבד.`);
    }
    const selected = Array.from(files).slice(0, maxImages);
    const uploadedKeys = selected.map((file) => `${uuidv4()}-${file.name}`);

    setValue("gallery", uploadedKeys);
    setGalleryPreviews(files);
    setGalleryIndex(0);
  };

  const next = () => {
    if (galleryPreviews) {
      setGalleryIndex((prev) => (prev + 1) % galleryPreviews.length);
    }
  };

  const prev = () => {
    if (galleryPreviews) {
      setGalleryIndex(
        (prev) => (prev - 1 + galleryPreviews.length) % galleryPreviews.length,
      );
    }
  };

  return (
    <>
      <h1 className="mb-6 text-center text-2xl font-bold text-black">
        {hebrewDictionary.images}
      </h1>
      <div className="flex items-center justify-between rounded-full bg-[#EDEAE3] p-1 shadow-inner">
        <label
          htmlFor="logo-upload"
          className="cursor-pointer rounded-full bg-[#A3C8C8] px-4 py-1 text-sm font-semibold text-black"
        >
          {hebrewDictionary.chooseLogo}
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
        <span className="px-4 text-sm text-gray-700">
          {logoKey ? logoKey.split("/").pop() : hebrewDictionary.noFileSelected}
        </span>
      </div>

      <div className="flex h-32 w-full items-center justify-center rounded-lg bg-[#D9D9D9] text-gray-600">
        {logoPreview ? (
          <Image
            src={URL.createObjectURL(logoPreview)}
            alt="logo"
            className="h-full object-contain"
          />
        ) : (
          <p>{hebrewDictionary.preview}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-full bg-[#EDEAE3] p-1 shadow-inner">
        <label
          htmlFor="gallery-upload"
          className="cursor-pointer rounded-full bg-[#A3C8C8] px-4 py-1 text-sm font-semibold text-black"
        >
          {hebrewDictionary.chooseImages}
        </label>
        <input
          id="gallery-upload"
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleGalleryChange}
        />

        <span className="px-4 text-sm text-gray-700">
          {galleryPreviews?.length
            ? `${galleryPreviews.length} קבצים נבחרו`
            : hebrewDictionary.noFileSelected}
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between">
          <button
            onClick={next}
            type="button"
            disabled={galleryPreviews?.length === 0}
            className="text-xl font-bold text-gray-600"
          >
            <CircleChevronRight />
          </button>
          <div className="mx-2 flex h-32 w-full items-center justify-center rounded-lg bg-[#D9D9D9] text-gray-600">
            {galleryPreviews?.item(galleryIndex) ? (
              <Image
                src={URL.createObjectURL(galleryPreviews.item(galleryIndex)!)}
                alt={`preview ${galleryIndex + 1}`}
                className="h-full object-contain"
              />
            ) : (
              <p>{hebrewDictionary.preview}</p>
            )}
          </div>

          <button
            onClick={prev}
            type="button"
            disabled={galleryPreviews?.length === 0}
            className="text-xl font-bold text-gray-600"
          >
            <CircleChevronLeft />
          </button>
        </div>
        <p className="mt-2 text-center text-sm font-medium text-gray-700">
          {galleryPreviews?.length
            ? `${galleryIndex + 1}/${galleryPreviews.length}`
            : "0/0"}
        </p>
      </div>
    </>
  );
};

export default StepImages;
