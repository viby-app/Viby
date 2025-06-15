import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "~/lib/r2";
import { IncomingForm, type Files, type Fields } from "formidable";
import fs from "fs";
import { error } from "console";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = await new Promise<{ fields: Fields; files: Files }>((resolve) => {
    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        error(err);
      } else {
        resolve({ fields, files });
      }
    });
  }).catch((err) => {
    console.error("Form parse error:", err);
    res.status(500).json({ error: "File upload failed" });
  });

  if (!data) return;

  const { fields, files } = data;

  const file = files.file?.[0] ?? files.file;
  const key = Array.isArray(fields.key) ? fields.key[0] : fields.key;

  if (!file || Array.isArray(file) || typeof key !== "string") {
    return res.status(400).json({ error: "Invalid file or key" });
  }

  try {
    const stream = fs.createReadStream(file.filepath);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: stream,
      ContentType: file.mimetype ?? "application/octet-stream",
    });

    await r2.send(command);

    return res.status(200).json({ message: "File uploaded successfully", key });
  } catch (error) {
    console.error("R2 image upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
