import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, UserCheck, Calendar, TrendingUp, FileSpreadsheet, Printer } from 'lucide-react';

const TABS = [
  { id: 'class_wise', label: 'Class-wise', icon: Users },
  { id: 'class_subject', label: 'Class & Subject', icon: BookOpen },
  { id: 'student_subject', label: 'Student & Subject', icon: UserCheck },
  { id: 'date_range', label: 'Date Range', icon: Calendar },
  { id: 'performance', label: 'Performance', icon: TrendingUp }
];

export default function ResultsHeaderAndTabs({ activeTab, setActiveTab, onPrint }) {
  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
          <Link to="/admin/class-tests/manage" className="text-primary hover:underline flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" /> Class Tests
          </Link>
          <span>&gt;</span>
          <span className="text-text-primary dark:text-text-primary-dark">Test Results & Reports</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/class-tests/manage" className="px-3 py-1.5 text-xs font-bold rounded-xl border border-line dark:border-line-dark hover:bg-hover text-text-primary dark:text-text-primary-dark transition-colors">
            Manage Test Marks
          </Link>
          <button type="button" onClick={onPrint} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-2xs">
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
        </div>
      </div>

      <div className="p-1.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${isActive ? 'bg-primary text-white shadow-xs' : 'text-text-muted hover:text-text-primary hover:bg-hover dark:hover:bg-hover-dark'}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
