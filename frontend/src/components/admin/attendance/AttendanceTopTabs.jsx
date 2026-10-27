import React from 'react';
import { Users, Briefcase, CalendarDays, BarChart3, ScanLine, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const ALL_TABS = [
  { id: 'student', label: 'Student Attendance', icon: Users, roles: ['Admin', 'SuperAdmin', 'Teacher'] },
  { id: 'staff', label: 'Staff Attendance', icon: Briefcase, roles: ['Admin', 'SuperAdmin'] },
  { id: 'leave', label: 'Leave Requests', icon: CalendarDays, roles: ['Admin', 'SuperAdmin', 'Teacher'] },
  { id: 'report', label: 'Attendance Reports', icon: BarChart3, roles: ['Admin', 'SuperAdmin', 'Teacher'] },
  { id: 'realtime', label: 'Realtime Scanner', icon: ScanLine, roles: ['Admin', 'SuperAdmin'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'SuperAdmin'] }
];

const AttendanceTopTabs = ({ activeTab, onTabChange, onOpenSettings }) => {
  const { user } = useAuth();
  const userRole = user?.role || 'Admin';
  const tabs = ALL_TABS.filter((t) => !t.roles || t.roles.includes(userRole));
  const activeIdx = Math.max(0, tabs.findIndex((t) => t.id === activeTab));

  const handleTabClick = (tabId) => {
    if (tabId === 'settings') {
      if (onOpenSettings && userRole !== 'Teacher') onOpenSettings();
      return;
    }
    onTabChange(tabId);
  };

  const handleMobilePrev = () => {
    const prevIdx = activeIdx > 0 ? activeIdx - 1 : tabs.length - 1;
    handleTabClick(tabs[prevIdx].id);
  };

  const handleMobileNext = () => {
    const nextIdx = activeIdx < tabs.length - 1 ? activeIdx + 1 : 0;
    handleTabClick(tabs[nextIdx].id);
  };

  const currentTab = tabs[activeIdx] || tabs[0];
  const ActiveIcon = currentTab.icon;

  return (
    <div className="w-full sm:w-fit">
      <div className="sm:hidden w-full flex flex-col gap-1.5 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xs">
        <div className="w-full flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleMobilePrev}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Previous Attendance Module"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleTabClick(currentTab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shadow-xs transition-all truncate cursor-pointer"
          >
            <ActiveIcon className="w-4 h-4 shrink-0 text-white" />
            <span className="truncate">{currentTab.label}</span>
          </button>

          <button
            type="button"
            onClick={handleMobileNext}
            className="w-8 h-8 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark flex items-center justify-center text-ink dark:text-ink-dark cursor-pointer active:scale-95 transition-all shrink-0"
            aria-label="Next Attendance Module"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 pb-0.5">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIdx ? 'w-5 bg-primary' : 'w-1.5 bg-line dark:bg-line-dark'
              }`}
              aria-label={tab.label}
            />
          ))}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-fit shadow-2xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-ink-muted'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceTopTabs;
