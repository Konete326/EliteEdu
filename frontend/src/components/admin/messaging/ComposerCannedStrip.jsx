import React from 'react';

const CANNED_RESPONSES = [
  'Assalam-o-Alaikum, please note...',
  'Gentle Fee Reminder',
  'Attendance Follow-up',
  'PTM Invitation'
];

const ComposerCannedStrip = ({ onSelect }) => (
  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-2">
    {CANNED_RESPONSES.map((pill) => (
      <button
        key={pill}
        type="button"
        onClick={() => onSelect(pill)}
        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors"
      >
        {pill}
      </button>
    ))}
  </div>
);

export default ComposerCannedStrip;
