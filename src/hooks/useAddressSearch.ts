import { useEffect, useState } from "react";

export interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export const useAddressSearch = (query: string, debounceMs = 500) => {
  const [results, setResults] = useState<NominatimResult[]>([]);
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
          const res = await fetch(
            `/api/proxy/searchAddress?q=${encodeURIComponent(query)}`,
          );
          const data = await res.json();
          if (Array.isArray(data)) {
            setResults(data.slice(0, 5));
          }
        } catch (err) {
          console.error("Address search error:", err);
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
