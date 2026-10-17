import React from 'react';
import { Award, BookOpen, Clock, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export default function TeacherAssignedExamsBanner({ exams = [], currentUserId, onOpenMarksModal }) {
  const assignedDuties = [];
  exams.forEach((exam) => {
    (exam.papers || []).forEach((paper) => {
      if (String(paper.examiner_id) === String(currentUserId)) {
        assignedDuties.push({ exam, paper });
      }
    });
  });

  if (assignedDuties.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 dark:bg-primary/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
            Your Assigned Exam & Invigilation Duties ({assignedDuties.length})
          </h3>
        </div>
        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          Teacher Portal
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {assignedDuties.map(({ exam, paper }, idx) => (
          <div key={idx} className="p-3 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-text-primary dark:text-text-primary-dark truncate">{paper.subject_name}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${paper.marks_submitted ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {paper.marks_submitted ? 'Marked' : 'Pending Marks'}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-text-muted dark:text-text-muted-dark mt-0.5">
                {paper.grade_name || 'Class'} (Sec {paper.section}) • {exam.title}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-text-muted dark:text-text-muted-dark mt-1.5">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {paper.exam_date ? paper.exam_date.substring(0, 10) : 'TBD'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {paper.start_time || '09:00'}</span>
              </div>
            </div>

            <button type="button" onClick={() => onOpenMarksModal(exam, paper)} className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-2xs">
              <span>Enter Marks / Sheet</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
