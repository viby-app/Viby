import type { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "~/lib/r2";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key } = req.query;

  if (typeof key !== "string") {
    return res.status(400).json({ error: "Missing or invalid key" });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(r2, command, { expiresIn: 60 * 5 }); // 5 minutes

    return res.status(200).json({ url });
  } catch (error) {
    console.error("Failed to generate signed URL:", error);
    return res.status(500).json({ error: "Failed to generate signed URL" });
  }
}