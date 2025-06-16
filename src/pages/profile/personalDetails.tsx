"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "~/components/layout";
import Card from "../../components/cardComponent";
import { api } from "~/utils/api";
import { hebrewDictionary } from "~/utils/constants";
import Image from "next/image";
import { ArrowLeft, CircleUserIcon, Save } from "lucide-react";
import { useRouter } from "next/router";
import type { UserDataForm } from "../../utils/types";
import { deleteImage, getPreSignedUrlFromKey } from "~/utils/imageFunctions";
import ImageConfirmModal from "~/components/imageConfirmModal";
import logger from "~/lib/logger";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { showSuccessToast } from "~/components/successToast";

const PersonalDetailsPage = () => {
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: userRefetch,
  } = api.user.getUser.useQuery();
  const updateUserMutation = api.user.updateUser.useMutation();
  const updateImageMutation = api.user.updateImage.useMutation();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showConfirmImageModal, setShowConfirmImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      setImageLoading(true);
      try {
        if (user?.image && !user.image.includes("google")) {
          const url = await getPreSignedUrlFromKey(user.image);
          setImageUrl(url);
        } else {
          setImageUrl(user?.image ?? "");
        }
      } catch (err) {
        logger.error("Failed to fetch image URL:", err);
        setImageUrl("");
      } finally {
        setImageLoading(false);
      }
    };

    void fetchImageUrl();
  }, [user?.image]);

  const handleUpload = async () => {
    setImageLoading(true);
    if (!profileImage) return;

    const imageName = `${uuidv4()}-${profileImage.name}`;

    try {
      const formData = new FormData();
      formData.append("file", profileImage);
      formData.append("key", imageName);

      const res = await fetch("/api/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      if (user?.image) {
        try {
          await deleteImage(user.image);
        } catch (err) {
          logger.error("Failed to delete previous image", err);
        }
      }

      updateImageMutation.mutate(
        { image: imageName },
        {
          onSuccess: () => void userRefetch(),
          onError: (error) => logger.error("Image update failed:", error),
        },
      );

      setProfileImage(null);
    } catch (err) {
      logger.error("Failed to upload image:", err);
    } finally {
      setShowConfirmImageModal(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UserDataForm>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserDataForm) => {
    if (!user) return;

    try {
      updateUserMutation.mutate(
        {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
        {
          onSuccess: () => {
            reset(data);
            void userRefetch();
            showSuccessToast(hebrewDictionary.updateSuccess);
          },
          onError: (error) => {
            logger.error("Failed to update user data:", error);
          },
        },
      );
    } catch (err) {
      logger.error("Unexpected error during form submission:", err);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="loading loading-bars" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 18 }}
      style={{ willChange: "transform, opacity" }}
    >
      <Layout>
        <Card>
          {user && (
            <div
              className="relative flex min-h-screen flex-col items-center justify-start px-1 py-2 text-right"
              dir="rtl"
            >
              <div className="relative top-1 mb-3 flex w-full items-center justify-center">
                <ArrowLeft
                  className="absolute left-0.5 cursor-pointer rounded-full hover:bg-gray-200"
                  onClick={() => router.push("/profile")}
                />
                <h1 className="text-2xl font-extrabold text-gray-800">
                  {hebrewDictionary.personalDetails}
                </h1>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative h-16 w-16">
                  {imageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="loading loading-spinner" />
                    </div>
                  ) : imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="User"
                      width={68}
                      height={68}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <CircleUserIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>

                <label className="mt-2 cursor-pointer text-sm text-[#095867] hover:underline">
                  {hebrewDictionary.editImage}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      logger.info("File input changed:", e.target.files);
                      const file = e.target.files?.[0];
                      if (file) {
                        setProfileImage(file);
                        setShowConfirmImageModal(true);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex w-full max-w-md flex-col gap-4 text-right"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">
                    {hebrewDictionary.name}
                  </label>
                  <input
                    {...register("name", {
                      required: hebrewDictionary.NameRequired,
                    })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-right text-lg font-semibold text-black shadow-xs"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">
                    {hebrewDictionary.email}
                  </label>
                  <input
                    {...register("email", {
                      required: hebrewDictionary.MailRequired,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: hebrewDictionary.InvalidMail,
                      },
                    })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-right text-lg font-semibold text-black shadow-xs"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-800">
                    {hebrewDictionary.phone}
                  </label>
                  <input
                    {...register("phone", {
                      pattern: {
                        value: /^[0-9]{9,12}$/,
                        message: hebrewDictionary.InvalidPhoneNumber,
                      },
                    })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-right text-lg font-semibold text-black shadow-xs"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {isDirty && (
                  <div className="mt-4 text-center">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#095867] px-4 py-2 text-white transition hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </Card>
        <ImageConfirmModal
          showModal={showConfirmImageModal}
          image={profileImage}
          setShowModal={setShowConfirmImageModal}
          handleUpload={handleUpload}
          setProfileImage={setProfileImage}
        />
      </Layout>
    </motion.div>
  );
};

export default PersonalDetailsPage;
