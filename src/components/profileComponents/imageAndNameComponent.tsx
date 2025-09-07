import Image from "next/image";
import { CircleUserIcon } from "lucide-react";

interface ImageAndNameComponentProps {
  imageLoading: boolean;
  imageUrl?: string;
  name?: string;
}
const ImageAndNameComponent = ({
  imageLoading,
  imageUrl,
  name
}: ImageAndNameComponentProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16">
        {imageLoading ? (
          <div className="flex h-16 w-16 items-center justify-center">
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
        <p className="text-lg font-semibold text-gray-800">{name}</p>
      </div>
    </div>
  );
};

export default ImageAndNameComponent;