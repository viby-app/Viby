import type { ImageUrlResponse } from "../types";

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

export async function uploadImage(file: File, key: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("key", key);

  const res = await fetch("/api/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload logo");
  }
}

export async function uploadGallery(
  images: FileList,
  keys: string[],
) {
  const formData = new FormData();

  Array.from(images).forEach((file, index) => {
    const key = keys[index];
    if (!key) return;
    formData.append("file", file);
    formData.append("key", key);
  });

  const res = await fetch("/api/image/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Gallery upload failed");
  }
}