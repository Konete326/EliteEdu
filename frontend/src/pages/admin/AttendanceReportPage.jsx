import React, { useState } from 'react';
import { BarChart3, CalendarDays, UserCheck, AlertTriangle } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { useAuth } from '../../context/AuthContext';
import AttendanceReportHeader from '../../components/admin/attendance/reports/AttendanceReportHeader';
import ClassWiseSummaryTab from '../../components/admin/attendance/reports/ClassWiseSummaryTab';
import StudentMonthlyRegisterTab from '../../components/admin/attendance/reports/StudentMonthlyRegisterTab';
import StaffMonthlyRegisterTab from '../../components/admin/attendance/reports/StaffMonthlyRegisterTab';
import LowAttendanceAlertTab from '../../components/admin/attendance/reports/LowAttendanceAlertTab';
import MobileStepSlider from '../../components/common/MobileStepSlider';

const ALL_TABS = [
  { id: 'class_summary', label: 'Class-wise Summary', icon: BarChart3 },
  { id: 'student_register', label: 'Students Monthly Register (1–31)', icon: CalendarDays },
  { id: 'staff_register', label: 'Staff Monthly Register (1–31)', icon: UserCheck, adminOnly: true },
  { id: 'low_attendance', label: 'Low Attendance / On-Leave Alert', icon: AlertTriangle }
];

const AttendanceReportPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher';
  const tabs = ALL_TABS.filter((t) => !(isTeacher && t.adminOnly));
  const [activeTab, setActiveTab] = useState('student_register');
  const { activeCampusId, campuses } = useCampus();

  const currentTabId = isTeacher && activeTab === 'staff_register' ? 'student_register' : activeTab;
  const activeCampus = campuses?.find((c) => c._id === activeCampusId);
  const activeTabIdx = Math.max(0, tabs.findIndex((t) => t.id === currentTabId));

  return (
    <div className="w-full min-h-full flex flex-col gap-3">
      <div className="shrink-0 space-y-3 print:hidden">
        <AttendanceReportHeader activeCampusName={activeCampus?.name} />

        <MobileStepSlider
          controlledIndex={activeTabIdx}
          onIndexChange={(idx) => setActiveTab(tabs[idx].id)}
          desktopClassName="sm:flex sm:items-center sm:gap-1.5 sm:p-1.5 sm:rounded-2xl sm:border sm:border-line sm:dark:border-line-dark sm:bg-surface sm:dark:bg-surface-dark sm:shadow-xs sm:w-fit sm:min-w-0"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTabId === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 w-full sm:w-auto ${
                  isActive ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </MobileStepSlider>
      </div>

      <div className="flex-1 min-h-0 flex flex-col w-full">
        {currentTabId === 'class_summary' && <ClassWiseSummaryTab activeCampusId={activeCampusId} />}
        {currentTabId === 'student_register' && <StudentMonthlyRegisterTab activeCampusId={activeCampusId} />}
        {!isTeacher && currentTabId === 'staff_register' && <StaffMonthlyRegisterTab activeCampusId={activeCampusId} />}
        {currentTabId === 'low_attendance' && <LowAttendanceAlertTab activeCampusId={activeCampusId} />}
      </div>
    </div>
  );
};

export default AttendanceReportPage;
