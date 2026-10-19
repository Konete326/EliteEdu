import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { REPORT_CATEGORIES } from './masterReportCategoriesConfig';

const HIGHLIGHTED = [
  { path: '/admin/reports/student-info', label: 'Student Info Report', badge: 'Direct', badgeColor: 'bg-primary/10 text-primary' },
  { path: '/admin/reports/staff-info', label: 'Staff & Teachers Report', badge: 'HR', badgeColor: 'bg-emerald-500/10 text-emerald-600' },
  { path: '/admin/attendance/report', label: 'Attendance Register', badge: 'Studio', badgeColor: 'bg-indigo-500/10 text-indigo-600' },
  { path: '/admin/reports/parent-info', label: 'Parent Contact Report', badge: 'Direct', badgeColor: 'bg-sky-500/10 text-sky-600' },
  { path: '/admin/reports/report-cards', label: 'Student Report Card', badge: 'Cards', badgeColor: 'bg-amber-500/10 text-amber-600' }
];

const MasterReportCategoryNav = ({ activeSubReport = 'master_list', onSelectSubReport, activeCategory = 'student', onSelectCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openMap, setOpenMap] = useState({ student: true });

  const toggleCat = (catId) => {
    setOpenMap((prev) => ({ ...prev, [catId]: !prev[catId] }));
    onSelectCategory(catId);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-2xs space-y-4 print:hidden">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-primary tracking-wider">
          <BookOpen size={14} /><span>Reports Catalog</span>
        </div>
        <div className="relative mt-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report items..."
            className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface text-ink placeholder:text-ink-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
        <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
          <Sparkles size={11} /> Standalone Highlighted
        </span>
        <div className="flex flex-col gap-1">
          {HIGHLIGHTED.map((h) => (
            <Link key={h.path} to={h.path} className="text-xs font-bold text-ink hover:text-primary transition-colors flex items-center justify-between">
              <span>{h.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${h.badgeColor}`}>{h.badge}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        {REPORT_CATEGORIES.map((cat) => {
          const isOpen = openMap[cat.id] ?? (activeCategory === cat.id);
          const filteredSubs = cat.subReports.filter((s) => s.label.toLowerCase().includes(searchTerm.toLowerCase()));
          if (searchTerm && filteredSubs.length === 0) return null;

          return (
            <div key={cat.id} className="rounded-xl border border-line/60 bg-surface/50 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleCat(cat.id)}
                className={`w-full flex items-center justify-between p-2.5 font-black text-left transition-colors cursor-pointer ${activeCategory === cat.id ? 'bg-primary/10 text-primary font-black' : 'text-ink hover:bg-surface-secondary'}`}
              >
                <span>{cat.label}</span>
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>

              {isOpen && (
                <div className="px-2 py-1.5 space-y-0.5 border-t border-line/40 bg-surface-secondary/20">
                  {filteredSubs.map((sub) => {
                    const isSelected = activeCategory === cat.id && activeSubReport === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onSelectSubReport(sub.id);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${isSelected ? 'bg-primary text-white font-bold shadow-xs' : 'text-ink-sub hover:bg-surface-secondary hover:text-ink font-medium'}`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MasterReportCategoryNav;
