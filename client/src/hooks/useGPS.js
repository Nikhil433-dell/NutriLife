import { useState, useEffect, useCallback } from 'react';

/**
 * Tracks the user's GPS coordinates via the Geolocation API.
 *
 * @returns {{
 *   position: GeolocationCoordinates | null,
 *   error: string | null,
 *   loading: boolean,
 *   refresh: () => void
 * }}
 */
function useGPS() {
  const [position, setPosition] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    getPosition();
  }, [getPosition]);

  return { position, error, loading, refresh: getPosition };
}

export default useGPS;
