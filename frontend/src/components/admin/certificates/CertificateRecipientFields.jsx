import React, { useState } from 'react';
import { Calendar, Quote, PenTool, Stamp, QrCode, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import CertificateRecipientPicker from './CertificateRecipientPicker';

const PLACEHOLDERS = [
  { label: 'Name', tag: '{{name}}' },
  { label: "Father's Name", tag: '{{father_name}}' },
  { label: 'GR Number', tag: '{{gr_number}}' },
  { label: 'Class', tag: '{{class_name}}' },
  { label: 'Section', tag: '{{section}}' },
  { label: 'DOB', tag: '{{dob}}' },
  { label: 'Admission Date', tag: '{{admission_date}}' },
  { label: 'Reason / Text', tag: '{{custom_text}}' },
  { label: 'Designation', tag: '{{designation}}' },
  { label: 'Employee Code', tag: '{{employee_code}}' },
  { label: 'School Name', tag: '{{school_name}}' },
  { label: 'Slogan', tag: '{{slogan}}' },
  { label: 'Date', tag: '{{date}}' }
];

const CertificateRecipientFields = ({
  form = {},
  students = [],
  teachers = [],
  defaultSlogan = 'Excellence in Education',
  onChange
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const insertPlaceholder = (tag) => {
    const current = form.custom_body || '';
    onChange('custom_body', `${current} ${tag}`);
  };

  return (
    <div className="space-y-3.5">
      <CertificateRecipientPicker
        form={form}
        students={students}
        teachers={teachers}
        onChange={onChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1 flex items-center gap-1">
            <Calendar size={12} className="text-primary" />
            <span>Issue Date *</span>
          </label>
          <input
            type="date"
            value={form.issue_date || ''}
            onChange={(e) => onChange('issue_date', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-semibold"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1 flex items-center gap-1">
            <Quote size={12} className="text-primary" />
            <span>Campus Motto / Slogan</span>
          </label>
          <input
            type="text"
            value={form.custom_slogan !== undefined ? form.custom_slogan : defaultSlogan}
            onChange={(e) => onChange('custom_slogan', e.target.value)}
            placeholder="e.g. Excellence in Education"
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Certificate Title / Heading *
          </label>
          <input
            type="text"
            value={form.custom_heading || ''}
            onChange={(e) => onChange('custom_heading', e.target.value)}
            placeholder="e.g. SCHOOL LEAVING CERTIFICATE"
            className="w-full px-3 py-2 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-bold uppercase tracking-wide"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Citation Sub-Heading
          </label>
          <input
            type="text"
            value={form.sub_heading || ''}
            onChange={(e) => onChange('sub_heading', e.target.value)}
            placeholder="e.g. THIS IS TO CERTIFY THAT"
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-semibold uppercase tracking-wider text-ink-muted"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Custom Merit / Reason Variable (`{'{{custom_text}}'}`)
          </label>
          <input
            type="text"
            value={form.custom_text || ''}
            onChange={(e) => onChange('custom_text', e.target.value)}
            placeholder="e.g. outstanding academic performance in Annual Exams 2026"
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-medium"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-bold text-ink-muted uppercase">
            Certificate Body / Statement *
          </label>
          <span className="text-[10px] text-ink-muted font-medium">Click tag to insert</span>
        </div>
        <textarea
          rows={3}
          value={form.custom_body || ''}
          onChange={(e) => onChange('custom_body', e.target.value)}
          placeholder="Statement text with dynamic tags..."
          className="w-full px-3 py-2 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-medium leading-relaxed resize-none"
        />
        <div className="flex flex-wrap gap-1 mt-1.5">
          {PLACEHOLDERS.map((p) => (
            <button
              key={p.tag}
              type="button"
              onClick={() => insertPlaceholder(p.tag)}
              className="px-2 py-0.5 rounded-md bg-surface-secondary/70 hover:bg-primary/15 text-[10px] font-mono text-ink-muted hover:text-primary transition-colors cursor-pointer border border-line/50"
            >
              +{p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full py-1.5 px-2 rounded-lg bg-surface-secondary/30 hover:bg-surface-secondary/60 text-ink-muted text-[11px] font-bold transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-primary" />
            <span>Endorsements & Signatories Settings</span>
          </span>
          {showAdvanced ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showAdvanced && (
          <div className="mt-2.5 p-3 rounded-xl border border-line bg-surface-secondary/20 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">
                  Signatory 1 Title
                </label>
                <input
                  type="text"
                  value={form.signatory_title_1 || 'Teacher In-Charge'}
                  onChange={(e) => onChange('signatory_title_1', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface dark:bg-surface-dark text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-ink-muted uppercase mb-1">
                  Signatory 2 Title
                </label>
                <input
                  type="text"
                  value={form.signatory_title_2 || 'Principal / Headmaster'}
                  onChange={(e) => onChange('signatory_title_2', e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface dark:bg-surface-dark text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded-lg border border-line bg-surface dark:bg-surface-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_stamp !== false}
                  onChange={(e) => onChange('show_stamp', e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-[11px] font-semibold text-ink flex items-center gap-1">
                  <Stamp size={12} className="text-primary" /> Official Stamp
                </span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg border border-line bg-surface dark:bg-surface-dark cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.show_qr !== false}
                  onChange={(e) => onChange('show_qr', e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-[11px] font-semibold text-ink flex items-center gap-1">
                  <QrCode size={12} className="text-primary" /> Verification QR
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateRecipientFields;