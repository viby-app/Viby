import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "~/lib/r2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { key } = req.query;

  if (typeof key !== "string") {
    return res.status(400).json({ error: "Missing or invalid key" });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    const data = await r2.send(command);

    const stream = data.Body as NodeJS.ReadableStream;

    res.setHeader("Content-Type", data.ContentType ?? "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    stream.pipe(res);
  } catch (error) {
    console.error("R2 image fetch error:", error);
    res.status(404).json({ error: "Image not found" });
  }
}
