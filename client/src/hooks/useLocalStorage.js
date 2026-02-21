import { useState, useEffect } from 'react';

/**
 * Persists state to localStorage with a given key.
 * Falls back to initialValue if nothing is stored yet.
 *
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - default value when key is absent
 * @returns {[T, (value: T | ((prev: T) => T)) => void]}
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Silently ignore write errors (e.g., private browsing quota exceeded)
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
