import React from 'react';
import { Save, Printer, User, Award, Palette, Calendar } from 'lucide-react';
import { STYLE_OPTIONS } from './CertificateDesigns';
import PrerequisiteGuardBanner from '../../common/PrerequisiteGuardBanner';

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

  return (
    <div className="bg-surface dark:bg-surface-dark p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
          <Award className="w-4 h-4 text-primary" /> Certificate Configuration
        </h3>
        <span className="text-[10px] uppercase font-bold text-ink-muted">A4 Printable Format</span>
      </div>

      <PrerequisiteGuardBanner prerequisites={prereqs} onRefresh={onRefreshPrereqs} />

      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Select Template *</label>
          <select value={form.template_id} onChange={(e) => onChange('template_id', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line bg-transparent font-semibold">
            {templates.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.recipient_type})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1 flex items-center gap-1">
            <Palette size={12} /> Visual Design Style *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {STYLE_OPTIONS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChange('design_style', st.id)}
                className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all text-left flex items-center gap-1.5 cursor-pointer ${
                  form.design_style === st.id ? 'border-primary bg-primary/10 text-primary shadow-2xs' : 'border-line hover:bg-surface-secondary text-ink'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                <span className="truncate">{st.label}</span>
              </button>
            ))}
          </div>
        </div>

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
            type="text" value={form.custom_text} onChange={(e) => onChange('custom_text', e.target.value)}
            placeholder="e.g. outstanding academic performance / transfer"
            className="w-full px-3 py-2 rounded-xl border border-line bg-transparent font-medium"
          />
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-line dark:border-line-dark">
        <button
          type="button" onClick={onGenerate} disabled={generating || !form.recipient_id}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Save size={15} /> {generating ? 'Saving...' : 'Generate Certificate'}
        </button>
        <button
          type="button" onClick={onPrint}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold border border-line bg-surface dark:bg-surface-dark hover:bg-surface-secondary text-ink shadow-xs cursor-pointer"
        >
          <Printer size={15} /> Print A4
        </button>
      </div>
    </div>
  );
};

export default CertificateFormCard;
