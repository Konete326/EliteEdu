import AvatarUploadField from '../../../common/AvatarUploadField';
import ApplicantBasicInfoCard from './ApplicantBasicInfoCard';

const ApplicantPersonalInfoTab = ({ formData, onChange, teachers = [], errors = {} }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Profile</h3>
        <div className="flex items-center gap-6">
          <AvatarUploadField
            value={formData.photo_url}
            onChange={(url) => onChange('photo_url', url)}
            label="Profile Picture (Optional)"
          />
        </div>
      </div>

      <ApplicantBasicInfoCard
        formData={formData}
        onChange={onChange}
        teachers={teachers}
        errors={errors}
      />
    </div>
  );
};

export default ApplicantPersonalInfoTab;
