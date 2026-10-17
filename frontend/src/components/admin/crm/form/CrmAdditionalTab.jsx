import React from 'react';
import { Home, School, Briefcase, Phone, Percent } from 'lucide-react';

export default function CrmAdditionalTab({ additionalInfo = {}, onChange }) {
  const update = (key, value) => {
    onChange('additional_info', { ...additionalInfo, [key]: value });
  };

  return (
    <div className="bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4 max-w-4xl">
      <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
        <Home className="w-4 h-4 text-primary" /> Additional Background & Contact Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
            <School className="w-3 h-3 inline mr-1" /> Previous School
          </label>
          <input
            type="text"
            value={additionalInfo.previous_school || ''}
            onChange={(e) => update('previous_school', e.target.value)}
            placeholder="e.g. Army Public School"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
            Last Class Attended
          </label>
          <input
            type="text"
            value={additionalInfo.last_class || ''}
            onChange={(e) => update('last_class', e.target.value)}
            placeholder="e.g. Grade 4"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
            <Briefcase className="w-3 h-3 inline mr-1" /> Father Occupation / Business
          </label>
          <input
            type="text"
            value={additionalInfo.father_occupation || ''}
            onChange={(e) => update('father_occupation', e.target.value)}
            placeholder="e.g. Civil Engineer, Banker"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
            Mother Name
          </label>
          <input
            type="text"
            value={additionalInfo.mother_name || ''}
            onChange={(e) => update('mother_name', e.target.value)}
            placeholder="Mother Name"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
            <Phone className="w-3 h-3 inline mr-1" /> Mother Phone / Emergency
          </label>
          <input
            type="text"
            value={additionalInfo.mother_phone || ''}
            onChange={(e) => update('mother_phone', e.target.value)}
            placeholder="03001234567"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
            <Percent className="w-3 h-3 inline mr-1" /> Expected Discount (PKR)
          </label>
          <input
            type="number"
            value={additionalInfo.expected_discount ?? ''}
            onChange={(e) => update('expected_discount', Number(e.target.value))}
            placeholder="0"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-transparent font-medium"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">
          Residential Address
        </label>
        <textarea
          rows={2}
          value={additionalInfo.address || ''}
          onChange={(e) => update('address', e.target.value)}
          placeholder="House #, Street, Colony, City..."
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-transparent"
        />
      </div>
    </div>
  );
}
