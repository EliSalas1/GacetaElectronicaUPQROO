'use client';

import { useState, useEffect, useCallback, useRef } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseFetchOptions<TBody = any> {
  method?: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
}

interface UseFetchResult<TResponse> {
  data: TResponse | null;
  error: string | null;
  loading: boolean;
  fetchData: <TBodyInner = any>(
    endpoint?: string,
    options?: UseFetchOptions<TBodyInner>
  ) => Promise<void>;
}

export function useFetch<TResponse = any, TBody = any>(
  endpoint?: string,
  options?: UseFetchOptions<TBody>
): UseFetchResult<TResponse> {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanup = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const fetchData = useCallback(
    async <TBodyInner = TBody>(
      customEndpoint?: string,
      customOptions: UseFetchOptions<TBodyInner> = {}
    ) => {
      cleanup();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      const url = customEndpoint || endpoint;
      if (!url) {
        setError("No endpoint provided.");
        setLoading(false);
        return;
      }

      const { method = "GET", body, headers = {} } = {
        ...options,
        ...customOptions,
      };

      try {
        const res = await fetch(url, {
          method,
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log("Fetch aborted");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options]
  );

  useEffect(() => {
    if (endpoint) {
      fetchData();
    }

    return () => {
      cleanup();
    };
  }, [endpoint, fetchData]);

  return { data, error, loading, fetchData };
}
