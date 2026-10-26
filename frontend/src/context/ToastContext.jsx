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

  const showToast = useCallback((message, type = 'info', title) => {
    return addToast({
      type,
      message,
      title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Notice')
    });
  }, [addToast]);

  const success = useCallback((message, title = 'Success') => addToast({ type: 'success', message, title }), [addToast]);
  const error = useCallback((message, title = 'Error') => addToast({ type: 'error', message, title }), [addToast]);
  const warning = useCallback((message, title = 'Warning') => addToast({ type: 'warning', message, title }), [addToast]);
  const info = useCallback((message, title = 'Notice') => addToast({ type: 'info', message, title }), [addToast]);

  const toast = useMemo(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      dismiss
    }),
    [showToast, success, error, warning, info, dismiss]
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
      showToast: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
      dismiss: () => {}
    };
  }
  return ctx;
};
