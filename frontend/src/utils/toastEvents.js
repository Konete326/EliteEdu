const listeners = new Set();

export const subscribeToast = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const emitToast = (toast) => {
  listeners.forEach((fn) => {
    try {
      fn(toast);
    } catch {}
  });
};

export const emitToastSuccess = (message, title = 'Success') => emitToast({ type: 'success', message, title });
export const emitToastError = (message, title = 'Error') => emitToast({ type: 'error', message, title });
export const emitToastWarning = (message, title = 'Warning') => emitToast({ type: 'warning', message, title });
export const emitToastInfo = (message, title = 'Notice') => emitToast({ type: 'info', message, title });
