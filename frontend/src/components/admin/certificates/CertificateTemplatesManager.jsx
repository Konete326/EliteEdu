import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award } from 'lucide-react';
import api from '../../../services/api';
import CertificateTemplateModal from './CertificateTemplateModal';

const CertificateTemplatesManager = ({ templates = [], onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '', recipient_type: 'Student', heading: '', sub_heading: 'THIS IS TO CERTIFY THAT',
    body_template: '', design_style: 'academic_gold_hatch', orientation: 'landscape', accent_color: '#b59449'
  });

  const handleOpenEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name, recipient_type: t.recipient_type || 'Student', heading: t.heading,
      sub_heading: t.sub_heading || 'THIS IS TO CERTIFY THAT', body_template: t.body_template,
      design_style: t.design_style || 'academic_gold_hatch', orientation: t.orientation || 'landscape', accent_color: t.accent_color || '#b59449'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/certificates/templates/${editingId}`, form);
      else await api.post('/certificates/templates', form);
      setModalOpen(false);
      setEditingId(null);
      onRefresh();
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/certificates/templates/${id}`);
      onRefresh();
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">Configured Templates ({templates.length})</span>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ name: '', recipient_type: 'Student', heading: '', sub_heading: 'THIS IS TO CERTIFY THAT', body_template: '', design_style: 'academic_gold_hatch', orientation: 'landscape', accent_color: '#b59449' });
            setModalOpen(true);
          }}
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
                <span className="text-[10px] text-ink-muted capitalize">{t.orientation || 'landscape'} • {t.design_style?.replace(/_/g, ' ')}</span>
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

      <CertificateTemplateModal
        modalOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        editingId={editingId}
      />
    </div>
  );
};

export default CertificateTemplatesManager;
