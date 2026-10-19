import React from 'react';

const CertificateRecipientFields = ({ form = {}, isStudent = true, recipientsList = [], onChange }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Recipient Type *</label>
          <div className="flex rounded-xl border border-line p-0.5 bg-surface-secondary/40">
            {['Student', 'Staff'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange('recipient_type', type)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  form.recipient_type === type ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Issue Date</label>
          <input type="date" value={form.issue_date} onChange={(e) => onChange('issue_date', e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent font-semibold" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          {isStudent ? 'Select Student *' : 'Select Staff Member *'}
        </label>
        <select value={form.recipient_id} onChange={(e) => onChange('recipient_id', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line bg-transparent font-semibold">
          <option value="">-- Choose {isStudent ? 'Student' : 'Staff'} --</option>
          {recipientsList.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name} {isStudent ? `(GR: ${r.gr_number || '—'}, ${r.current_grade?.name || 'Class'})` : `(${r.designation || 'Staff'}, ${r.employee_code || '—'})`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Custom Text / Reason</label>
        <input
          type="text"
          value={form.custom_text}
          onChange={(e) => onChange('custom_text', e.target.value)}
          placeholder="e.g. outstanding academic performance / transfer"
          className="w-full px-3 py-2 rounded-xl border border-line bg-transparent font-medium"
        />
      </div>
    </>
  );
};

export default CertificateRecipientFields;
