import React from 'react';
import { Save, Printer, Download, Award, FileText } from 'lucide-react';
import PrerequisiteGuardBanner from '../../common/PrerequisiteGuardBanner';
import CertificateStyleOrientationPicker from './CertificateStyleOrientationPicker';
import CertificateRecipientFields from './CertificateRecipientFields';

const CertificateFormCard = ({
  templates = [],
  students = [],
  teachers = [],
  form = {},
  defaultSlogan = 'Excellence in Education',
  onChange,
  onGenerate,
  onPrint,
  onDownloadPdf,
  generating = false,
  downloading = false,
  prereqs = [],
  onRefreshPrereqs
}) => {
  const handleTemplateChange = (e) => {
    const tid = e.target.value;
    onChange('template_id', tid);
    const selectedT = templates.find((t) => t._id === tid);
    if (selectedT) {
      if (selectedT.design_style) onChange('design_style', selectedT.design_style);
      if (selectedT.heading) onChange('custom_heading', selectedT.heading);
      if (selectedT.sub_heading) onChange('sub_heading', selectedT.sub_heading);
      if (selectedT.orientation) onChange('orientation', selectedT.orientation);
      if (selectedT.body_template) onChange('custom_body', selectedT.body_template);
    }
  };

  return (
    <div className="bg-surface dark:bg-surface-dark p-3.5 sm:p-4 rounded-2xl border border-line dark:border-line-dark shadow-xs flex flex-col justify-between text-xs xl:h-[490px] xl:max-h-[490px]">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark shrink-0">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" /> Certificate Configuration
        </h3>
        <span className="text-[10px] uppercase font-bold text-ink-muted">A4 Printable Studio</span>
      </div>

      <PrerequisiteGuardBanner prerequisites={prereqs} onRefresh={onRefreshPrereqs} />

      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar my-1.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1 flex items-center gap-1">
            <FileText size={12} className="text-primary" />
            <span>Select Preset Template *</span>
          </label>
          <select
            value={form.template_id}
            onChange={handleTemplateChange}
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface dark:bg-surface-dark font-semibold text-xs text-ink"
          >
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.recipient_type})
              </option>
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
          students={students}
          teachers={teachers}
          defaultSlogan={defaultSlogan}
          onChange={onChange}
        />
      </div>

      <div className="pt-2 border-t border-line dark:border-line-dark space-y-1.5 shrink-0 bg-surface dark:bg-surface-dark">
        <button
          type="button"
          onClick={onGenerate}
          disabled={generating || !form.recipient_id}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50 transition-all text-xs"
        >
          <Save size={15} />
          <span>{generating ? 'Issuing & Saving Record...' : 'Generate & Issue Certificate'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary shadow-2xs cursor-pointer transition-all disabled:opacity-50 text-xs"
          >
            <Download size={14} />
            <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold border border-line bg-surface hover:bg-surface-secondary text-ink shadow-2xs cursor-pointer transition-all text-xs"
          >
            <Printer size={14} />
            <span>Print A4</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateFormCard;