import React, { useState } from 'react';
import { BarChart3, CalendarDays, UserCheck, AlertTriangle } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import AttendanceReportHeader from '../../components/admin/attendance/reports/AttendanceReportHeader';
import ClassWiseSummaryTab from '../../components/admin/attendance/reports/ClassWiseSummaryTab';
import StudentMonthlyRegisterTab from '../../components/admin/attendance/reports/StudentMonthlyRegisterTab';
import StaffMonthlyRegisterTab from '../../components/admin/attendance/reports/StaffMonthlyRegisterTab';
import LowAttendanceAlertTab from '../../components/admin/attendance/reports/LowAttendanceAlertTab';

const TABS = [
  { id: 'class_summary', label: 'Class-wise Summary', icon: BarChart3 },
  { id: 'student_register', label: 'Students Monthly Register (1–31)', icon: CalendarDays },
  { id: 'staff_register', label: 'Staff Monthly Register (1–31)', icon: UserCheck },
  { id: 'low_attendance', label: 'Low Attendance / On-Leave Alert', icon: AlertTriangle }
];

const AttendanceReportPage = () => {
  const [activeTab, setActiveTab] = useState('class_summary');
  const { activeCampusId, campuses } = useCampus();

  const activeCampus = campuses?.find((c) => c._id === activeCampusId);

  return (
    <div className="w-full h-full flex flex-col min-h-0 gap-3">
      <div className="shrink-0 space-y-3">
        <AttendanceReportHeader activeCampusName={activeCampus?.name} />

        <div className="flex rounded-2xl border border-line dark:border-line-dark p-1.5 bg-surface dark:bg-surface-dark shadow-xs gap-1.5 overflow-x-auto print:hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === 'class_summary' && <ClassWiseSummaryTab activeCampusId={activeCampusId} />}
        {activeTab === 'student_register' && <StudentMonthlyRegisterTab activeCampusId={activeCampusId} />}
        {activeTab === 'staff_register' && <StaffMonthlyRegisterTab activeCampusId={activeCampusId} />}
        {activeTab === 'low_attendance' && <LowAttendanceAlertTab activeCampusId={activeCampusId} />}
      </div>
    </div>
  );
};

export default AttendanceReportPage;
