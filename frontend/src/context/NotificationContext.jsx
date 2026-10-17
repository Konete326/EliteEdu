import React, { createContext, useContext } from 'react';
import { useToast } from './ToastContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const toast = useToast();

  const showNotification = (message, type = 'info', title) => {
    if (type === 'success') toast.success(message, title || 'Success');
    else if (type === 'error') toast.error(message, title || 'Error');
    else if (type === 'warning') toast.warning(message, title || 'Warning');
    else toast.info(message, title || 'Notice');
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
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
