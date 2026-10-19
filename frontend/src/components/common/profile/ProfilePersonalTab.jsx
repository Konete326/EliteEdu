import ProfilePersonalFieldsA from './ProfilePersonalFieldsA';
import ProfilePersonalFieldsB from './ProfilePersonalFieldsB';

const ProfilePersonalTab = ({ formData, onChange }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-5">
      <div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Personal & Identity Information</h3>
        <p className="text-[11px] text-ink-muted">Official identification and demographic particulars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProfilePersonalFieldsA formData={formData} onChange={onChange} />
        <ProfilePersonalFieldsB formData={formData} onChange={onChange} />
      </div>
    </div>
  );
};

export default ProfilePersonalTab;
