'use client';

import { useState, useEffect } from 'react';
import { Response } from '../types/common';

interface FetchState<T> {
  loading: boolean;
  data: Response<T> | null;
  error: unknown | null;
}

const useFetch = <T,>(url?: string, options?: Request): FetchState<T> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Response<T> | null>(null);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
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
    };

    fetchData();
  }, [url, options]);

  return { loading, data, error };
};

export default useFetch;
