import React from 'react';
import { X, Award, Sparkles } from 'lucide-react';
import { STYLE_OPTIONS } from './CertificateDesigns';

const PLACEHOLDERS = [
  '{{name}}',
  '{{father_name}}',
  '{{gr_number}}',
  '{{class_name}}',
  '{{section}}',
  '{{dob}}',
  '{{admission_date}}',
  '{{custom_text}}',
  '{{designation}}',
  '{{bps_grade}}',
  '{{employee_code}}',
  '{{date}}',
  '{{school_name}}',
  '{{campus_name}}',
  '{{slogan}}'
];

const CertificateTemplateModal = ({ modalOpen, onClose, form, setForm, onSave, editingId }) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <form
        onSubmit={onSave}
        className="relative z-10 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-5 sm:p-6 rounded-2xl w-full max-w-lg space-y-3.5 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-primary" />
            <span>{editingId ? 'Edit Certificate Template' : 'Create New Certificate Template'}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Template Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Matriculation Excellence Award"
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark font-semibold text-xs"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Recipient
            </label>
            <select
              value={form.recipient_type}
              onChange={(e) => setForm({ ...form, recipient_type: e.target.value })}
              className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-semibold"
            >
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Design Style
            </label>
            <select
              value={form.design_style}
              onChange={(e) => setForm({ ...form, design_style: e.target.value })}
              className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-semibold"
            >
              {STYLE_OPTIONS.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Orientation
            </label>
            <select
              value={form.orientation || 'landscape'}
              onChange={(e) => setForm({ ...form, orientation: e.target.value })}
              className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark text-xs font-semibold"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Certificate Heading *
            </label>
            <input
              required
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
              placeholder="e.g. CERTIFICATE OF MERIT"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark uppercase font-bold text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
              Citation Sub-Heading
            </label>
            <input
              value={form.sub_heading || ''}
              onChange={(e) => setForm({ ...form, sub_heading: e.target.value })}
              placeholder="e.g. THIS IS TO CERTIFY THAT"
              className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark uppercase font-semibold text-xs text-ink-muted"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Body Template *
          </label>
          <textarea
            required
            rows={4}
            value={form.body_template}
            onChange={(e) => setForm({ ...form, body_template: e.target.value })}
            placeholder="Statement text with dynamic {{tags}}..."
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface dark:bg-surface-dark font-medium text-xs leading-relaxed resize-none"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {PLACEHOLDERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setForm({ ...form, body_template: `${form.body_template} ${p}` })}
                className="px-1.5 py-0.5 rounded bg-surface-secondary text-[10px] font-mono hover:bg-primary/20 text-ink-muted hover:text-primary transition-colors cursor-pointer border border-line/40"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-line dark:border-line-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-line font-bold text-xs text-ink hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
          >
            Save Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateTemplateModal;