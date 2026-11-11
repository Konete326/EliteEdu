import React, { useState } from 'react';
import { BarChart3, CalendarDays, UserCheck, AlertTriangle } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { useAuth } from '../../context/AuthContext';
import AttendanceReportHeader from '../../components/admin/attendance/reports/AttendanceReportHeader';
import ClassWiseSummaryTab from '../../components/admin/attendance/reports/ClassWiseSummaryTab';
import StudentMonthlyRegisterTab from '../../components/admin/attendance/reports/StudentMonthlyRegisterTab';
import StaffMonthlyRegisterTab from '../../components/admin/attendance/reports/StaffMonthlyRegisterTab';
import LowAttendanceAlertTab from '../../components/admin/attendance/reports/LowAttendanceAlertTab';
import MobileTabStepper from '../../components/common/MobileTabStepper';

const ALL_TABS = [
  { id: 'class_summary', label: 'Class-wise Summary', icon: BarChart3 },
  { id: 'student_register', label: 'Students Monthly Register', icon: CalendarDays },
  { id: 'staff_register', label: 'Staff Monthly Register', icon: UserCheck, adminOnly: true },
  { id: 'low_attendance', label: 'Low Attendance Alert', icon: AlertTriangle }
];

const AttendanceReportPage = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'Teacher';
  const tabs = ALL_TABS.filter((t) => !(isTeacher && t.adminOnly));
  const [activeTab, setActiveTab] = useState('student_register');
  const { activeCampusId, campuses } = useCampus();

  const currentTabId = isTeacher && activeTab === 'staff_register' ? 'student_register' : activeTab;
  const activeCampus = campuses?.find((c) => c._id === activeCampusId);

  return (
    <div className="w-full flex flex-col gap-3 pb-6 md:min-h-full">
      <div className="shrink-0 space-y-3 print:hidden">
        <AttendanceReportHeader activeCampusName={activeCampus?.name} />

        <MobileTabStepper
          tabs={tabs}
          activeTab={currentTabId}
          onChange={setActiveTab}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col w-full">
        {currentTabId === 'class_summary' && <ClassWiseSummaryTab />}
        {currentTabId === 'student_register' && <StudentMonthlyRegisterTab />}
        {!isTeacher && currentTabId === 'staff_register' && <StaffMonthlyRegisterTab />}
        {currentTabId === 'low_attendance' && <LowAttendanceAlertTab />}
      </div>
    </div>
  );
};

export default AttendanceReportPage;
