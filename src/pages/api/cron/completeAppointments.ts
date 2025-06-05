import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const now = new Date();

  const updated = await db.appointment.updateMany({
    where: {
      status: "BOOKED",
      date: { lt: now },
    },
    data: {
      status: "COMPLETED",
    },
  });

  return res.status(200).json({ updated: updated.count });
}
