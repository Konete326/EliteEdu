import { useState, useMemo } from 'react';
import { Lock } from 'lucide-react';
import { getNavCategories } from '../../config/adminNavConfig';
import CategoryAccordionCard from './CategoryAccordionCard';

const PermissionsMatrixCard = ({ user }) => {
  const categories = getNavCategories(user);
  const totalModules = categories.reduce((acc, cat) => acc + (cat.subItems?.length || 0), 0);
  const [openCategories, setOpenCategories] = useState({ CRM: true, Main: true });

  const toggleCategory = (title) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const { leftCol, rightCol } = useMemo(() => {
    const left = [];
    const right = [];
    categories.forEach((cat, idx) => {
      if (idx % 2 === 0) left.push(cat);
      else right.push(cat);
    });
    return { leftCol: left, rightCol: right };
  }, [categories]);

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ink dark:text-ink-dark">Your Permissions</h2>
            <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">Role-based administrative capability matrix</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-secondary dark:bg-[#16161d] text-ink-sub dark:text-ink-sub-dark border border-line dark:border-line-dark shrink-0">
          {totalModules} modules
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
        <div className="space-y-3">
          {leftCol.map((category) => (
            <CategoryAccordionCard
              key={category.title}
              category={category}
              isOpen={!!openCategories[category.title]}
              onToggle={() => toggleCategory(category.title)}
            />
          ))}
        </div>
        <div className="space-y-3">
          {rightCol.map((category) => (
            <CategoryAccordionCard
              key={category.title}
              category={category}
              isOpen={!!openCategories[category.title]}
              onToggle={() => toggleCategory(category.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsMatrixCard;
