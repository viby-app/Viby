"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeBusinessSchema,
  type CompleteBusinessForm,
} from "~/utils/types";
import { StepBusinessInfo } from "~/components/businessCompleteTabs/StepBusinessInfo";
import StepImages from "~/components/businessCompleteTabs/StepImages";
import { StepSocialLinks } from "~/components/businessCompleteTabs/StepSocialLinks";
import { hebrewDictionary } from "~/utils/constants";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";
import logger from "~/lib/logger";
import { showSuccessToast } from "~/components/successToast";
import { useRouter } from "next/router";
import { swipeVariants } from "~/utils";

export default function BusinessForm() {
  const [step, setStep] = useState(0);
  const [logo, setLogo] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const steps = ["פרטי עסק", "לינקים", "תמונות"];
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createBusinessMutation = api.business.createBusiness.useMutation();
  const uploadImageMutation = api.image.uploadImage.useMutation();
  let businessId: number | undefined;
  const router = useRouter();

  const goNext = () => {
    setDirection(-1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(1);
    setStep((s) => s - 1);
  };

  const resetForm = () => {
    setStep(0);
    setDirection(-1);
    setLogo(null);
    setGalleryImages(null);
    setIsSubmitting(false);
    reset();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CompleteBusinessForm>({
    resolver: zodResolver(completeBusinessSchema),
  });

  const onSubmit = async (data: CompleteBusinessForm) => {
    if (step < steps.length - 1) {
      goNext();
      return;
    }

    setIsSubmitting(true);

    if (logo && data.logo) {
      try {
        const formData = new FormData();
        formData.append("file", logo);
        formData.append("key", data.logo);

        const res = await fetch("/api/image/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Failed to upload logo");
        }
      } catch (error) {
        logger.error("Logo upload failed:", error);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      businessId = await createBusinessMutation.mutateAsync(data, {
        onSuccess: () => showSuccessToast("העסק נוצר בהצלחה!"),
        onError: (error) => {
          logger.error("Business creation error:", error);
          showSuccessToast("שגיאה ביצירת העסק, נסה שוב מאוחר יותר.");
        },
      });
    } catch (error) {
      logger.error("Business creation failed:", error);
      setIsSubmitting(false);
      return;
    }

    if (
      galleryImages &&
      Array.isArray(data.gallery) &&
      data.gallery.length === galleryImages.length &&
      data.gallery.every((key) => typeof key === "string" && key.length > 0)
    ) {
      void (async () => {
        try {
          const formData = new FormData();

          Array.from(galleryImages).forEach((file, index) => {
            const key = data.gallery![index];
            if (!key) return;
            formData.append("file", file);
            formData.append("key", key);
          });

          const res = await fetch("/api/image/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Gallery upload failed");
          }
          if (res.ok) {
            uploadImageMutation.mutate(
              {
                images: data.gallery ?? [],
                businessId: businessId,
              },
              {
                onSuccess: () =>
                  showSuccessToast("תמונות הגלריה הועלו בהצלחה!"),
              },
            );
          }
        } catch (error) {
          logger.error("Gallery image upload error:", error);
        }
      })();
    }

    setIsSubmitting(false);
    void router.push("/business/" + businessId);
    resetForm();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#A3C8C8] p-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={swipeVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex w-full items-center justify-center"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#F2EFE7] p-6 text-right shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {step === 0 && (
                <StepBusinessInfo register={register} errors={errors} />
              )}
              {step === 1 && <StepSocialLinks register={register} />}
              {step === 2 && (
                <StepImages
                  watch={watch}
                  setValue={setValue}
                  logoPreview={logo}
                  galleryPreviews={galleryImages}
                  setLogoPreview={setLogo}
                  setGalleryPreviews={setGalleryImages}
                />
              )}
              <div className="mt-6 flex justify-between gap-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="w-full rounded-full bg-[#A3C8C8] px-4 py-2 font-semibold text-black shadow-md hover:bg-[#88b6b6]"
                  >
                    {hebrewDictionary.previous}
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#A3C8C8] px-4 py-2 font-semibold text-black shadow-md hover:bg-[#88b6b6]"
                >
                  {step < steps.length - 1
                    ? hebrewDictionary.next
                    : isSubmitting
                      ? hebrewDictionary.submittingBusiness
                      : hebrewDictionary.confirm}
                </button>
              </div>

              <div className="mt-4 flex justify-center space-x-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${step === i ? "bg-[#1C857A]" : "bg-[#D9D9D9]"}`}
                  />
                ))}
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
