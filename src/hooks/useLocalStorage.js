import { useEffect, useState } from 'react';

/** Persists arrays and objects in localStorage, falling back when saved data has the wrong type. */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(initialValue) && Array.isArray(parsed)) return parsed;
        if (initialValue && typeof initialValue === 'object' && !Array.isArray(initialValue) &&
          parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return { ...initialValue, ...parsed };
        }
      }
    } catch { /* corrupted or unavailable storage – fall back */ }
    return initialValue;
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore quota/private mode */ }
  }, [key, value]);

  return [value, setValue];
}
