import React from 'react';
import { CheckCircle2, Calendar, BookOpen, Award, Users, AlertTriangle } from 'lucide-react';

export default function WizardStep4Review({ formData, setFormData, onSubmit, isSubmitting, isEdit }) {
  const papers = formData.papers || [];
  const targetClasses = formData.target_classes || [];
  const assignedTeachersCount = new Set(papers.map((p) => p.examiner_id).filter(Boolean)).size;

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-line dark:border-line-dark">
        <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">Final Review & Publication</h3>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">Verify all exam parameters before finalizing</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
          <span className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block">Exam Title</span>
          <span className="text-sm font-bold text-text-primary dark:text-text-primary-dark truncate block mt-0.5">{formData.title || 'Untitled'}</span>
        </div>
        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
          <span className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block">Term & Year</span>
          <span className="text-sm font-bold text-text-primary dark:text-text-primary-dark block mt-0.5">{formData.term_type} ({formData.academic_year})</span>
        </div>
        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
          <span className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block">Classes Included</span>
          <span className="text-sm font-bold text-text-primary dark:text-text-primary-dark block mt-0.5">{targetClasses.length} Grade(s)</span>
        </div>
        <div className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
          <span className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block">Total Papers</span>
          <span className="text-sm font-bold text-primary block mt-0.5">{papers.length} Papers</span>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-text-primary dark:text-text-primary-dark">Publication Status</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setFormData((prev) => ({ ...prev, status: 'Draft' }))} className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${formData.status === 'Draft' ? 'bg-amber-500 text-white border-amber-500' : 'border-line dark:border-line-dark text-text-muted'}`}>
              Draft
            </button>
            <button type="button" onClick={() => setFormData((prev) => ({ ...prev, status: 'Published' }))} className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors ${formData.status === 'Published' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-line dark:border-line-dark text-text-muted'}`}>
              Published
            </button>
          </div>
        </div>
        <p className="text-xs text-text-muted dark:text-text-muted-dark">
          {formData.status === 'Published' ? 'Publishing makes this exam live for teachers and generates automated portal notifications for all assigned paper examiners.' : 'Draft state saves progress privately without notifying teachers.'}
        </p>
      </div>

      <div className="p-4 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark space-y-2">
        <span className="text-xs font-bold text-text-primary dark:text-text-primary-dark">Target Classes Breakdown</span>
        <div className="flex flex-wrap gap-1.5">
          {targetClasses.map((t) => (
            <span key={t.grade_id} className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/30 border border-line dark:border-line-dark text-text-primary dark:text-text-primary-dark">
              {t.grade_name} (Sec {(t.sections || []).join(', ')})
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-text-muted dark:text-text-muted-dark flex items-center gap-1.5">
          <Users className="w-4 h-4 text-primary" /> {assignedTeachersCount} Assigned Examiner(s)
        </div>
        <button type="button" disabled={isSubmitting} onClick={onSubmit} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
          <CheckCircle2 className="w-4 h-4" />
          {isSubmitting ? 'Saving Exam...' : isEdit ? 'Update Exam' : 'Save & Publish Exam'}
        </button>
      </div>
    </div>
  );
}
