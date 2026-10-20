import React from 'react';

const QUICK_EMOJIS = ['😊', '👍', '❤️', '🎉', '🙏', '👏', '🔥', '✅', '💯'];

const ComposerEmojiPicker = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-12 bg-surface dark:bg-surface-secondary-dark border border-line dark:border-line-dark rounded-xl p-2 shadow-lg flex gap-1 z-30">
      {QUICK_EMOJIS.map((em) => (
        <button
          key={em}
          type="button"
          onClick={() => onSelect(em)}
          className="p-1 hover:bg-surface-secondary dark:hover:bg-surface-dark rounded text-base transition-transform active:scale-125"
        >
          {em}
        </button>
      ))}
    </div>
  );
};

export default ComposerEmojiPicker;
