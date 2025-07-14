import Image from "next/image";
import ImagesComponent from "../imagesComponent";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { getPreSignedUrlFromKey } from "~/utils/functions/imageFunctions";
import { fetchImageUrl } from "~/utils/profileUtils";
import Stars from "../ratingStars";

interface Props {
  businessId: number;
}

const BusinessCard: React.FC<Props> = ({ businessId }) => {
  const [preSignedUrls, setPreSignedUrls] = useState<string[]>();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoLoading, setLogoLoading] = useState<boolean>(true);
  const { data: business, isLoading: isBusinessLoading } =
    api.business.getBusinessById.useQuery({
      id: businessId,
    });
  const { data: images, isLoading: isImagesLoading } =
    api.image.getImagesByBusinessId.useQuery(
      { businessId: business?.id ?? 0 },
      { enabled: !!business?.id },
    );

  const { data: ratings } =
    api.business.getBusinessRatingsByBusinessId.useQuery({
      businessId: business?.id ?? 0,
    });

  useEffect(() => {
    const fetchUrls = async () => {
      if (!images) return;

      const urls = await Promise.all(
        images.map((image) => getPreSignedUrlFromKey(image.key)),
      );
      setPreSignedUrls(urls);
    };

    void fetchUrls();
  }, [images]);

  useEffect(() => {
    if (business?.logo) {
      void fetchImageUrl(setLogoLoading, business.logo, setLogoUrl);
    }
  }, [business?.logo]);

  return (
    <div className="flex h-[400px] w-full max-w-sm flex-col rounded-2xl border-4 border-[#48a5a748]">
      <div className="rounded-t-xl px-4 py-2 text-center">
        <div className="flex flex-row items-center justify-start gap-2">
          {logoLoading ? (
            <div className="flex h-16 w-16 items-center justify-center">
              <div className="loading loading-spinner" />
            </div>
          ) : (
            <Image
              src={logoUrl ?? ""}
              alt="business logo"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border object-cover"
            />
          )}
          <div className="text-right">
            <h2 className="truncate text-lg font-bold">{business?.name}</h2>
            <p className="truncate text-sm text-gray-700">
              {business?.address}
            </p>
            <Stars rating={parseFloat(ratings ?? "0")} />
          </div>
        </div>
      </div>

      <div className="relative h-full w-full overflow-hidden">
        {!preSignedUrls ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="loading loading-spinner" />
          </div>
        ) : (
          <ImagesComponent
            images={preSignedUrls}
            isBusinessLoading={isBusinessLoading}
            isImagesLoading={isImagesLoading}
          />
        )}
      </div>
    </div>
  );
};

export default BusinessCard;
