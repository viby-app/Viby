import { User } from "lucide-react";
import Button from "./button";
import { getPreSignedUrlFromKey } from "~/utils/functions/imageFunctions";
import { useState, useEffect } from "react";
import ImageWithDynamicSrc from "./image";
import { hebrewDictionary } from "~/utils/constants";
import { api } from "~/utils/api";
import { showSuccessToast } from "./successToast";

interface UserCardProps {
  id: string;
  name: string;
  image: string | null;
}

const UserCard = ({ name, image, id }: UserCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connectUsers = api.user.createUserConnection.useMutation({
    onSuccess: () => {
      setIsConnected(true);
      showSuccessToast(hebrewDictionary.connectionRequestSent);
    },
  });

  useEffect(() => {
    const fetchImage = async () => {
      if (image) {
        const url = await getPreSignedUrlFromKey(image);
        setImageUrl(url);
      }
    };
    void fetchImage();
  }, [image]);

  return (
    <div className="flex flex-row justify-between rounded-lg p-4">
      <div className="flex flex-row items-center space-x-4">
        {imageUrl ? (
          <ImageWithDynamicSrc
            height={25}
            width={25}
            src={imageUrl}
            alt="User Avatar"
            className="h-12 w-12 rounded-full"
          />
        ) : (
          <User />
        )}
        <p>{name}</p>
      </div>

      <div>
        <Button
          onClick={() => connectUsers.mutate({ userId: id })}
          disabled={connectUsers.isPending || isConnected}
          className="bg-opacity-30 mx-2 rounded-full bg-[rgba(72,166,167,0.3)] text-black hover:bg-[#3d8d8f]"
        >
          {isConnected ? hebrewDictionary.connected : hebrewDictionary.connect}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
