import { ChevronDown, ChevronUp } from 'lucide-react';
import ModulePermissionRow from './ModulePermissionRow';

const CategoryAccordionCard = ({ category, isOpen, onToggle }) => {
  const count = category.subItems?.length || 0;
  const CategoryIcon = category.icon;

  return (
    <div className="border border-line dark:border-line-dark rounded-xl overflow-hidden transition-colors bg-surface-secondary/20 dark:bg-[#121217]">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-surface-secondary/50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          {CategoryIcon && <CategoryIcon className="w-4 h-4 text-primary dark:text-primary-dark shrink-0" />}
          <span className="text-xs font-bold text-ink dark:text-ink-dark uppercase tracking-wider truncate">
            {category.title}
          </span>
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary dark:bg-[#1c1c24] text-ink-muted dark:text-ink-muted-dark border border-line/60 dark:border-white/5 shrink-0">
            {count}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark shrink-0" />
        )}
      </button>

      {isOpen && category.subItems && (
        <div className="p-2.5 bg-surface dark:bg-[#0c0c0f] border-t border-line dark:border-line-dark">
          <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5">
            {category.subItems.map((sub) => (
              <ModulePermissionRow key={sub.path} sub={sub} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAccordionCard;
