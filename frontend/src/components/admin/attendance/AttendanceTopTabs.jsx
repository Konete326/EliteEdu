import React from 'react';
import { Users, Briefcase, CalendarDays, BarChart3, ScanLine, Settings } from 'lucide-react';
import MobileScrollSlider from '../../common/MobileScrollSlider';

const TABS = [
  { id: 'student', label: 'Student Attendance', icon: Users },
  { id: 'staff', label: 'Staff Attendance', icon: Briefcase },
  { id: 'leave', label: 'Leave Requests', icon: CalendarDays },
  { id: 'report', label: 'Attendance Reports', icon: BarChart3 },
  { id: 'realtime', label: 'Realtime Scanner', icon: ScanLine },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const AttendanceTopTabs = ({ activeTab, onTabChange, onOpenSettings }) => {
  const handleTabClick = (tabId) => {
    if (tabId === 'settings') {
      if (onOpenSettings) onOpenSettings();
      return;
    }
    onTabChange(tabId);
  };

  return (
    <MobileScrollSlider containerClassName="w-full sm:w-fit max-w-full">
      <div className="flex items-center gap-1 p-1 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full sm:w-fit shadow-2xs">
        {TABS.map((tab) => {
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
    </MobileScrollSlider>
  );
};

export default AttendanceTopTabs;
