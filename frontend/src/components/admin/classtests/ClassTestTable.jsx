import React from 'react';
import { Calendar, FileSpreadsheet, Printer, Edit3, Trash2, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function ClassTestTable({ tests = [], page = 1, total = 0, totalPages = 1, onPageChange, onSelectTest, onEditTest, onDeleteTest, onPrintTest }) {
  if (tests.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
        <BookOpen className="w-8 h-8 text-text-muted mx-auto mb-2" />
        <h4 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">No Class Tests Found</h4>
        <p className="text-xs text-text-muted mt-1">Create a test using the form on the left.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase">
            <tr>
              <th className="py-3 px-3.5">Test Title</th>
              <th className="py-3 px-3">Class & Sec</th>
              <th className="py-3 px-3">Subject</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Marks</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {tests.map((test) => (
              <tr key={test._id} className="hover:bg-hover dark:hover:bg-hover-dark/40 transition-colors">
                <td className="py-3 px-3.5">
                  <div className="font-bold text-text-primary dark:text-text-primary-dark">{test.title}</div>
                  {test.topic && <div className="text-[10px] text-text-muted truncate max-w-[180px]">{test.topic}</div>}
                </td>
                <td className="py-3 px-3 font-semibold text-text-primary dark:text-text-primary-dark">
                  {test.grade_id?.name || 'Class'} ({test.section})
                </td>
                <td className="py-3 px-3 font-medium text-text-primary dark:text-text-primary-dark">
                  {test.subject_id?.name || 'Subject'}
                </td>
                <td className="py-3 px-3 text-text-muted">
                  {test.test_date ? new Date(test.test_date).toLocaleDateString() : '-'}
                </td>
                <td className="py-3 px-3 font-bold text-primary">
                  {test.total_marks} <span className="text-[10px] text-text-muted font-normal">(Pass: {test.passing_marks})</span>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${test.status === 'Published' ? 'bg-emerald-500/10 text-emerald-600' : test.status === 'Marks_Entered' ? 'bg-blue-500/10 text-blue-600' : 'bg-amber-500/10 text-amber-600'}`}>
                    {test.status === 'Marks_Entered' ? 'Entered' : test.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onSelectTest(test)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-primary" title="Enter / View Marks Sheet">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => onPrintTest(test)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-primary dark:text-text-primary-dark" title="Print Award List">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => onEditTest(test)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => onDeleteTest(test)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-red-50 text-red-500" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-line dark:border-line-dark flex items-center justify-between text-xs text-text-muted">
        <span>Showing {tests.length} of {total} test(s)</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="p-1 rounded-lg border border-line dark:border-line-dark disabled:opacity-30">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 font-bold text-text-primary dark:text-text-primary-dark">{page} / {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="p-1 rounded-lg border border-line dark:border-line-dark disabled:opacity-30">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
