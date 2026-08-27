import { useEffect, useState } from 'react';
import { deviceHeaders } from '@/lib/device';

export function useJapaCounter(mantraId: string | number) {
  const date = new Date().toISOString().slice(0, 10);
  const key = `japa:${mantraId}:${date}`;
  const [count, setCount] = useState(() => Number(localStorage.getItem(key) || 0));

  useEffect(() => {
    const next = Number(localStorage.getItem(key) || 0);
    setCount(next);
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, String(count));
    const timer = window.setTimeout(() => {
      void fetch('/api/japa', { method: 'POST', headers: deviceHeaders(), body: JSON.stringify({ mantraId: String(mantraId), count, date }) });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [count, date, key, mantraId]);

  return { count, increment: () => setCount((value) => value + 1), reset: () => setCount(0) };
}
