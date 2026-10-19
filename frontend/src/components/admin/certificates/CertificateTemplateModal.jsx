import React from 'react';
import { STYLE_OPTIONS } from './CertificateDesigns';

const PLACEHOLDERS = [
  '{{name}}', '{{father_name}}', '{{gr_number}}', '{{class_name}}',
  '{{section}}', '{{dob}}', '{{admission_date}}', '{{custom_text}}',
  '{{designation}}', '{{bps_grade}}', '{{employee_code}}', '{{date}}', '{{school_name}}'
];

const CertificateTemplateModal = ({ modalOpen, onClose, form, setForm, onSave, editingId }) => {
  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={onSave} className="bg-surface dark:bg-slate-900 border border-line p-5 rounded-2xl w-full max-w-lg space-y-3 shadow-xl text-xs">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white">{editingId ? 'Edit Template' : 'New Template'}</h3>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Template Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent font-semibold" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Recipient</label>
            <select value={form.recipient_type} onChange={(e) => setForm({ ...form, recipient_type: e.target.value })} className="w-full px-2 py-1.5 rounded-xl border border-line bg-transparent">
              <option value="Student">Student</option>
              <option value="Staff">Staff</option>
              <option value="Both">Both</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Design Style</label>
            <select value={form.design_style} onChange={(e) => setForm({ ...form, design_style: e.target.value })} className="w-full px-2 py-1.5 rounded-xl border border-line bg-transparent">
              {STYLE_OPTIONS.map((st) => <option key={st.id} value={st.id}>{st.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Orientation</label>
            <select value={form.orientation || 'landscape'} onChange={(e) => setForm({ ...form, orientation: e.target.value })} className="w-full px-2 py-1.5 rounded-xl border border-line bg-transparent">
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Heading *</label>
          <input required value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent uppercase font-bold" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Body Template *</label>
          <textarea required rows={4} value={form.body_template} onChange={(e) => setForm({ ...form, body_template: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent font-medium" />
          <div className="flex flex-wrap gap-1 mt-1">
            {PLACEHOLDERS.map((p) => (
              <button key={p} type="button" onClick={() => setForm({ ...form, body_template: `${form.body_template} ${p}` })} className="px-1.5 py-0.5 rounded bg-surface-secondary text-[10px] font-mono hover:bg-primary/20 cursor-pointer">
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-line">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line font-bold cursor-pointer">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-bold cursor-pointer">Save Template</button>
        </div>
      </form>
    </div>
  );
};

export default CertificateTemplateModal;
