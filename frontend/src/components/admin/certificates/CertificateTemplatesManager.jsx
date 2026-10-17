import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, Check } from 'lucide-react';
import api from '../../../services/api';
import { STYLE_OPTIONS } from './CertificateDesigns';

const PLACEHOLDERS = [
  '{{name}}', '{{father_name}}', '{{gr_number}}', '{{class_name}}',
  '{{section}}', '{{dob}}', '{{admission_date}}', '{{custom_text}}',
  '{{designation}}', '{{bps_grade}}', '{{employee_code}}', '{{date}}', '{{school_name}}'
];

const CertificateTemplatesManager = ({ templates = [], onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', recipient_type: 'Student', heading: '', sub_heading: 'THIS IS TO CERTIFY THAT',
    body_template: '', design_style: 'royal_gold', accent_color: '#0d9488'
  });

  const handleOpenEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name, recipient_type: t.recipient_type || 'Student', heading: t.heading,
      sub_heading: t.sub_heading || 'THIS IS TO CERTIFY THAT', body_template: t.body_template,
      design_style: t.design_style || 'royal_gold', accent_color: t.accent_color || '#0d9488'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/api/certificates/templates/${editingId}`, form);
      else await api.post('/api/certificates/templates', form);
      setModalOpen(false);
      setEditingId(null);
      onRefresh();
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/certificates/templates/${id}`);
      onRefresh();
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Certificate Templates Studio
          </h3>
          <p className="text-xs text-slate-500">Manage institutional templates, award wording, and placeholder tags.</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setForm({ name: '', recipient_type: 'Student', heading: '', sub_heading: 'THIS IS TO CERTIFY THAT', body_template: '', design_style: 'royal_gold', accent_color: '#0d9488' }); setModalOpen(true); }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer"
        >
          <Plus size={14} /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t._id} className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t.recipient_type}</span>
                <span className="text-[10px] text-ink-muted capitalize">{t.design_style?.replace('_', ' ')}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">{t.name}</h4>
              <p className="text-xs font-serif text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 bg-surface-secondary/30 p-2 rounded-xl">{t.body_template}</p>
            </div>
            <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-line dark:border-line-dark">
              <button onClick={() => handleOpenEdit(t)} className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary cursor-pointer"><Edit2 size={13} /></button>
              <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg border border-line hover:bg-bad/10 text-ink-muted hover:text-bad cursor-pointer"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSave} className="bg-surface dark:bg-slate-900 border border-line p-5 rounded-2xl w-full max-w-lg space-y-3 shadow-xl text-xs">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">{editingId ? 'Edit Template' : 'New Template'}</h3>
            <div>
              <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Template Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent font-semibold" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Recipient Type</label>
                <select value={form.recipient_type} onChange={(e) => setForm({ ...form, recipient_type: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent">
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">Visual Design Style</label>
                <select value={form.design_style} onChange={(e) => setForm({ ...form, design_style: e.target.value })} className="w-full px-3 py-1.5 rounded-xl border border-line bg-transparent">
                  {STYLE_OPTIONS.map((st) => <option key={st.id} value={st.id}>{st.label}</option>)}
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
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl border border-line font-bold cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white font-bold cursor-pointer">Save Template</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CertificateTemplatesManager;
