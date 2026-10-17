import React from 'react';
import { Plus, Wand2, Users, FileText } from 'lucide-react';
import WizardPaperRowItem from './WizardPaperRowItem';

export default function WizardStep3Papers({ formData, setFormData, subjects = [], teachers = [] }) {
  const papers = formData.papers || [];
  const targetClasses = formData.target_classes || [];

  const handlePaperChange = (idx, updated) => {
    setFormData((prev) => {
      const copy = [...(prev.papers || [])];
      copy[idx] = updated;
      return { ...prev, papers: copy };
    });
  };

  const removePaper = (idx) => {
    setFormData((prev) => ({ ...prev, papers: (prev.papers || []).filter((_, i) => i !== idx) }));
  };

  const addPaper = () => {
    const firstClass = targetClasses[0];
    const firstSubject = subjects[0];
    const newPaper = {
      subject_id: firstSubject?._id || '',
      subject_name: firstSubject?.name || '',
      grade_id: firstClass?.grade_id || '',
      grade_name: firstClass?.grade_name || '',
      section: firstClass?.sections?.[0] || 'A',
      exam_date: formData.start_date || new Date().toISOString().substring(0, 10),
      start_time: '09:00',
      end_time: '12:00',
      total_marks: 100,
      theory_marks: 75,
      practical_marks: 25,
      passing_marks: 33,
      room_no: 'Hall-1'
    };
    setFormData((prev) => ({ ...prev, papers: [...(prev.papers || []), newPaper] }));
  };

  const autoGeneratePapers = () => {
    const generated = [];
    targetClasses.forEach((t) => {
      (t.sections || ['A']).forEach((sec) => {
        subjects.forEach((subj) => {
          generated.push({
            subject_id: subj._id,
            subject_name: subj.name,
            grade_id: t.grade_id,
            grade_name: t.grade_name,
            section: sec,
            exam_date: formData.start_date || new Date().toISOString().substring(0, 10),
            start_time: '09:00',
            end_time: '12:00',
            total_marks: 100,
            theory_marks: 75,
            practical_marks: 25,
            passing_marks: 33,
            room_no: 'Hall-1'
          });
        });
      });
    });
    setFormData((prev) => ({ ...prev, papers: generated }));
  };

  const autoMatchTeachers = () => {
    setFormData((prev) => ({
      ...prev,
      papers: (prev.papers || []).map((paper) => {
        if (paper.examiner_id) return paper;
        const matched = teachers.find((tc) => {
          const sName = (paper.subject_name || '').toLowerCase();
          const tSpec = (tc.specialization || tc.designation || '').toLowerCase();
          return tSpec.includes(sName) || sName.includes(tSpec);
        });
        return matched ? { ...paper, examiner_id: matched._id, examiner_name: matched.name } : paper;
      })
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">Paper Schedule & Marks Matrix</h3>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">{papers.length} paper(s) configured</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={autoGeneratePapers} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-primary/30 text-primary bg-primary/5 hover:bg-primary/10">
            <Wand2 className="w-3.5 h-3.5" /> Auto-Generate
          </button>
          <button type="button" onClick={autoMatchTeachers} className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark text-text-primary dark:text-text-primary-dark bg-surface dark:bg-surface-dark hover:bg-hover">
            <Users className="w-3.5 h-3.5 text-primary" /> Auto-Match
          </button>
          <button type="button" onClick={addPaper} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90">
            <Plus className="w-3.5 h-3.5" /> Add Paper
          </button>
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
          <FileText className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">No Papers Added</p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">Click "Auto-Generate" or "Add Paper" to build the examination schedule.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
          {papers.map((p, idx) => (
            <WizardPaperRowItem key={idx} index={idx} paper={p} onChange={handlePaperChange} onRemove={removePaper} subjects={subjects} teachers={teachers} targetClasses={targetClasses} />
          ))}
        </div>
      )}
    </div>
  );
}
