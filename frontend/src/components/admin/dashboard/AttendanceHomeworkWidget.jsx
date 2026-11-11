import { memo } from 'react';
import AttendanceWidget from './AttendanceWidget';
import TodayAbsentStudentsWidget from './TodayAbsentStudentsWidget';

const AttendanceHomeworkWidget = ({ stats, attendanceSummary }) => {
  const absentStudents = stats?.absentStudentsToday || [];

  return (
    <div className="space-y-6">
      <AttendanceWidget stats={stats} attendanceSummary={attendanceSummary} />
      <TodayAbsentStudentsWidget absentStudents={absentStudents} />
    </div>
  );
};

export default memo(AttendanceHomeworkWidget);
