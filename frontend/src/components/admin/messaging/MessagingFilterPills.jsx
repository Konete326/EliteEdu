import React from 'react';

const MessagingFilterPills = ({ activeFilter, onFilterChange, unreadTotal = 0 }) => {
  const pills = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: unreadTotal },
    { id: 'favorites', label: 'Favorites' },
    { id: 'groups', label: 'Groups' }
  ];

  return (
    <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-line dark:border-line-dark">
      {pills.map((p) => {
        const isActive = activeFilter === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onFilterChange(p.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              isActive
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-secondary hover:bg-surface-secondary/80 dark:bg-surface-secondary-dark text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark'
            }`}
          >
            <span>{p.label}</span>
            {Boolean(p.count && p.count > 0) && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {p.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MessagingFilterPills;
