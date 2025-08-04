import type { NextApiRequest, NextApiResponse } from "next";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "~/lib/r2";
import logger from "~/lib/logger";
import { getServerAuthSession } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body: string = req.body;

  const { key }: { key: string } = JSON.parse(body);

  logger.info("Delete request received for key:", req.body);

  if (key === "" || !key || typeof key !== "string") {
    return res
      .status(400)
      .json({ error: "Missing or invalid 'key' parameter" });
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });

    await r2.send(command);

    return res.status(200).json({ message: "File deleted successfully", key });
  } catch (error) {
    console.error("R2 image delete error:", error);
    return res.status(500).json({ error: "Delete failed" });
  }
}
