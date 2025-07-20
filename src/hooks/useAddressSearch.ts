import { useEffect, useState } from "react";
import { env } from "~/env";
import type { GeoapifyResult } from "~/utils/types";

interface GeoapifySearchResponse {
  results: GeoapifyResult[];
}

export const useGeoapifySearch = (query: string, debounceMs = 400) => {
  const [results, setResults] = useState<GeoapifyResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      const fetchAddresses = async () => {
        setLoading(true);
        try {
          const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            query,
          )} ישראל&lang=he&format=json&apiKey=${env.NEXT_PUBLIC_MAPS_API_KEY}`;

          const res = await fetch(url);
          const data: GeoapifySearchResponse = await res.json();
          setResults(data.results);
        } catch (error) {
          console.error("Geoapify error:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      void fetchAddresses();
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [query, debounceMs]);

  return { results, loading };
};
