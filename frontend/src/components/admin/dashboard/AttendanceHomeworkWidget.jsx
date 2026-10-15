import AttendanceWidget from './AttendanceWidget';
import HomeworkWidget from './HomeworkWidget';

const AttendanceHomeworkWidget = ({ stats, attendanceSummary, homeworkSummary }) => {
  return (
    <div className="space-y-6">
      <AttendanceWidget stats={stats} attendanceSummary={attendanceSummary} />
      <HomeworkWidget stats={stats} homeworkSummary={homeworkSummary} />
    </div>
  );
};

export default AttendanceHomeworkWidget;
