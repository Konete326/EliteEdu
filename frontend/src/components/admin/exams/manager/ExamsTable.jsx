import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileSpreadsheet, Printer, Edit3, Trash2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function ExamsTable({ exams = [], page = 1, totalPages = 1, onPageChange, onOpenMarksModal, onOpenPrintModal, onDelete, canEdit = true, canDelete = true }) {
  if (exams.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
        <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-2" />
        <h4 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">No Examinations Found</h4>
        <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">Create an exam using the Exam Setup Wizard.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted dark:text-text-muted-dark uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Exam & Term</th>
              <th className="py-3 px-4">Target Classes</th>
              <th className="py-3 px-4">Date Range</th>
              <th className="py-3 px-4">Papers</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {exams.map((exam) => (
              <tr key={exam._id} className="hover:bg-hover dark:hover:bg-hover-dark/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-text-primary dark:text-text-primary-dark text-sm">{exam.title}</div>
                  <div className="text-[11px] text-text-muted dark:text-text-muted-dark">{exam.term_type} • {exam.academic_year} {exam.campus_id ? `(${exam.campus_id.name})` : ''}</div>
                </td>
                <td className="py-3.5 px-4 font-medium text-text-primary dark:text-text-primary-dark">
                  {exam.target_classes?.length || 0} Grade(s)
                </td>
                <td className="py-3.5 px-4 text-text-muted dark:text-text-muted-dark font-medium">
                  {exam.start_date ? new Date(exam.start_date).toLocaleDateString() : 'TBD'} - {exam.end_date ? new Date(exam.end_date).toLocaleDateString() : 'TBD'}
                </td>
                <td className="py-3.5 px-4 font-bold text-primary">
                  {exam.papers?.length || 0} Papers
                </td>
                <td className="py-3.5 px-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${exam.status === 'Published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    {exam.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onOpenMarksModal(exam)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-primary" title="Enter Marks / Sheet">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => onOpenPrintModal(exam)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-primary dark:text-text-primary-dark" title="Print Sheets / Gazette">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    {canEdit && (
                      <Link to={`/admin/exam-management/exams/${exam._id}/edit`} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary" title="Edit Exam">
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {canDelete && onDelete && (
                      <button type="button" onClick={() => onDelete(exam)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500" title="Delete Exam">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-line dark:border-line-dark flex items-center justify-between text-xs text-text-muted dark:text-text-muted-dark">
        <span>Page {page} of {totalPages}</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="p-1 rounded-lg border border-line dark:border-line-dark disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="p-1 rounded-lg border border-line dark:border-line-dark disabled:opacity-30">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
