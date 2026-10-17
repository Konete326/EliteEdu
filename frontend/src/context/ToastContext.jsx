import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { subscribeToast } from '../utils/toastEvents';
import ToastContainer from '../components/common/ToastContainer';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev.slice(-4), { id, ...toast }]);
    return id;
  }, []);

  useEffect(() => {
    return subscribeToast((t) => addToast(t));
  }, [addToast]);

  const toast = useMemo(
    () => ({
      success: (message, title = 'Success') => addToast({ type: 'success', message, title }),
      error: (message, title = 'Error') => addToast({ type: 'error', message, title }),
      warning: (message, title = 'Warning') => addToast({ type: 'warning', message, title }),
      info: (message, title = 'Notice') => addToast({ type: 'info', message, title }),
      dismiss
    }),
    [addToast, dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      dismiss: () => {}
    };
  }
  return ctx;
};
