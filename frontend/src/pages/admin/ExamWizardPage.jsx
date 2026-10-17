import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { usePersistentFormDraft } from '../../hooks/usePersistentFormDraft';
import axios from '../../utils/axiosConfig';
import WizardHeaderBar from '../../components/admin/exams/wizard/WizardHeaderBar';
import WizardProgressBar from '../../components/admin/exams/wizard/WizardProgressBar';
import WizardStep1BasicInfo from '../../components/admin/exams/wizard/WizardStep1BasicInfo';
import WizardStep2Classes from '../../components/admin/exams/wizard/WizardStep2Classes';
import WizardStep3Papers from '../../components/admin/exams/wizard/WizardStep3Papers';
import WizardStep4Review from '../../components/admin/exams/wizard/WizardStep4Review';
import WizardPrerequisiteCard from '../../components/admin/exams/wizard/WizardPrerequisiteCard';

const INITIAL_FORM = {
  title: '', term_type: 'Mid-Term',
  academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  start_date: '', end_date: '', passing_threshold_percentage: 33,
  campus_id: '', grading_policy_id: '', description: '', status: 'Draft',
  target_classes: [], papers: []
};

export default function ExamWizardPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData, clearDraft, draftSavedAt] = usePersistentFormDraft(`exam_wizard_draft_${user?.school_id || 'default'}`, INITIAL_FORM);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prereqLoading, setPrereqLoading] = useState(false);
  const [prereqs, setPrereqs] = useState({ counts: {}, lists: {} });

  const fetchPrerequisites = async () => {
    try {
      setPrereqLoading(true);
      const res = await axios.get('/api/exams/prerequisites');
      if (res.data?.success) setPrereqs(res.data);
    } catch {
      showNotification('Failed to load prerequisites', 'error');
    } finally {
      setPrereqLoading(false);
    }
  };

  useEffect(() => {
    fetchPrerequisites();
    if (isEdit) {
      axios.get(`/api/exams/${id}`).then((res) => {
        if (res.data?.exam) setFormData(res.data.exam);
      }).catch(() => showNotification('Failed to load exam', 'error'));
    }
  }, [id]);

  const validateStep = () => {
    if (currentStep === 1 && (!formData.title?.trim() || !formData.start_date || !formData.end_date)) {
      showNotification('Fill in title and date boundaries', 'warning');
      return false;
    }
    if (currentStep === 2 && (!formData.target_classes?.length)) {
      showNotification('Select at least one target class', 'warning');
      return false;
    }
    if (currentStep === 3 && (!formData.papers?.length)) {
      showNotification('Add at least one exam paper in schedule', 'warning');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if (isEdit) await axios.put(`/api/exams/${id}`, formData);
      else await axios.post('/api/exams', formData);
      showNotification(isEdit ? 'Exam updated!' : 'Exam created and published!', 'success');
      clearDraft();
      navigate('/admin/exam-management/exams');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to save exam', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <WizardHeaderBar isEdit={isEdit} />
      <WizardProgressBar currentStep={currentStep} setCurrentStep={(s) => s < currentStep ? setCurrentStep(s) : validateStep() && setCurrentStep(s)} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-5">
          {currentStep === 1 && <WizardStep1BasicInfo formData={formData} setFormData={setFormData} campuses={prereqs.lists?.campuses} policies={prereqs.lists?.grading_policies} />}
          {currentStep === 2 && <WizardStep2Classes formData={formData} setFormData={setFormData} grades={prereqs.lists?.grades} />}
          {currentStep === 3 && <WizardStep3Papers formData={formData} setFormData={setFormData} subjects={prereqs.lists?.subjects} teachers={prereqs.lists?.teachers} />}
          {currentStep === 4 && <WizardStep4Review formData={formData} setFormData={setFormData} onSubmit={handleSubmit} isSubmitting={isSubmitting} isEdit={isEdit} />}
          <div className="flex items-center justify-between pt-4 border-t border-line dark:border-line-dark">
            <button type="button" disabled={currentStep === 1} onClick={() => setCurrentStep((s) => Math.max(1, s - 1))} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-line dark:border-line-dark text-text-muted hover:text-text-primary disabled:opacity-30">
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            {currentStep < 4 && (
              <button type="button" onClick={() => validateStep() && setCurrentStep((s) => s + 1)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-primary text-white hover:bg-primary/90 shadow-xs">
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="lg:col-span-4">
          <WizardPrerequisiteCard prerequisites={prereqs} isLoading={prereqLoading} onRefresh={fetchPrerequisites} onResetDraft={() => { clearDraft(); setFormData(INITIAL_FORM); }} draftSavedAt={draftSavedAt} />
        </div>
      </div>
    </div>
  );
}
