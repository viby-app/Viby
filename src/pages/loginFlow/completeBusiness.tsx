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
import { hebrewDictionary, steps, submissionSteps } from "~/utils/constants";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";
import logger from "~/lib/logger";
import { showSuccessToast } from "~/components/successToast";
import { useRouter } from "next/router";
import { swipeVariants } from "~/utils";
import { StepServices } from "~/components/businessCompleteTabs/StepServices";
import { StepWorkers } from "~/components/businessCompleteTabs/StepWorkers";
import { StepWorkingHours } from "~/components/businessCompleteTabs/StepWorkingHours";
import { getSession } from "next-auth/react";
import { removeEmptyServices } from "~/utils/functions/helperFunctions";
import { uploadGallery, uploadImage } from "~/utils/functions/imageFunctions";

export default function BusinessForm() {
  const [step, setStep] = useState(0);
  const [logo, setLogo] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [direction, setDirection] = useState(0);
  const [submissionStep, setSubmissionStep] = useState<number | null>(null);
  const createBusinessMutation = api.business.createBusiness.useMutation();
  const createServicesMutation = api.service.createMultiple.useMutation();
  const createWorkerMutation = api.workers.createWorker.useMutation();
  const createOpeningHoursMutation = api.business.createOpeningHours.useMutation();
  const uploadImageMutation = api.image.uploadImage.useMutation();
  let businessId: number | undefined;
  const router = useRouter();

  const goNext = () => {
    setDirection(-1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => {
    setDirection(1);
    if (step === 3) {
      const currentServices = watch("services") ?? [];
      const nonEmptyServices = removeEmptyServices(currentServices);
      setValue("services", nonEmptyServices);
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  const resetForm = () => {
    setStep(0);
    setDirection(-1);
    setLogo(null);
    setGalleryImages(null);
    setSubmissionStep(null);
    reset();
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm<CompleteBusinessForm>({
    resolver: zodResolver(completeBusinessSchema),
  });

  const onSubmit = async (data: CompleteBusinessForm) => {
    if (step < steps.length - 1) {
      goNext();
      return;
    }

    setSubmissionStep(0);

    if (logo && data.logo) {
      await uploadImage(logo, data.logo);
    }

    setSubmissionStep(1);
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
      setSubmissionStep(null);
      return;
    }

    setSubmissionStep(2);
    if (data.services && businessId) {
      try {
        await createServicesMutation.mutateAsync({
          businessId,
          services: data.services,
        });
      } catch (error) {
        logger.error("Services creation failed:", error);
      }
    }

    setSubmissionStep(3);
    if (data.workers && businessId) {
      try {
        await Promise.all(
          data.workers.map((worker) =>
            createWorkerMutation.mutateAsync({
              businessId: businessId!,
              userId: worker.userId,
              wage: worker.wage,
            })
          )
        );
      } catch (error) {
        logger.error("Workers creation failed:", error);
      }
    }

    setSubmissionStep(4);
    if (data.workingHours && businessId) {
      try {
        await createOpeningHoursMutation.mutateAsync({
          businessId,
          workingHours: data.workingHours,
        });
      } catch (error) {
        logger.error("Opening hours creation failed:", error);
      }
    }

    setSubmissionStep(5);
    if (
      galleryImages &&
      Array.isArray(data.gallery) &&
      data.gallery.length === galleryImages.length &&
      data.gallery.every((key) => typeof key === "string" && key.length > 0)
    ) {
      try {
        await uploadGallery(galleryImages, data.gallery);
        await uploadImageMutation.mutateAsync(
          {
            images: data.gallery ?? [],
            businessId,
          },
          {
            onSuccess: () => showSuccessToast("תמונות הגלריה הועלו בהצלחה!"),
          },
        );
      } catch (error) {
        logger.error("Gallery image upload error:", error);
        setSubmissionStep(null);
        return;
      }
    }

    setSubmissionStep(null);
    resetForm();
    await fetch("/api/auth/session");
    await getSession();
    void router.push("/business/" + businessId);
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
              {submissionStep !== null ? (
                <div className="flex flex-col items-center justify-center min-h-[300px]">
                  <div
                    className="radial-progress"
                    style={{ "--value": 100 / submissionSteps.length * (submissionStep + 1) } as React.CSSProperties}
                    role="progressbar"
                  >
                    {Math.round(100 / submissionSteps.length * (submissionStep + 1))}%
                  </div>
                  {submissionSteps.map((label, idx) => (
                    <div key={idx} className="flex items-center gap-2 my-2">
                      <span className={submissionStep === idx ? "font-bold text-primary" : "hidden"}>{label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {step === 0 && (
                    <StepBusinessInfo register={register} errors={errors} setValue={setValue} getValues={getValues
                    } />
                  )}
                  {step === 1 && <StepSocialLinks register={register} setValue={setValue} phoneNumber={watch("phone")} />}
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
                  {step === 3 && (
                    <StepServices control={control} register={register} errors={errors} />
                  )}
                  {step === 4 && (
                    <StepWorkers control={control} register={register} errors={errors} />
                  )}
                  {step === 5 && (
                    <StepWorkingHours control={control} register={register} />
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
                      disabled={submissionStep !== null}
                    >
                      {step < steps.length - 1
                        ? hebrewDictionary.next
                        : submissionStep !== null
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
                </>
              )}
            </form>
          </div>
        </motion.div >
      </AnimatePresence >
    </div >
  );
}
