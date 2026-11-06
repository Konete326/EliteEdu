import { useState, useEffect, useCallback } from 'react';

const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export const usePersistentFormDraft = (key, initialValue = {}) => {
  const [draftData, setDraftData] = useState(() => {
    try {
      const savedAt = localStorage.getItem(`${key}_saved_at`) || sessionStorage.getItem(`${key}_saved_at`);
      if (savedAt) {
        const age = Date.now() - new Date(savedAt).getTime();
        if (age > DRAFT_MAX_AGE_MS) {
          try {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}_saved_at`);
            sessionStorage.removeItem(key);
            sessionStorage.removeItem(`${key}_saved_at`);
          } catch {}
          return initialValue;
        }
      }
      const saved = localStorage.getItem(key) || sessionStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const [lastSavedAt, setLastSavedAt] = useState(() => {
    try {
      return localStorage.getItem(`${key}_saved_at`) || sessionStorage.getItem(`${key}_saved_at`) || null;
    } catch {
      return null;
    }
  });

  const saveDraft = useCallback((data) => {
    try {
      const now = new Date().toISOString();
      try {
        localStorage.setItem(key, JSON.stringify(data));
        localStorage.setItem(`${key}_saved_at`, now);
      } catch {
        sessionStorage.setItem(key, JSON.stringify(data));
        sessionStorage.setItem(`${key}_saved_at`, now);
      }
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
      sessionStorage.removeItem(key);
      sessionStorage.removeItem(`${key}_saved_at`);
      setDraftData(initialValue);
      setLastSavedAt(null);
    } catch {}
  }, [key, initialValue]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (saved) {
        setDraftData(JSON.parse(saved));
        setLastSavedAt(localStorage.getItem(`${key}_saved_at`) || sessionStorage.getItem(`${key}_saved_at`) || null);
      }
    } catch {}
  }, [key]);

  const result = { draftData, setDraftData, updateDraft, clearDraft, lastSavedAt };
  result[Symbol.iterator] = function* () {
    yield draftData;
    yield setDraftData;
    yield clearDraft;
    yield lastSavedAt;
    yield updateDraft;
  };
  return result;
};

export default usePersistentFormDraft;
