import { useState, useEffect, useRef } from "react";
import { API_BASE } from "../utils/constants";

export function useApi(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track the url we last successfully loaded so we don't wipe data on re-fetch
  const lastUrl = useRef(null);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(null);
      lastUrl.current = null;
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    // Only show loading spinner (and wipe data) when switching to a NEW url
    if (url !== lastUrl.current) {
      setLoading(true);
      setError(null);
      setData(null);
    }

    fetch(API_BASE + url, { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          lastUrl.current = url;
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled && e.name !== "AbortError") {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps.length ? deps : [url]);

  return { data, loading, error };
}
