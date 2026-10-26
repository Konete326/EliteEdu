import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const toast = useToast();

  const showNotification = useCallback((message, type = 'info', title) => {
    if (type === 'success') toast.success(message, title || 'Success');
    else if (type === 'error') toast.error(message, title || 'Error');
    else if (type === 'warning') toast.warning(message, title || 'Warning');
    else toast.info(message, title || 'Notice');
  }, [toast]);

  const value = useMemo(() => ({ showNotification }), [showNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const toast = useToast();
  return {
    showNotification: (message, type = 'info', title) => {
      if (type === 'success') toast.success(message, title || 'Success');
      else if (type === 'error') toast.error(message, title || 'Error');
      else if (type === 'warning') toast.warning(message, title || 'Warning');
      else toast.info(message, title || 'Notice');
    }
  };
};

export default NotificationContext;
