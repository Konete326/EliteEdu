import BasicIdentityFields from './BasicIdentityFields';
import BasicContactFields from './BasicContactFields';

const BasicInformationCard = ({ formData, onChange }) => {
  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-line-dark">
        Basic Information
      </h3>
      <BasicIdentityFields formData={formData} onChange={onChange} />
      <BasicContactFields formData={formData} onChange={onChange} />
    </div>
  );
};

export default BasicInformationCard;
