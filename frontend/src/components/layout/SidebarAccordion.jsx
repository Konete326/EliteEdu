import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarAccordion = ({ category, isOpen, onToggle, isExpanded, onNavigate }) => {
  const Icon = category.icon;
  const location = useLocation();
  const hasActiveChild = category.subItems?.some((sub) => location.pathname === sub.path);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => isExpanded && onToggle(category.title)}
        title={!isExpanded ? category.title : undefined}
        className={`w-full flex items-center ${!isExpanded ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-lg text-sm font-medium transition-colors ${
          hasActiveChild
            ? 'text-primary dark:text-primary-dark font-semibold bg-primary-soft/50 dark:bg-primary/10'
            : 'text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark'
        }`}
      >
        <div className={`flex items-center ${!isExpanded ? 'justify-center' : 'gap-3'} min-w-0`}>
          <Icon className="w-4 h-4 shrink-0" />
          {isExpanded && <span className="truncate">{category.title}</span>}
        </div>
        {isExpanded && (isOpen ? <ChevronDown className="w-4 h-4 shrink-0 text-ink-muted" /> : <ChevronRight className="w-4 h-4 shrink-0 text-ink-muted" />)}
      </button>

      {isExpanded && isOpen && (
        <div className="ml-4 pl-3 border-l border-line/70 dark:border-line-dark/70 space-y-1 py-1">
          {category.subItems.map((sub) => (
            <NavLink
              key={sub.path}
              to={sub.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-soft text-primary dark:bg-primary/20 dark:text-primary-dark font-semibold'
                    : 'text-ink-sub hover:text-ink hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:text-ink-dark dark:hover:bg-surface-secondary-dark'
                }`
              }
            >
              <span className="truncate">{sub.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarAccordion;
