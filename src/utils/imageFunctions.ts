import type { ImageUrlResponse } from "./types";

export const getPreSignedUrlFromKey = async (key: string): Promise<string> => {
  const res = await fetch(`/api/image/${key}`);
  const data: ImageUrlResponse = await res.json();

  return data.url;
};

export const deleteImage = async (key: string) => {
  if (!key || typeof key !== "string") {
    throw new Error("Invalid key provided for image deletion");
  }

  if (key === "") return;
  
  await fetch(`/api/image/delete`, {
    method: "DELETE",
    body: JSON.stringify({ key: key }),
  });
};
