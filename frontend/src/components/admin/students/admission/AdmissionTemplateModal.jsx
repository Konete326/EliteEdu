import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../../../services/api';

const DEFAULT_SUB_CLAUSES = [
  'you fail to formally accept this offer by paying the admission & tuition dues of PKR {{fee_amount}} on or before the specified due date.',
  'you are unable to satisfy the necessary criteria for academic admission and verification.',
  'you cannot produce at the time of registration, the original copies of birth certificate / B-Form, previous School Leaving Certificate (SLC), and verified academic credentials.'
];

const DEFAULT_CONDITIONS = [
  'The programme is on Regular / Full-Time basis. The duration of your academic session and other institutional conditions relating to conduct and discipline are as contained in the student handbook and institutional prospectus.',
  'The attached information and challan voucher on fees payable is for your immediate compliance.',
  'If you accept this offer, kindly collect the official admission docket and uniform guidelines from the campus administration office.',
  'Please note that the student’s name and registration number ({{gr_number}}) should be boldly written in the space provided for depositor in the bank teller / challan receipt.',
  'Payment of all admission dues must be made not later than {{due_date}} as this provisional offer of admission will lapse thereafter.',
  'It is mandatory for you to attend the new student induction assembly and orientation programme prior to regular classes. Failure to attend without prior approval may lead to cancellation of admission.',
  'Please note that if it is discovered at any time that you do not possess any of the academic qualifications or submitted fraudulent documents, the admission will be withdrawn immediately.'
];

