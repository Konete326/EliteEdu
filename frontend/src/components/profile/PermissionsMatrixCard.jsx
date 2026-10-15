import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ChevronDown, ChevronUp, Eye, Plus, Pencil, Trash2,
  SlidersHorizontal, BarChart2, CheckCircle2
} from 'lucide-react';
import { getNavCategories } from '../../config/adminNavConfig';

const PermissionsMatrixCard = ({ user }) => {
  const navigate = useNavigate();
  const categories = getNavCategories(user);
  const totalModules = categories.reduce((acc, cat) => acc + (cat.subItems?.length || 0), 0);
  const [openCategories, setOpenCategories] = useState({ CRM: true, Main: false });

  const toggleCategory = (title) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink dark:text-ink-dark">Your Permissions</h2>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Role-based administrative capability matrix</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-secondary dark:bg-[#16161d] text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark">
          {totalModules} modules
        </span>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isOpen = !!openCategories[category.title];
          const count = category.subItems?.length || 0;
          const CategoryIcon = category.icon;

          return (
            <div
              key={category.title}
              className="border border-line dark:border-line-dark rounded-xl overflow-hidden transition-colors bg-surface-secondary/20 dark:bg-[#121217]"
            >
              <button
                type="button"
                onClick={() => toggleCategory(category.title)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-surface-secondary/50 dark:hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {CategoryIcon && <CategoryIcon className="w-4 h-4 text-primary dark:text-primary-dark" />}
                  <span className="text-xs font-bold text-ink dark:text-ink-dark uppercase tracking-wider">
                    {category.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-surface-secondary dark:bg-[#1c1c24] text-ink-muted dark:text-ink-muted-dark border border-line/60 dark:border-white/5">
                    {count}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-ink-muted dark:text-ink-muted-dark" />
                )}
              </button>

              {isOpen && category.subItems && (
                <div className="p-3 bg-surface dark:bg-[#0c0c0f] border-t border-line dark:border-line-dark divide-y divide-line/60 dark:divide-white/5 space-y-2">
                  {category.subItems.map((sub) => (
                    <div
                      key={sub.path}
                      className="pt-2 first:pt-0 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 p-2 rounded-lg hover:bg-surface-secondary/30 dark:hover:bg-[#141418] transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => navigate(sub.path)}
                        className="flex items-center gap-2 text-left group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-surface-secondary dark:bg-[#1a1a24] text-ink-sub dark:text-ink-sub-dark flex items-center justify-center shrink-0 border border-line/50 dark:border-white/5 group-hover:border-primary/50 transition-colors">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-ink dark:text-ink-dark group-hover:text-primary transition-colors">
                          {sub.name}
                        </span>
                      </button>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(sub.path)}
                          title="Open Module"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          <Pencil className="w-3 h-3" />
                          <span>Edit</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>Filter</span>
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          <BarChart2 className="w-3 h-3" />
                          <span>Reports</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PermissionsMatrixCard;
