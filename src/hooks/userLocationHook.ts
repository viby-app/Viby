"use client";
import { useEffect, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface UseCurrentLocationResult {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export function useCurrentLocation(): UseCurrentLocationResult {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { location, loading, error };
}
