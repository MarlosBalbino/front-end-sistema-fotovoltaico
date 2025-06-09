// /hooks/useAllData.ts
'use client';

import { useEffect, useState } from 'react';
import { DataPoint } from '@/app/types/DataPoint';

interface AllData {
  irradiancia: DataPoint[];
  temperatura: DataPoint[];
  notFound: boolean;
}

export function useAllData() {
  const [data, setData] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('/api/data/all-data')
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
