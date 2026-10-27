import { memo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const SidebarAccordion = ({ category, isOpen, onToggle, isExpanded, onNavigate, isColored }) => {
  const Icon = category.icon;
  const location = useLocation();
  const isSingle = category.subItems?.length === 1;
  const singleItem = isSingle ? category.subItems[0] : null;

  if (isSingle && singleItem) {
    const isSingleActive = location.pathname === singleItem.path || (singleItem.path === '/admin/attendance/students' && location.pathname.startsWith('/admin/attendance'));
    const singleStyle = isColored
      ? isSingleActive
        ? 'bg-white text-slate-900 font-bold shadow-xs'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
      : isSingleActive
        ? 'bg-primary-soft text-primary dark:bg-primary/20 dark:text-primary-dark font-semibold'
        : 'text-ink-sub hover:text-ink hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:text-ink-dark dark:hover:bg-surface-secondary-dark';

    return (
      <NavLink
        to={singleItem.path}
        onClick={onNavigate}
        title={singleItem.name || category.title}
        className={`w-full flex items-center ${!isExpanded ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${singleStyle}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Icon className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="truncate text-left">{singleItem.name || category.title}</span>}
        </div>
        {isExpanded && singleItem.badge && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
            isColored
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark border border-primary/20'
          }`}>
            {singleItem.badge}
          </span>
        )}
      </NavLink>
    );
  }

  const hasActiveChild = category.subItems?.some((sub) => location.pathname === sub.path);

  const buttonStyle = isColored
    ? hasActiveChild
      ? 'bg-white/20 text-white font-bold shadow-xs'
      : 'text-white/80 hover:bg-white/10 hover:text-white'
    : hasActiveChild
      ? 'text-primary dark:text-primary-dark font-semibold bg-primary-soft/50 dark:bg-primary/10'
      : 'text-ink-sub hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:bg-surface-secondary-dark';

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onToggle(category.title)}
        title={category.title}
        className={`w-full flex items-center ${!isExpanded ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer active:scale-[0.98] ${buttonStyle}`}
      >
        <div className={`flex items-center ${!isExpanded ? 'justify-center' : 'gap-3'} min-w-0 flex-1`}>
          <Icon className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="truncate text-left">{category.title}</span>}
        </div>
        {isExpanded && (
          isOpen ? <ChevronDown className="w-4 h-4 shrink-0 opacity-70 ml-1.5" /> : <ChevronRight className="w-4 h-4 shrink-0 opacity-70 ml-1.5" />
        )}
      </button>

      {isExpanded && isOpen && (
        <div className={`ml-4 pl-3 border-l space-y-1 py-1 ${isColored ? 'border-white/20' : 'border-line/70 dark:border-line-dark/70'}`}>
          {category.subItems.map((sub) => (
            <NavLink
              key={sub.path}
              to={sub.path}
              onClick={onNavigate}
              title={sub.name}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isColored
                    ? isActive
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                    : isActive
                      ? 'bg-primary-soft text-primary dark:bg-primary/20 dark:text-primary-dark font-semibold'
                      : 'text-ink-sub hover:text-ink hover:bg-surface-secondary dark:text-ink-sub-dark dark:hover:text-ink-dark dark:hover:bg-surface-secondary-dark'
                }`
              }
            >
              <span className="truncate flex-1 min-w-0 text-left">{sub.name}</span>
              {sub.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                  isColored
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark border border-primary/20'
                }`}>
                  {sub.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(SidebarAccordion);
