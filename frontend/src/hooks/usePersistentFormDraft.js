import { useState, useEffect, useCallback } from 'react';

export const usePersistentFormDraft = (key, initialValue = {}) => {
  const [draftData, setDraftData] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const [lastSavedAt, setLastSavedAt] = useState(() => {
    try {
      return localStorage.getItem(`${key}_saved_at`) || null;
    } catch {
      return null;
    }
  });

  const saveDraft = useCallback((data) => {
    try {
      const now = new Date().toISOString();
      localStorage.setItem(key, JSON.stringify(data));
      localStorage.setItem(`${key}_saved_at`, now);
      setLastSavedAt(now);
    } catch {}
  }, [key]);

  const updateDraft = useCallback((updater) => {
    setDraftData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveDraft(next);
      return next;
    });
  }, [saveDraft]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_saved_at`);
      setDraftData(initialValue);
      setLastSavedAt(null);
    } catch {}
  }, [key, initialValue]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        setDraftData(JSON.parse(saved));
        setLastSavedAt(localStorage.getItem(`${key}_saved_at`) || null);
      }
    } catch {}
  }, [key]);

  return { draftData, setDraftData, updateDraft, clearDraft, lastSavedAt };
};
