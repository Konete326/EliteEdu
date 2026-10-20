import React from 'react';
import { ArrowDown } from 'lucide-react';

const ScrollToBottomButton = ({ visible, onClick }) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute bottom-4 right-4 z-20 w-9 h-9 rounded-full bg-surface dark:bg-surface-secondary-dark shadow-md border border-line dark:border-line-dark text-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-primary/10"
      title="Jump to latest"
    >
      <ArrowDown className="w-4 h-4" />
    </button>
  );
};

export default ScrollToBottomButton;
