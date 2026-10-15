import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Pencil, Trash2, SlidersHorizontal, BarChart2, CheckCircle2 } from 'lucide-react';
import { useComingSoon } from '../../context/ComingSoonContext';

const ModulePermissionRow = ({ sub }) => {
  const navigate = useNavigate();
  const { openComingSoon } = useComingSoon();

  const handleAction = (action) => {
    if (action === 'View') {
      navigate(sub.path);
      return;
    }
    if (action === 'Add') {
      if (sub.path === '/admin/students') { navigate('/admin/students/new'); return; }
      if (sub.path === '/admin/teachers') { navigate('/admin/teachers/new'); return; }
      if (sub.path === '/admin/staff-applicants') { navigate('/admin/staff-applicants/new'); return; }
      if (sub.path === '/admin/campus') { navigate('/admin/campus'); return; }
      if (sub.path === '/admin/grades') { navigate('/admin/grades'); return; }
      if (sub.path === '/admin/subjects') { navigate('/admin/subjects'); return; }
    }
    openComingSoon({
      title: `${action} - ${sub.name}`,
      description: `Administrative ${action.toLowerCase()} capabilities for ${sub.name} are managed under custom role policies.`,
      badge: `${action} Action`
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-surface-secondary/30 dark:bg-black/20 hover:bg-surface-secondary/60 dark:hover:bg-white/[0.04] transition-colors">
      <button
        type="button"
        onClick={() => handleAction('View')}
        className="flex items-center gap-2 text-left group min-w-0"
      >
        <div className="w-6 h-6 rounded-md bg-surface-secondary dark:bg-[#1a1a24] text-primary flex items-center justify-center shrink-0 border border-line/40 dark:border-white/5">
          <CheckCircle2 className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-semibold text-ink dark:text-ink-dark group-hover:text-primary transition-colors truncate">
          {sub.name}
        </span>
      </button>

      <div className="flex flex-wrap items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => handleAction('View')}
          title="Open Module"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25 transition-colors cursor-pointer"
        >
          <Eye className="w-2.5 h-2.5" />
          <span>View</span>
        </button>
        <button
          type="button"
          onClick={() => handleAction('Add')}
          title="Add Record"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors cursor-pointer"
        >
          <Plus className="w-2.5 h-2.5" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={() => handleAction('Edit')}
          title="Edit"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-colors cursor-pointer"
        >
          <Pencil className="w-2.5 h-2.5" />
          <span>Edit</span>
        </button>
        <button
          type="button"
          onClick={() => handleAction('Delete')}
          title="Delete"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/25 transition-colors cursor-pointer"
        >
          <Trash2 className="w-2.5 h-2.5" />
          <span>Delete</span>
        </button>
        <button
          type="button"
          onClick={() => handleAction('Filter')}
          title="Filter"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/25 transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-2.5 h-2.5" />
          <span>Filter</span>
        </button>
        <button
          type="button"
          onClick={() => handleAction('Reports')}
          title="Reports"
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-colors cursor-pointer"
        >
          <BarChart2 className="w-2.5 h-2.5" />
          <span>Reports</span>
        </button>
      </div>
    </div>
  );
};

export default ModulePermissionRow;
