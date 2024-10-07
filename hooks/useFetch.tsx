import { useState, useEffect, useCallback } from 'react';
import { Response } from '../types/common';

interface FetchState<T> {
  loading: boolean;
  data: Response<T> | null;
  error: unknown | null;
}

const useFetch = <T,>(url?: string, options?: RequestInit): FetchState<T> & { retrigger: () => void } => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Response<T> | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [trigger, setTrigger] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: Response<T> = await response.json();
      setData(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, trigger, url]);

  const retrigger = () => {
    setTrigger((prev) => prev + 1);
  };

  return { loading, data, error, retrigger };
};

export default useFetch;
