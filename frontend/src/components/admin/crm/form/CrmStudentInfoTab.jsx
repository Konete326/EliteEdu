import React from 'react';
import CrmBasicInfoCard from './CrmBasicInfoCard';
import CrmClassificationCard from './CrmClassificationCard';

export default function CrmStudentInfoTab({
  formData,
  onChange,
  grades = [],
  onOpenQuickAddStatus,
  onOpenQuickAddSource
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <div className="lg:col-span-7">
        <CrmBasicInfoCard formData={formData} onChange={onChange} grades={grades} />
      </div>
      <div className="lg:col-span-5">
        <CrmClassificationCard
          formData={formData}
          onChange={onChange}
          onOpenQuickAddStatus={onOpenQuickAddStatus}
          onOpenQuickAddSource={onOpenQuickAddSource}
        />
      </div>
    </div>
  );
}
