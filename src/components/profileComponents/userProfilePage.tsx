import React, { useEffect, useState, type FC } from "react";
import Layout from "~/components/layout";
import { api } from "~/utils/api";
import { ChevronLeft } from "lucide-react";
import { hebrewDictionary } from "../../utils/constants";
import Link from "next/link";
import AppointmentCard from "~/components/appointmentCard";
import { motion } from "framer-motion";
import { LoadingSpinner } from "~/components/loadingSpinner";
import { fetchImageUrl } from "~/utils/profileUtils";
import Card from "~/components/cardComponent";
import ProfileHeadPage from "~/components/profileComponents/profileHeadPage";
import ImageAndNameComponent from "~/components/profileComponents/imageAndNameComponent";
import type { ProfileProps } from "~/utils/types";

const UserProfilePage: FC<ProfileProps> = ({ user, isUserLoading }) => {
  const [userFriends, setUserFriends] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

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
    void fetchImageUrl(setImageLoading, user?.image, setImageUrl);
  }, [user?.image]);

  useEffect(() => {
    if (linkedUsers) {
      setUserFriends(linkedUsers.length);
    }
  }, [linkedUsers]);

  if (isUserLoading) {
    return LoadingSpinner();
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
        <Card>
          {user && (
            <>
              <div>
                <ProfileHeadPage firstName={firstName} />
                <div className="m-4 flex items-center justify-between">
                  <ImageAndNameComponent
                    imageLoading={imageLoading}
                    imageUrl={imageUrl}
                    name={user?.name}
                  />
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
                  className="flex items-center justify-between rounded-lg px-4 py-3 transition duration-200 hover:bg-gray-300"
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
                  className="flex items-center justify-between rounded-lg px-4 py-3 transition duration-200 hover:bg-gray-300"
                >
                  <h4 className="text-xl font-semibold text-gray-800">
                    {hebrewDictionary.paymentAddress}
                  </h4>
                  <ChevronLeft />
                </Link>
                <div className="divider my-0.5"></div>
              </div>
            </>
          )}{" "}
        </Card>
      </Layout>
    </motion.div>
  );
};

export default UserProfilePage;
