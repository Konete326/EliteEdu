import { createContext, useContext, useState, useCallback } from 'react';
import ComingSoonModal from '../components/common/ComingSoonModal';

const ComingSoonContext = createContext(null);

export const ComingSoonProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: 'Feature Coming Soon',
    description: "We are currently putting the finishing touches on this feature. It will be available in an upcoming release.",
    badge: 'Coming Soon'
  });

  const openComingSoon = useCallback((options = {}) => {
    setModalState({
      isOpen: true,
      title: options.title || 'Feature Coming Soon',
      description: options.description || "We are currently putting the finishing touches on this feature. It will be available in an upcoming release.",
      badge: options.badge || 'Coming Soon'
    });
  }, []);

  const closeComingSoon = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ComingSoonContext.Provider value={{ openComingSoon, closeComingSoon }}>
      {children}
      <ComingSoonModal
        isOpen={modalState.isOpen}
        onClose={closeComingSoon}
        title={modalState.title}
        description={modalState.description}
        badge={modalState.badge}
      />
    </ComingSoonContext.Provider>
  );
};

export const useComingSoon = () => {
  const context = useContext(ComingSoonContext);
  if (!context) {
    throw new Error('useComingSoon must be used within a ComingSoonProvider');
  }
  return context;
};
