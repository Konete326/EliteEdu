import React from 'react';
import { Users, CheckSquare, Plus, Trash2 } from 'lucide-react';

const CHECKLIST_ITEMS = [
  { key: 'prospectus_issued', label: 'Prospectus & Admission Form Issued' },
  { key: 'campus_tour', label: 'Campus Tour Conducted' },
  { key: 'admission_test', label: 'Admission Evaluation Test' },
  { key: 'parent_interview', label: 'Principal / Management Interview' },
  { key: 'fee_discussed', label: 'Fee Package Discussed & Finalized' }
];

export default function CrmSiblingsChecklistTab({
  siblings = [],
  checklist = {},
  onChange
}) {
  const toggleChecklist = (key) => {
    onChange('checklist', { ...checklist, [key]: !checklist[key] });
  };

  const addSibling = () => {
    onChange('siblings', [...siblings, { name: '', gr_number: '', class_name: '' }]);
  };

  const updateSibling = (index, field, value) => {
    const list = [...siblings];
    list[index] = { ...list[index], [field]: value };
    onChange('siblings', list);
  };

  const removeSibling = (index) => {
    onChange('siblings', siblings.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-5xl">
      <div className="lg:col-span-6 bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2 border-b border-line dark:border-line-dark pb-2">
          <CheckSquare className="w-4 h-4 text-primary" /> Admission Checklist
        </h3>
        <div className="space-y-3">
          {CHECKLIST_ITEMS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-line dark:border-line-dark hover:bg-hover/50 cursor-pointer select-none transition-colors"
            >
              <input
                type="checkbox"
                checked={Boolean(checklist[key])}
                onChange={() => toggleChecklist(key)}
                className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary"
              />
              <span className="text-xs font-medium text-text-secondary">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="lg:col-span-6 bg-surface dark:bg-surface-dark p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-2">
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Sibling Information
          </h3>
          <button
            type="button"
            onClick={addSibling}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
          >
            <Plus size={12} /> Add Sibling
          </button>
        </div>

        {siblings.length === 0 ? (
          <p className="text-xs text-text-muted py-6 text-center">No siblings recorded for this inquiry.</p>
        ) : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {siblings.map((sib, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-muted">Sibling #{idx + 1}</span>
                  <button type="button" onClick={() => removeSibling(idx)} className="text-bad hover:opacity-80 p-1">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <input
                    type="text"
                    value={sib.name}
                    onChange={(e) => updateSibling(idx, 'name', e.target.value)}
                    placeholder="Sibling Name"
                    className="px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-transparent"
                  />
                  <input
                    type="text"
                    value={sib.gr_number}
                    onChange={(e) => updateSibling(idx, 'gr_number', e.target.value)}
                    placeholder="GR No (if in school)"
                    className="px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-transparent font-mono"
                  />
                  <input
                    type="text"
                    value={sib.class_name}
                    onChange={(e) => updateSibling(idx, 'class_name', e.target.value)}
                    placeholder="Class"
                    className="px-2 py-1 rounded-lg border border-line dark:border-line-dark bg-transparent"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
