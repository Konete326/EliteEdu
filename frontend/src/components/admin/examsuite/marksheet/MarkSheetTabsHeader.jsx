import React from 'react';

const TABS = [
  { id: 'browse', label: 'Browse Sheets' },
  { id: 'attendance', label: 'Exam Attendance' },
  { id: 'results', label: 'Class Results' },
  { id: 'lock', label: 'Lock Results' },
  { id: 'settings', label: 'Exam Settings' }
];

const MarkSheetTabsHeader = ({ activeTab, onSelectTab }) => {
  return (
    <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap ${
            activeTab === tab.id
              ? 'bg-white dark:bg-slate-900 border-t-2 border-primary text-primary shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default MarkSheetTabsHeader;
