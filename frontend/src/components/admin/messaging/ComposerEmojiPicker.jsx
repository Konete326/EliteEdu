import React from 'react';

const QUICK_EMOJIS = ['😊', '👍', '❤️', '🎉', '🙏', '👏', '🔥', '✅', '💯'];

const ComposerEmojiPicker = ({ isOpen, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-16 left-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 shadow-lg flex gap-1 z-30">
      {QUICK_EMOJIS.map((em) => (
        <button
          key={em}
          type="button"
          onClick={() => onSelect(em)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-base transition-transform active:scale-125"
        >
          {em}
        </button>
      ))}
    </div>
  );
};

export default ComposerEmojiPicker;
