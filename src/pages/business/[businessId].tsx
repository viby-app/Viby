"use client";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Button from "~/components/button";
import ImageWithDynamicSrc from "~/components/image";
import Layout from "~/components/layout";
import { api } from "~/utils/api";

const BusinessPage: NextPage = () => {
  const router = useRouter();
  const { businessId } = router.query;

  const { data: business, isLoading: isBusinessLaoding } =
    api.business.getBusinessById.useQuery(
      {
        id: Number(businessId),
      },
      { enabled: !!businessId },
    );

  const { data: images, isLoading: isImagesLoading } =
    api.image.getImagesByBusinessId.useQuery(
      {
        businessId: Number(businessId),
      },
      { enabled: !!businessId },
    );

  return (
    <Layout>
      {business ? (
        <div className="flex flex-col items-center justify-center">
          <span className="mt-5 text-4xl font-semibold text-[#006A71]">
            {business.name}
          </span>
          <div className="mt-5 flex w-full flex-col space-y-2 bg-[#48A6A7] p-4 text-center">
            <div className="flex w-full flex-row space-x-2 rounded-md p-1 sm:h-1/4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <div className="flex flex-1 items-center space-x-1 rounded-xl bg-[#9ACBD0] p-4">
                <MapPin className="h-5 w-5" />
                <p className="text-md">{business.address ?? "אין כתובת"}</p>
              </div>
            </div>
            <div className="mx-0.5 flex flex-col">
              <p className="rounded-xl bg-[#9ACBD0] p-3 text-right text-sm text-gray-800">
                {business.description ?? "אין תיאור"}
              </p>
              <div className="flex space-x-2">
                <Button className="mt-3 w-1/3 self-end">לקבוע תור</Button>
                <Button className="mt-3 w-1/3 self-end">לעקוב</Button>
              </div>
            </div>
            <div className="mt-4 flex w-min flex-row space-x-2 rounded-md p-1 sm:h-1/4 lg:flex-row lg:space-y-0 lg:space-x-4">
              <a
                href={`tel:${business.phone}`}
                className="flex flex-1 items-center space-x-1 rounded-xl bg-[#9ACBD0] p-4"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href={business.whatsappLink ?? "#"}
                className="flex flex-1 items-center space-x-1 rounded-xl bg-[#9ACBD0] p-4"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href={business.instagramLink ?? "#"}
                className="flex w-min flex-1 items-center space-x-1 rounded-xl bg-[#9ACBD0] p-4"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-[#006A71]">
              גלריה
            </h2>
            <div className="flex flex-row space-x-2 overflow-x-auto">
              {isImagesLoading || isBusinessLaoding ? (
                <div className="skeleton h-48 w-48 animate-pulse rounded-md bg-gray-200" />
              ) : images?.length === 0 ? (
                <p className="text-md text-gray-500">אין תמונות</p>
              ) : (
                <></>
              )}
              <div className="carousel rounded-box h-1/2 w-full">
                {images?.map((image) => (
                  <div className="carousel-item w-full" key={image.id}>
                    <ImageWithDynamicSrc
                      key={image.id}
                      width={400}
                      height={500}
                      src={`/api/image/${image.key}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Layout>
  );
};

export default BusinessPage;
