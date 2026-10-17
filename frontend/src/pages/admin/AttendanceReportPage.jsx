import React, { useState } from 'react';
import { BarChart3, CalendarDays, UserCheck, AlertTriangle, Printer } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
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
  const { activeCampusId } = useCampus();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 print:hidden">
        <div>
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Attendance &gt; Attendance Report &amp; Monthly Register</div>
          <h1 className="text-xl sm:text-2xl font-black text-ink">Institutional Attendance Studio &amp; Register</h1>
          <p className="text-xs text-slate-500">Class-wise roll calls, 31-day registers, and automated attendance analytics.</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer self-start sm:self-auto">
          <Printer size={14} /> Print Report
        </button>
      </div>

      <div className="flex rounded-2xl border border-line dark:border-line-dark p-1 bg-surface dark:bg-surface-dark shadow-xs gap-1 overflow-x-auto print:hidden">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="w-full">
        {activeTab === 'class_summary' && <ClassWiseSummaryTab activeCampusId={activeCampusId} />}
        {activeTab === 'student_register' && <StudentMonthlyRegisterTab activeCampusId={activeCampusId} />}
        {activeTab === 'staff_register' && <StaffMonthlyRegisterTab activeCampusId={activeCampusId} />}
        {activeTab === 'low_attendance' && <LowAttendanceAlertTab activeCampusId={activeCampusId} />}
      </div>
    </div>
  );
};

export default AttendanceReportPage;
