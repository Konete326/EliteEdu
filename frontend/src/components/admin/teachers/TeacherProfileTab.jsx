import BasicInformationCard from './BasicInformationCard';
import EmploymentDetailsCard from './EmploymentDetailsCard';
import AddressEmergencyCard from './AddressEmergencyCard';
import ChildrenTimingsCard from './ChildrenTimingsCard';

const TeacherProfileTab = ({ formData, errors = {}, onFieldChange, onEmergencyChange, campuses, schoolType }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-7 space-y-6">
        <BasicInformationCard formData={formData} errors={errors} onChange={onFieldChange} />
        <EmploymentDetailsCard formData={formData} errors={errors} onChange={onFieldChange} campuses={campuses} schoolType={schoolType} />
      </div>
      <div className="xl:col-span-5 space-y-6">
        <AddressEmergencyCard formData={formData} onChange={onFieldChange} onEmergencyChange={onEmergencyChange} />
        <ChildrenTimingsCard
          formData={formData}
          onTimingsChange={(t) => onFieldChange('weekly_timings', t)}
          onChildrenChange={(c) => onFieldChange('children', c)}
        />
      </div>
    </div>
  );
};

export default TeacherProfileTab;
