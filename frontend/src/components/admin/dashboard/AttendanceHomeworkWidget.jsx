import AttendanceWidget from './AttendanceWidget';
import HomeworkWidget from './HomeworkWidget';

const AttendanceHomeworkWidget = ({ stats }) => {
  return (
    <div className="space-y-6">
      <AttendanceWidget stats={stats} />
      <HomeworkWidget stats={stats} />
    </div>
  );
};

export default AttendanceHomeworkWidget;
