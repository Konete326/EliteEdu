import React from 'react';
import { Save, Printer, Award } from 'lucide-react';
import PrerequisiteGuardBanner from '../../common/PrerequisiteGuardBanner';
import CertificateStyleOrientationPicker from './CertificateStyleOrientationPicker';
import CertificateRecipientFields from './CertificateRecipientFields';

const CertificateFormCard = ({
  templates = [],
  students = [],
  teachers = [],
  form = {},
  onChange,
  onGenerate,
  onPrint,
  generating = false,
  prereqs = [],
  onRefreshPrereqs
}) => {
  const isStudent = form.recipient_type === 'Student';
  const recipientsList = isStudent ? students : teachers;

  const handleTemplateChange = (e) => {
    const tid = e.target.value;
    onChange('template_id', tid);
    const selectedT = templates.find((t) => t._id === tid);
    if (selectedT) {
      if (selectedT.design_style) onChange('design_style', selectedT.design_style);
      if (selectedT.heading) onChange('custom_heading', selectedT.heading);
    }
  };

  return (
    <div className="bg-surface dark:bg-surface-dark p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" /> Certificate Configuration
        </h3>
        <span className="text-[10px] uppercase font-bold text-ink-muted">A4 Printable Studio</span>
      </div>

      <PrerequisiteGuardBanner prerequisites={prereqs} onRefresh={onRefreshPrereqs} />

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Select Template *</label>
          <select value={form.template_id} onChange={handleTemplateChange} className="w-full px-3 py-2 rounded-xl border border-line bg-transparent font-semibold">
            {templates.map((t) => (
              <option key={t._id} value={t._id}>{t.name} ({t.recipient_type})</option>
            ))}
          </select>
        </div>

        <CertificateStyleOrientationPicker
          style={form.design_style}
          orientation={form.orientation || 'landscape'}
          onStyleChange={(s) => onChange('design_style', s)}
          onOrientationChange={(o) => onChange('orientation', o)}
        />

        <CertificateRecipientFields
          form={form}
          isStudent={isStudent}
          recipientsList={recipientsList}
          onChange={onChange}
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-line dark:border-line-dark">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating || !form.recipient_id}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save size={15} /> {generating ? 'Saving...' : 'Generate Certificate'}
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold border border-line bg-surface dark:bg-surface-dark hover:bg-surface-secondary text-ink shadow-xs cursor-pointer"
        >
          <Printer size={15} /> Print A4
        </button>
      </div>
    </div>
  );
};

export default CertificateFormCard;
