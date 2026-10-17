import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, User, FileText, CheckSquare, PhoneCall, Home } from 'lucide-react';
import api from '../../services/api';
import usePersistentFormDraft from '../../hooks/usePersistentFormDraft';
import PrerequisiteGuardBanner from '../../components/common/PrerequisiteGuardBanner';
import CrmStudentInfoTab from '../../components/admin/crm/form/CrmStudentInfoTab';
import CrmAdditionalTab from '../../components/admin/crm/form/CrmAdditionalTab';
import CrmSiblingsChecklistTab from '../../components/admin/crm/form/CrmSiblingsChecklistTab';
import CrmDocumentsTab from '../../components/admin/crm/form/CrmDocumentsTab';
import CrmFormFollowUpsTab from '../../components/admin/crm/form/CrmFormFollowUpsTab';

const INITIAL_LEAD = {
  student_name: '', father_name: '', surname: '', grade_id: '', country: 'Pakistan',
  contact_country_code: '+92', contact_number: '', email: '', inquiry_date: new Date().toISOString().substring(0, 10),
  gender: '', age: null, dob: null, academic_session: '2026-2027', message: '',
  lead_status: 'New Inquiry', lead_source: 'Walk-in', priority: 'Medium', tag_label: '',
  purpose: 'Admission inquiry', expected_enrollment_date: null,
  additional_info: { previous_school: '', last_class: '', father_occupation: '', mother_name: '', mother_phone: '', expected_discount: 0, address: '' },
  siblings: [], checklist: { prospectus_issued: false, campus_tour: false, admission_test: false, parent_interview: false, fee_discussed: false },
  documents: [], follow_ups: []
};

export default function CrmLeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [activeTab, setActiveTab] = useState('student_info');
  const [formData, setFormData, clearDraft] = usePersistentFormDraft(isEdit ? `crm_lead_${id}` : 'crm_lead_new', INITIAL_LEAD);
  const [grades, setGrades] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/grades').then((res) => setGrades(res.data.grades || res.data || [])).catch(() => {});
    if (isEdit) {
      api.get(`/crm/leads/${id}`).then((res) => { if (res.data?.lead) setFormData(res.data.lead); }).catch(() => {});
    }
  }, [id]);

  const handleChange = (field, val) => setFormData((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_name?.trim() || !formData.contact_number?.trim() || !formData.grade_id) return;
    try {
      setSaving(true);
      if (isEdit) await api.put(`/crm/leads/${id}`, formData);
      else await api.post('/crm/leads', formData);
      clearDraft();
      navigate('/admin/crm/inquiries');
    } catch {} finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'student_info', label: 'Student Info', icon: User },
    { id: 'additional', label: 'Additional', icon: Home },
    { id: 'siblings', label: 'Siblings & Checklist', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'follow_ups', label: 'Follow-ups', icon: PhoneCall }
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/admin/crm/inquiries')} className="p-2 rounded-xl border border-line dark:border-line-dark hover:bg-hover cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-text-primary-dark">{isEdit ? 'Edit Lead' : 'New Lead'}</h1>
            <p className="text-xs text-text-muted">Record prospective student information and admission inquiries.</p>
          </div>
        </div>
        <button type="button" disabled={saving} onClick={handleSubmit} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs cursor-pointer">
          <Save className="w-3.5 h-3.5" /> <span>{saving ? 'Saving...' : 'Save Lead'}</span>
        </button>
      </div>

      <PrerequisiteGuardBanner prerequisites={[{ name: 'Classes / Grades', count: grades.length, addPath: '/admin/academic/grades', label: 'Add Class' }]} />

      <div className="flex border-b border-line dark:border-line-dark gap-2 overflow-x-auto text-xs font-semibold">
        {tabs.map(({ id: tid, label, icon: Icon }) => (
          <button key={tid} type="button" onClick={() => setActiveTab(tid)} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl transition-colors cursor-pointer ${activeTab === tid ? 'bg-surface dark:bg-surface-dark border-t-2 border-primary text-primary font-bold' : 'text-text-muted hover:text-text-primary'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'student_info' && <CrmStudentInfoTab formData={formData} onChange={handleChange} grades={grades} onOpenQuickAddStatus={() => {}} onOpenQuickAddSource={() => {}} />}
      {activeTab === 'additional' && <CrmAdditionalTab additionalInfo={formData.additional_info} onChange={handleChange} />}
      {activeTab === 'siblings' && <CrmSiblingsChecklistTab siblings={formData.siblings} checklist={formData.checklist} onChange={handleChange} />}
      {activeTab === 'documents' && <CrmDocumentsTab documents={formData.documents} onChange={handleChange} />}
      {activeTab === 'follow_ups' && <CrmFormFollowUpsTab followUps={formData.follow_ups} onChange={handleChange} />}
    </div>
  );
}
