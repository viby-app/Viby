"use client";
import {
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "~/components/button";
import ImageWithDynamicSrc from "~/components/image";
import Layout from "~/components/layout";
import { numberToWeekday, formatTime } from "~/lib/utils";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const BusinessPage: NextPage = () => {
  const [optimisticFollowing, setOptimisticFollowing] = useState<
    boolean | null
  >(null);
  const { data: session, status: userStatus } = useSession();
  const router = useRouter();
  const businessId = Number(router.query.businessId);

  const enabled = !isNaN(businessId);

  const { data: business, isLoading: isBusinessLoading } =
    api.business.getBusinessById.useQuery({ id: businessId }, { enabled });
  const { data: images, isLoading: isImagesLoading } =
    api.image.getImagesByBusinessId.useQuery({ businessId }, { enabled });
  const { data: businessTimes } = api.business.getBusinessTimesById.useQuery(
    { businessId },
    { enabled },
  );

  const {
    data: isFollowing,
    refetch: refetchFollowing,
    isLoading: isFollowingLoading,
  } = api.business.isUserFollowingBusiness.useQuery(
    { businessId, userId: session?.user.id ?? "" },
    { enabled: !!session?.user.id && enabled },
  );

  useEffect(() => {
    if (typeof isFollowing === "boolean") {
      setOptimisticFollowing(isFollowing);
    }
  }, [isFollowing]);

  const handleFollow = api.business.addFollowerBusiness.useMutation({
    onSuccess: () => {
      void refetchFollowing();
    },
    onError: (err) => toast.error("Follow error:" + err.message.toString()),
  });

  const handleUnfollow = api.business.removeFollowerBusiness.useMutation({
    onSuccess: () => {
      void refetchFollowing();
    },
    onError: (err) => toast.error("Unfollow error:" + err.message.toString()),
  });

  const handleFollowing = () => {
    if (!session?.user.id) return;
    const newFollowState = !optimisticFollowing;
    setOptimisticFollowing(newFollowState);
    if (optimisticFollowing) {
      handleUnfollow.mutate({ businessId, userId: session.user.id });
    } else {
      handleFollow.mutate({ businessId, userId: session.user.id });
    }
  };

  if (!enabled) return null;

  return (
    <Layout>
      {business && (
        <div className="m-2 mb-4 flex flex-col items-center justify-center">
          <span className="mt-5 text-4xl font-semibold text-[#006A71]">
            {business.name}
          </span>

          <div className="mt-5 flex w-full flex-col space-y-2 rounded-xl bg-[#48A6A7] p-4 text-center">
            <div className="flex flex-row space-x-2 rounded-md p-1">
              <div className="flex flex-1 items-center space-x-1 rounded-xl bg-[#9ACBD0] p-4">
                <MapPin className="h-5 w-5" aria-label="address" />
                <p className="text-md">{business.address ?? "אין כתובת"}</p>
              </div>
            </div>

            <p className="rounded-xl bg-[#9ACBD0] p-3 text-right text-sm text-gray-800">
              {business.description ?? "אין תיאור"}
            </p>

            <div className="flex space-x-2">
              <Button className="mt-3 w-1/3 self-end">לקבוע תור</Button>
              <Button
                onClick={handleFollowing}
                disabled={
                  handleFollow.isPending ||
                  handleUnfollow.isPending ||
                  isFollowingLoading
                }
                className="mt-3 w-1/3 self-end"
              >
                {userStatus === "loading" ||
                isFollowingLoading ||
                handleFollow.isPending ||
                handleUnfollow.isPending ? (
                  <div className="loading" />
                ) : optimisticFollowing ? (
                  "לא לעקוב"
                ) : (
                  "לעקוב"
                )}
              </Button>
            </div>

            <div className="mt-4 flex space-x-2 rounded-md p-1">
              <a
                href={`tel:${business.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 justify-center space-x-1 rounded-xl bg-[#9ACBD0] p-4"
              >
                <Phone className="h-5 w-5" aria-label="call" />
              </a>
              <a
                href={business.whatsappLink ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 justify-center space-x-1 rounded-xl bg-[#9ACBD0] p-4"
              >
                <MessageCircle className="h-5 w-5" aria-label="whatsapp" />
              </a>
              <a
                href={business.instagramLink ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 justify-center space-x-1 rounded-xl bg-[#9ACBD0] p-4"
              >
                <Instagram className="h-5 w-5" aria-label="instagram" />
              </a>
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-[#006A71]">
              גלריה
            </h2>
            <div className="flex flex-row justify-center space-x-2 overflow-x-auto">
              {(isImagesLoading || isBusinessLoading) && (
                <div className="skeleton h-48 w-48 animate-pulse rounded-md bg-gray-200" />
              )}
              {!isImagesLoading && images?.length === 0 && (
                <div className="skeleton h-48 w-48 rounded-md bg-gray-200" />
              )}
              <div className="carousel rounded-box h-1/2 w-full">
                {images?.map((image) => (
                  <div className="carousel-item w-full" key={image.id}>
                    <ImageWithDynamicSrc
                      width={400}
                      height={500}
                      src={`/api/image/${image.key}`}
                      alt={`Business image ${image.id}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center">
              {businessTimes && businessTimes.length > 0 && (
                <>
                  <h2 className="mt-5 mb-2 text-2xl font-semibold text-[#006A71]">
                    שעות פעילות
                  </h2>
                  <div className="flex w-4/5 flex-col space-y-2 rounded-md bg-[#9ACBD0] p-4">
                    {businessTimes?.map((day) => (
                      <div
                        key={day.dayOfWeek}
                        className="flex flex-row justify-between"
                      >
                        <p className="text-md">
                          {numberToWeekday(day.dayOfWeek)}
                        </p>
                        <p className="text-md">
                          {formatTime(day.openTime)} -{" "}
                          {formatTime(day.closeTime)}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BusinessPage;
