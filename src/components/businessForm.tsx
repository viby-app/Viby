"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  completeBusinessSchema,
  type CompleteBusinessForm,
  type ServicesWithWorkers,
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
import {
  fetchImageUrlFromKey,
  getPreSignedUrlFromKey,
  uploadGallery,
  uploadImage,
} from "~/utils/functions/imageFunctions";
import { businessRoute } from "~/helpers/routes";

interface BusinessFormProps {
  initialValues?: CompleteBusinessForm;
  mode?: "create" | "edit";
}

const BusinessFormComponent = ({
  initialValues,
  mode = "create",
}: BusinessFormProps) => {
  const [step, setStep] = useState(0);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);
  const [direction, setDirection] = useState(0);
  const [submissionStep, setSubmissionStep] = useState<number | null>(null);
  const createBusinessMutation = api.business.createBusiness.useMutation();
  const updateBusinessMutation = api.business.updateBusiness.useMutation();
  const createServicesMutation = api.service.createMultiple.useMutation();
  const createServicesWorkersAndLinkMutation =
    api.service.createServicesWorkersAndLink.useMutation();
  const createWorkerMutation = api.workers.createWorker.useMutation();
  const createOpeningHoursMutation =
    api.business.createOpeningHours.useMutation();
  const uploadImageMutation = api.image.uploadImage.useMutation();
  let businessId: number | undefined;

  const router = useRouter();

  const [servicesWorkers, setServicesWorkers] = useState<ServicesWithWorkers>(
    [],
  );

  const goNext = () => {
    setDirection(-1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
    if (step === 3) {
      const currentServices = watch("services") ?? [];
      const newServicesWorkers = [
        ...servicesWorkers,
        ...currentServices.map((service) => ({ ...service, workers: [] })),
      ];
      setServicesWorkers(newServicesWorkers);
      setValue("services", newServicesWorkers);
    }
  };

  const goBack = () => {
    setDirection(1);
    if (step === 3) {
      const currentServices = watch("services") ?? [];
      const nonEmptyServices = removeEmptyServices(currentServices);
      if (Array.isArray(nonEmptyServices)) {
        setValue("services", nonEmptyServices);
      } else {
        setValue("services", []);
      }
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
    defaultValues: initialValues,
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
      if (mode === "edit" && businessId) {
        await updateBusinessMutation.mutateAsync(
          { id: businessId, ...data },
          {
            onSuccess: () => showSuccessToast(hebrewDictionary.businessUpdated),
            onError: (error) => {
              logger.error("Business update error:", error);
              showSuccessToast(hebrewDictionary.errorUpdatingBusiness);
            },
          },
        );
      } else {
        businessId = await createBusinessMutation.mutateAsync(data, {
          onSuccess: () => showSuccessToast(hebrewDictionary.businessCreated),
          onError: (error) => {
            logger.error("Business creation error:", error);
            showSuccessToast(hebrewDictionary.errorCreatingBusiness);
          },
        });
      }
    } catch (error) {
      logger.error("Business creation failed:", error);
      setSubmissionStep(null);
      return;
    }

    setSubmissionStep(2);
    if (businessId && servicesWorkers.length > 0) {
      try {
        await createServicesWorkersAndLinkMutation.mutateAsync({
          businessId: businessId,
          services: servicesWorkers,
        });
      } catch (error) {
        logger.error(
          "Services and workers creation/linking failed:",
          error instanceof Error ? error.message : String(error),
        );
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
        logger.error(
          "Opening hours creation failed:",
          error instanceof Error ? error.message : String(error),
        );
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
            onSuccess: () =>
              showSuccessToast(hebrewDictionary.successUploadingImage),
          },
        );
      } catch (error) {
        logger.error(
          "Gallery image upload error:",
          error instanceof Error ? error.message : String(error),
        );
        setSubmissionStep(null);
        return;
      }
    }

    await fetch("/api/auth/session");
    await getSession();
    await router.push(businessRoute(businessId));
    resetForm();
    setSubmissionStep(null);
  };

  useEffect(() => {
    const fetchLogo = async () => {
      if (initialValues?.logo) {
        const url = await fetchImageUrlFromKey(initialValues.logo);
        if (url) {
          setLogoUrl(url);
        }
      }
    };

    fetchLogo();
  }, [initialValues?.logo]);

  useEffect(() => {
    const fetchGallery = async () => {
      if (initialValues?.gallery && initialValues.gallery.length > 0) {
        const urls = await Promise.all(
          initialValues.gallery.map((key) => fetchImageUrlFromKey(key)),
        );

        setGalleryUrls(urls.filter((url): url is string => url !== null));
      }
    };

    fetchGallery();
  }, [initialValues?.gallery]);

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
          className="flex h-full w-full items-center justify-center"
        >
          <div className="max-h-5/6 w-full max-w-md overflow-y-scroll rounded-2xl bg-[#F2EFE7] p-6 text-right shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {submissionStep !== null ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center">
                  <div
                    className="radial-progress"
                    style={
                      {
                        "--value":
                          (100 / submissionSteps.length) * (submissionStep + 1),
                      } as React.CSSProperties
                    }
                    role="progressbar"
                  >
                    {Math.round(
                      (100 / submissionSteps.length) * (submissionStep + 1),
                    )}
                    %
                  </div>
                  {submissionSteps.map((label, idx) => (
                    <div key={idx} className="my-2 flex items-center gap-2">
                      <span
                        className={
                          submissionStep === idx
                            ? "text-primary font-bold"
                            : "hidden"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {step === 0 && (
                    <StepBusinessInfo
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      getValues={getValues}
                    />
                  )}
                  {step === 1 && (
                    <StepSocialLinks
                      register={register}
                      setValue={setValue}
                      phoneNumber={watch("phone")}
                      getValues={getValues}
                    />
                  )}
                  {step === 2 && (
                    <StepImages
                      watch={watch}
                      setValue={setValue}
                      logoPreview={logo}
                      galleryPreviews={galleryImages}
                      setLogoPreview={setLogo}
                      setGalleryPreviews={setGalleryImages}
                      logoUrl={logoUrl}
                      galleryUrls={galleryUrls}
                    />
                  )}
                  {step === 3 && (
                    <StepServices
                      control={control}
                      register={register}
                      errors={errors}
                    />
                  )}
                  {step === 4 && (
                    <StepWorkers
                      control={control}
                      register={register}
                      errors={errors}
                      servicesWorkers={servicesWorkers}
                      setServicesWorkers={setServicesWorkers}
                    />
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BusinessFormComponent;
