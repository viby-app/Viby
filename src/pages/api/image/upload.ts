import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "~/lib/r2";
import { IncomingForm, type Files, type Fields, type File } from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = await new Promise<{ fields: Fields; files: Files }>(
    (resolve, reject) => {
      const form = new IncomingForm({ keepExtensions: true, multiples: true });

      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        } else {
          resolve({ fields, files });
        }
      });
    },
  ).catch((err) => {
    console.error("Form parse error:", err);
    res.status(500).json({ error: "File upload failed" });
  });

  if (!data) return;

  const { fields, files } = data;

  const rawFiles = Array.isArray(files.file) ? files.file : [files.file];
  const fileList: File[] = rawFiles.filter((f): f is File => f !== undefined);

  const rawKeys = Array.isArray(fields.key) ? fields.key : [fields.key];
  const keyList: string[] = rawKeys.filter((k): k is string => k !== undefined);

  if (fileList.length !== keyList.length) {
    return res
      .status(400)
      .json({ error: "Number of keys must match number of files" });
  }

  try {
    const uploadedKeys: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const key = keyList[i];

      if (!file || !key) continue;

      const stream = fs.createReadStream(file.filepath);
      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: stream,
        ContentType: file.mimetype ?? "application/octet-stream",
      });

      await r2.send(command);
      uploadedKeys.push(key);
    }

    return res
      .status(200)
      .json({ message: "Files uploaded successfully", keys: uploadedKeys });
  } catch (err) {
    console.error("R2 upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
