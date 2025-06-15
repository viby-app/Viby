import React, { useEffect, useState } from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { ChevronLeft, CircleUserIcon, MenuIcon } from "lucide-react";
import { hebrewDictionary } from "../../utils/constants";
import Link from "next/link";
import Image from "next/image";
import AppointmentCard from "~/components/appointmentCard";

import { getPreSignedUrlFromKey } from "~/utils/imageFunctions";
import { motion } from "framer-motion";
import logger from "~/lib/logger";

const ProfilePage = () => {
  const [userFriends, setUserFriends] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const { data: user, isLoading: isUserLoading } =
    api.user.getUser.useQuery();
  const firstName = user?.name!.split(" ")[0];
  const { data: linkedUsers } = api.user.getUserFriends.useQuery();
  const { data: lastAppointment, isLoading: lastAppointmentLoading } =
    api.appointment.getLastAppointmentByUserId.useQuery(
      { userId: user?.id ?? "" },
      {
        enabled: !!user?.id,
      },
    );

  useEffect(() => {
    const fetchImageUrl = async () => {
      setImageLoading(true);
      try {
        if (user?.image) {
          const url = await getPreSignedUrlFromKey(user.image);
          setImageUrl(url);
        } else {
          setImageUrl("");
        }
      } catch (error) {
        logger.error("Error fetching image URL: ", error);
        setImageUrl("");
      } finally {
        setImageLoading(false);
      }
    };

    void fetchImageUrl();
  }, [user?.image]);

  useEffect(() => {
    if (linkedUsers) {
      setUserFriends(linkedUsers.length);
    }
  }, [linkedUsers]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="loading loading-spinner h-16 w-16"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, transformOrigin: "center center" }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0, transformOrigin: "center center" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Layout>
        <div className="flex items-center justify-center bg-[#428e9d82]">
          <div className="m-5 flex min-h-screen w-full flex-col rounded-2xl border border-gray-300 bg-white p-3 shadow-2xl">
            {user && (
              <>
                <div>
                  <div className="flex flex-row-reverse items-center justify-between text-right">
                    <Link
                      href="/profile/settings"
                      className="rounded-full p-2 transition duration-200 hover:bg-gray-300"
                    >
                      <MenuIcon className="h-6 w-6 text-gray-800" />
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-800">
                      {hebrewDictionary.hey} {firstName}!
                    </h1>
                  </div>

                  <div className="m-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16">
                        {imageLoading ? (
                          <div className="absolute inset-0 flex h-16 w-16 items-center justify-center">
                            <div className="loading loading-spinner" />
                          </div>
                        ) : imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt="User"
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <CircleUserIcon className="h-16 w-16 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {user.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        {hebrewDictionary.friends}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {userFriends}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divider my-0.5"></div>

                <div>
                  <Link
                    href="/profile/personalDetails"
                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 transition duration-200 hover:bg-gray-300"
                  >
                    <h4 className="text-xl font-semibold text-gray-800">
                      {hebrewDictionary.personalDetails}
                    </h4>
                    <ChevronLeft />
                  </Link>
                  <div className="divider my-0.5"></div>
                </div>
                <div className="flex flex-col justify-between space-y-2 px-4 py-3">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {hebrewDictionary.myLastVisit}
                  </h4>
                  <AppointmentCard
                    date={lastAppointment?.date.toString() ?? ""}
                    description={lastAppointment?.description ?? ""}
                    serviceName={lastAppointment?.service.name ?? ""}
                    businessName={lastAppointment?.business.name ?? ""}
                    logo={lastAppointment?.business?.logo ?? ""}
                    lastAppointmentLoading={lastAppointmentLoading}
                  />
                </div>
                <div className="divider my-0.5"></div>
                <div className="flex flex-col items-start gap-2 px-4 py-3">
                  <h4 className="text-xl font-semibold text-gray-800">
                    {hebrewDictionary.links}
                  </h4>

                  <Link
                    href="/profile"
                    className="flex w-full items-center justify-between rounded-full p-2 transition duration-200 hover:bg-gray-300"
                  >
                    <h6 className="text-base font-semibold text-gray-800">
                      {hebrewDictionary.inviteFriends}
                    </h6>
                    <ChevronLeft />
                  </Link>
                  <Link
                    href="/profile"
                    className="flex w-full items-center justify-between rounded-full p-2 transition duration-200 hover:bg-gray-300"
                  >
                    <h6 className="text-base font-semibold text-gray-800">
                      {hebrewDictionary.appointmentsHistory}
                    </h6>
                    <ChevronLeft />
                  </Link>
                  <Link
                    href="/profile"
                    className="flex w-full items-center justify-between rounded-full p-2 transition duration-200 hover:bg-gray-300"
                  >
                    <h6 className="text-base font-semibold text-gray-800">
                      {hebrewDictionary.chatInvite}
                    </h6>
                    <ChevronLeft />
                  </Link>
                </div>
                <div className="divider my-0.5"></div>

                <div>
                  <Link
                    href="/profile/"
                    className="flex items-center justify-between rounded-lg bg-white px-4 py-3 transition duration-200 hover:bg-gray-300"
                  >
                    <h4 className="text-xl font-semibold text-gray-800">
                      {hebrewDictionary.paymentAddress}
                    </h4>
                    <ChevronLeft />
                  </Link>
                  <div className="divider my-0.5"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </Layout>
    </motion.div>
  );
};

export default ProfilePage;
