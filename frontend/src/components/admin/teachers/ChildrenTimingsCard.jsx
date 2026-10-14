import WeeklyTimingsWidget from './WeeklyTimingsWidget';
import ChildrenInformationWidget from './ChildrenInformationWidget';

const ChildrenTimingsCard = ({ formData, onTimingsChange, onChildrenChange }) => {
  return (
    <div className="space-y-6">
      <WeeklyTimingsWidget
        weeklyTimings={formData.weekly_timings}
        onTimingsChange={onTimingsChange}
      />
      <ChildrenInformationWidget
        children={formData.children}
        onChildrenChange={onChildrenChange}
      />
    </div>
  );
};

export default ChildrenTimingsCard;