const AdmissionTemplateModal = ({ isOpen, template, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    is_default: false,
    header_office_title: 'Office of the Principal',
    subject_format: 'OFFER OF PROVISIONAL ADMISSION INTO {{grade}} ({{session}} ACADEMIC SESSION)',
    opening_text: 'With reference to your application for admission into {{school_name}}, I am pleased to inform you that you have been offered provisional admission to pursue an academic programme leading to the completion of {{grade}} (Section {{section}}) in the Department of {{stream}} with effect from the {{session}} Session.',
    fee_due_days: 14,
    sub_clauses_revocation: DEFAULT_SUB_CLAUSES,
    conditions: DEFAULT_CONDITIONS,
    closing_text: 'Please accept our warmest congratulations on behalf of the administration and faculty of the school.',
    signatory_title: 'For: Admissions & Academic Directorate',
    signatory_name: '',
    stripe_primary_color: '#581c87',
    stripe_accent_color: '#0f766e'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || '',
        is_default: Boolean(template.is_default),
        header_office_title: template.header_office_title || 'Office of the Principal',
        subject_format: template.subject_format || 'OFFER OF PROVISIONAL ADMISSION INTO {{grade}} ({{session}} ACADEMIC SESSION)',
        opening_text: template.opening_text || '',
        fee_due_days: template.fee_due_days || 14,
        sub_clauses_revocation: template.sub_clauses_revocation?.length ? template.sub_clauses_revocation : DEFAULT_SUB_CLAUSES,
        conditions: template.conditions?.length ? template.conditions : DEFAULT_CONDITIONS,
        closing_text: template.closing_text || '',
        signatory_title: template.signatory_title || 'For: Admissions & Academic Directorate',
        signatory_name: template.signatory_name || '',
        stripe_primary_color: template.stripe_primary_color || '#581c87',
        stripe_accent_color: template.stripe_accent_color || '#0f766e'
      });
    } else {
      setFormData({
        title: '',
        is_default: false,
        header_office_title: 'Office of the Principal',
        subject_format: 'OFFER OF PROVISIONAL ADMISSION INTO {{grade}} ({{session}} ACADEMIC SESSION)',
        opening_text: 'With reference to your application for admission into {{school_name}}, I am pleased to inform you that you have been offered provisional admission to pursue an academic programme leading to the completion of {{grade}} (Section {{section}}) in the Department of {{stream}} with effect from the {{session}} Session.',
        fee_due_days: 14,
        sub_clauses_revocation: DEFAULT_SUB_CLAUSES,
        conditions: DEFAULT_CONDITIONS,
        closing_text: 'Please accept our warmest congratulations on behalf of the administration and faculty of the school.',
        signatory_title: 'For: Admissions & Academic Directorate',
        signatory_name: '',
        stripe_primary_color: '#581c87',
        stripe_accent_color: '#0f766e'
      });
    }
  }, [template, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setError('Template title is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      if (template?._id) {
        const res = await api.put(`/admission-letter-templates/${template._id}`, formData);
        if (res.data?.success) onSaved(res.data.template);
      } else {
        const res = await api.post('/admission-letter-templates', formData);
        if (res.data?.success) onSaved(res.data.template);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubClause = (index, value) => {
    const list = [...formData.sub_clauses_revocation];
    list[index] = value;
    setFormData({ ...formData, sub_clauses_revocation: list });
  };

  const handleRemoveSubClause = (index) => {
    setFormData({
      ...formData,
      sub_clauses_revocation: formData.sub_clauses_revocation.filter((_, i) => i !== index)
    });
  };

  const handleAddSubClause = () => {
    setFormData({
      ...formData,
      sub_clauses_revocation: [...formData.sub_clauses_revocation, '']
    });
  };

  const handleUpdateCondition = (index, value) => {
    const list = [...formData.conditions];
    list[index] = value;
    setFormData({ ...formData, conditions: list });
  };

  const handleRemoveCondition = (index) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index)
    });
  };

  const handleAddCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, '']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-surface dark:bg-[#121217] border border-line dark:border-white/10 rounded-2xl shadow-2xl z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 sm:p-5 border-b border-line dark:border-white/10 flex items-center justify-between shrink-0 bg-surface-secondary/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-ink dark:text-white">
                {template?._id ? 'Edit Admission Letter Policy Template' : 'Create Admission Letter Policy Template'}
              </h2>
              <p className="text-[11px] text-ink-muted">
                Customize institutional admission terms, deadline days, and legal clauses
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-ink dark:text-white">
          {error && (
            <div className="p-3 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-8">
              <label className="block text-xs font-bold mb-1">Template Name *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Standard High School Admission Letter"
                className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 text-xs font-semibold outline-none focus:border-primary"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold mb-1">Fee Payment Window</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formData.fee_due_days}
                  onChange={(e) => setFormData({ ...formData, fee_due_days: Number(e.target.value) || 14 })}
                  className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 text-xs font-mono font-bold outline-none focus:border-primary"
                />
                <span className="text-xs text-ink-muted font-medium shrink-0">Days</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
            />
            <label htmlFor="is_default" className="text-xs font-semibold cursor-pointer">
              Set as Default Template for all new student admission letters
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold mb-1">Office / Authority Subtitle</label>
              <input
                type="text"
                value={formData.header_office_title}
                onChange={(e) => setFormData({ ...formData, header_office_title: e.target.value })}
                placeholder="e.g. Office of the Principal / Dean"
                className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 text-xs outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Signatory Title</label>
              <input
                type="text"
                value={formData.signatory_title}
                onChange={(e) => setFormData({ ...formData, signatory_title: e.target.value })}
                placeholder="e.g. For: Admissions & Academic Council"
                className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 text-xs outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Subject Heading</label>
            <input
              type="text"
              value={formData.subject_format}
              onChange={(e) => setFormData({ ...formData, subject_format: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 text-xs font-mono outline-none focus:border-primary"
            />
            <p className="text-[10px] text-ink-muted mt-1">
              Placeholders: <span className="font-mono text-primary font-bold">{`{{grade}}`}</span>,{' '}
              <span className="font-mono text-primary font-bold">{`{{session}}`}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Opening Congratulations Paragraph</label>
            <textarea
              rows={3}
              value={formData.opening_text}
              onChange={(e) => setFormData({ ...formData, opening_text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-black/20 text-xs outline-none focus:border-primary resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-line/60 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold">Revocation Sub-Clauses (Clause 1a, 1b, 1c...)</h4>
                <p className="text-[10px] text-ink-muted">Conditions under which provisional offer can be cancelled</p>
              </div>
              <button
                type="button"
                onClick={handleAddSubClause}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary font-bold text-[11px] hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Sub-Clause</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.sub_clauses_revocation.map((clause, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-secondary dark:bg-white/10 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                    {String.fromCharCode(97 + idx)}
                  </span>
                  <input
                    type="text"
                    value={clause}
                    onChange={(e) => handleUpdateSubClause(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-xs outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubClause(idx)}
                    disabled={formData.sub_clauses_revocation.length <= 1}
                    className="p-1.5 text-bad hover:bg-bad-soft rounded-lg disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-line/60 dark:border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold">Institutional Rules &amp; Conditions (Clauses 2, 3, 4...)</h4>
                <p className="text-[10px] text-ink-muted">School terms relating to attendance, fees, and code of conduct</p>
              </div>
              <button
                type="button"
                onClick={handleAddCondition}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-primary/30 bg-primary/10 text-primary font-bold text-[11px] hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Rule</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.conditions.map((cond, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-secondary dark:bg-white/10 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono mt-1">
                    {idx + 2}
                  </span>
                  <textarea
                    rows={2}
                    value={cond}
                    onChange={(e) => handleUpdateCondition(idx, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-xs outline-none focus:border-primary resize-none leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(idx)}
                    disabled={formData.conditions.length <= 1}
                    className="p-1.5 text-bad hover:bg-bad-soft rounded-lg disabled:opacity-30 cursor-pointer mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-line/60 dark:border-white/5">
            <div>
              <label className="block text-[11px] font-bold mb-1">Stripe Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.stripe_primary_color}
                  onChange={(e) => setFormData({ ...formData, stripe_primary_color: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-line dark:border-white/10 p-0.5 bg-transparent"
                />
                <span className="font-mono text-xs font-semibold">{formData.stripe_primary_color}</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold mb-1">Stripe Secondary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.stripe_accent_color}
                  onChange={(e) => setFormData({ ...formData, stripe_accent_color: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-line dark:border-white/10 p-0.5 bg-transparent"
                />
                <span className="font-mono text-xs font-semibold">{formData.stripe_accent_color}</span>
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-line dark:border-white/10 flex items-center justify-end gap-2 bg-surface-secondary/20 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-line dark:border-white/10 text-xs font-semibold hover:bg-surface-secondary cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm shadow-primary/20 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Save Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionTemplateModal;
