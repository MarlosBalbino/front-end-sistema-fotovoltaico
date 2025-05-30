// /hooks/useDailyData.ts
'use client';

import { useEffect, useState } from 'react';
import { DataPoint } from '@/app/types/DataPoint';

interface DailyData {
  irradiancia: DataPoint[];
  temperatura: DataPoint[];
  notFound: boolean;
}

export function useDailyData(date: string | null) {
  const [data, setData] = useState<DailyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) return;

    setLoading(true);
    setError(null);

    fetch(`/api/data/${date}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [date]);

  return { data, loading, error };
}
