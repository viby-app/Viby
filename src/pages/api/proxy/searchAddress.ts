import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { q } = req.query;
  if (!q || typeof q !== "string")
    return res.status(400).json({ error: "Missing query" });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&accept-language=he&q=${encodeURIComponent(q)}`,
      {
        headers: {
          "User-Agent": "viby-app (viby1.app@gmail.com)",
        },
      },
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Nominatim" });
  }
}
