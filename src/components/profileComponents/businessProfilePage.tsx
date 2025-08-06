import React, { useEffect, useState, type FC } from "react";
import Layout from "~/components/layout";
import { motion } from "framer-motion";
import { api } from "~/utils/api";
import { hebrewDictionary } from "../../utils/constants";
import { LoadingSpinner } from "~/components/loadingSpinner";
import { fetchImageUrl } from "~/utils/profileUtils";
import Card from "~/components/cardComponent";
import ProfileHeadPage from "~/components/profileComponents/profileHeadPage";
import ImageAndNameComponent from "~/components/profileComponents/imageAndNameComponent";
import BusinessCard from "~/components/businessCard";
import { mapBusinessToForm } from "~/utils/functions/helperFunctions";
import {
  UsersRoundIcon,
  MessageCircleIcon,
  ChartNoAxesCombinedIcon,
  BriefcaseBusinessIcon,
} from "lucide-react";
import type { DBService, DBWorker, ProfileProps } from "~/utils/types";
import EditBusinessDialog from "../editBusinessDialog";

const BusinessProfilePage: FC<ProfileProps> = ({ user, isUserLoading }) => {
  const { data: businesses, isLoading: isBusinessLoading } =
    api.user.getUserBusinesses.useQuery();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  const business = businesses ? businesses[0] : null;

  const businessId: number = business?.id ?? 0;

  const { data: images } = api.image.getImagesByBusinessId.useQuery(
    { businessId: businessId ?? 0 },
    { enabled: !!businessId },
  );
  const { data: workers } = api.workers.getBusinessWorkersWithUserInfo.useQuery(
    {
      businessId,
    },
  );

  const { data: services } = api.service.getServicesByBusinessId.useQuery({
    businessId,
  });

  const { data: workingHours } = api.business.getBusinessTimesById.useQuery(
    { businessId },
    { enabled: !isNaN(businessId) },
  );

  const flatServices: DBService[] | undefined = services?.map((s) => ({
    id: s.service.id,
    name: s.service.name,
    createdAt: s.service.createdAt,
    updatedAt: s.service.updatedAt,
    description: s.service.description,
    durationMinutes: s.service.durationMinutes,
    price: s.service.price,
    businessId: s.businessId,
    serviceId: s.serviceId,
  }));

  const enabled = !!businessId;
  const firstName = user?.name?.split(" ")[0] ?? "";

  const { data: followersCount } =
    api.business.getFollowersCountByBusinessId.useQuery(
      business ? { businessId: business.id } : { businessId: 0 },
      { enabled },
    );

  useEffect(() => {
    if (user?.image) {
      void fetchImageUrl(setImageLoading, user.image, setImageUrl);
    }
  }, [user]);

  if (isUserLoading || isBusinessLoading) {
    return <LoadingSpinner />;
  }

  if (!business) {
    return (
      <Layout>
        <div className="flex h-full flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {hebrewDictionary.userHasNoBusinesses}
          </h2>
        </div>
      </Layout>
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
        <Card>
          {user && (
            <>
              <div>
                <ProfileHeadPage firstName={firstName} />
                <div className="m-4 flex items-center justify-between">
                  <ImageAndNameComponent
                    imageLoading={imageLoading}
                    imageUrl={imageUrl}
                    name={`${hebrewDictionary.theBusinessOf} ${user?.name}`}
                  />
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {hebrewDictionary.followers}
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {followersCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-2 border-t-4 border-[#48a5a748] pt-2 text-gray-800">
                <div className="flex justify-center">
                  <span className="rounded-full text-2xl font-semibold">
                    {hebrewDictionary.myBusiness}
                    <BriefcaseBusinessIcon className="inline h-6 w-6" />
                  </span>
                </div>
              </div>

              <BusinessCard businessId={businessId} />

              <div className="mt-4 space-y-2 border-t-4 border-[#48a5a748] pt-2 text-right text-sm font-medium text-gray-800">
                <EditBusinessDialog
                  initialValues={mapBusinessToForm({
                    business,
                    images,
                    services: flatServices,
                    workers,
                    workingHours,
                  })}
                />
                <div className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
                  <span className="text-lg font-semibold text-gray-800">
                    {hebrewDictionary.myCustomers}
                  </span>
                  <UsersRoundIcon className="h-5 w-5 text-gray-800" />
                </div>
                <div className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
                  <span className="text-lg font-semibold text-gray-800">
                    {hebrewDictionary.reviews}
                  </span>
                  <MessageCircleIcon className="h-6 w-6 font-semibold text-gray-800" />
                </div>
                <div className="flex items-center justify-between px-2 py-1 hover:bg-gray-100">
                  <span className="text-lg font-semibold text-gray-800">
                    {hebrewDictionary.statistics}
                  </span>
                  <ChartNoAxesCombinedIcon className="text-gray-800] h-6 w-6" />
                </div>
              </div>
            </>
          )}
        </Card>
      </Layout>
    </motion.div>
  );
};

export default BusinessProfilePage;
