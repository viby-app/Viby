import logger from "~/lib/logger";
import { getPreSignedUrlFromKey } from "./imageFunctions";

export const fetchImageUrl = async (
  setImageLoading: React.Dispatch<React.SetStateAction<boolean>>,
  userImage: string | null | undefined,
  setImageUrl: React.Dispatch<React.SetStateAction<string>>,
) => {
  setImageLoading(true);
  try {
    if (userImage) {
      const url = await getPreSignedUrlFromKey(userImage);
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
