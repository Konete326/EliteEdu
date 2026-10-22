import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Award, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../../services/api';
import CertificateTemplateModal from './CertificateTemplateModal';
import ConfirmModal from '../../common/ConfirmModal';

const CertificateTemplatesManager = ({ templates = [], onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    name: '',
    recipient_type: 'Student',
    heading: '',
    sub_heading: 'THIS IS TO CERTIFY THAT',
    body_template: '',
    design_style: 'academic_gold_hatch',
    orientation: 'landscape',
    accent_color: '#b59449'
  });

  const handleOpenEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      recipient_type: t.recipient_type || 'Student',
      heading: t.heading,
      sub_heading: t.sub_heading || 'THIS IS TO CERTIFY THAT',
      body_template: t.body_template,
      design_style: t.design_style || 'academic_gold_hatch',
      orientation: t.orientation || 'landscape',
      accent_color: t.accent_color || '#b59449'
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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/certificates/templates/${deleteTarget._id}`);
      setDeleteTarget(null);
      onRefresh();
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-line dark:border-line-dark">
        <div>
          <h2 className="text-base font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Certificate Templates Directory
          </h2>
          <p className="text-xs text-ink-muted">
            Configure institutional wording, orientation presets, and award placeholders.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setForm({
              name: '',
              recipient_type: 'Student',
              heading: '',
              sub_heading: 'THIS IS TO CERTIFY THAT',
              body_template: '',
              design_style: 'academic_gold_hatch',
              orientation: 'landscape',
              accent_color: '#b59449'
            });
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer transition-all shrink-0"
        >
          <Plus size={14} /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div
            key={t._id}
            className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {t.recipient_type}
                </span>
                <span className="text-[10px] text-ink-muted capitalize font-medium">
                  {t.orientation || 'landscape'} • {t.design_style?.replace(/_/g, ' ')}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1">
                {t.name}
              </h4>
              <p className="text-xs font-serif text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 bg-surface-secondary/40 p-2.5 rounded-xl border border-line/40">
                {t.body_template}
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-line dark:border-line-dark text-xs">
              <span className="text-[10px] text-ink-muted font-medium truncate max-w-[140px]">
                {t.heading}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-primary transition-colors cursor-pointer"
                  title="Edit Template"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(t)}
                  className="p-1.5 rounded-lg border border-line hover:bg-bad/10 text-ink-muted hover:text-bad transition-colors cursor-pointer"
                  title="Delete Template"
                >
                  <Trash2 size={13} />
                </button>
              </div>
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

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Certificate Template"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Templates currently used by issued certificates will remain in records.`}
        confirmText="Delete Template"
        cancelText="Cancel"
        confirmStyle="danger"
      />
    </div>
  );
};

export default CertificateTemplatesManager;