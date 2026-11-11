import { memo } from 'react';
import CalendarWidget from './CalendarWidget';
import StudentStatisticsWidget from './StudentStatisticsWidget';
import TeachersDutyStatusWidget from './TeachersDutyStatusWidget';
import TimetableActiveScheduleWidget from './TimetableActiveScheduleWidget';

const DashboardRightColumn = ({ birthdaysToday, upcomingClasses, studentStats, stats }) => {
  const staffAttendance = stats?.attendanceSummary?.staff || {};
  const totalTeachers = stats?.topKpis?.teachers || 0;

  return (
    <div className="space-y-6">
      <CalendarWidget />
      <TeachersDutyStatusWidget staffAttendance={staffAttendance} totalTeachers={totalTeachers} />
      <TimetableActiveScheduleWidget upcomingClasses={upcomingClasses || []} />
      <StudentStatisticsWidget studentStats={studentStats} />
    </div>
  );
};

export default memo(DashboardRightColumn);
