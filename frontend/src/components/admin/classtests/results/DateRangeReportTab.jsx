import React from 'react';
import { Calendar, FileSpreadsheet, ArrowRight } from 'lucide-react';

export default function DateRangeReportTab({ grades = [], selectedGrade, setSelectedGrade, fromDate, setFromDate, toDate, setToDate, data, isLoading, onDrilldownTest }) {
  const tests = data?.tests || [];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">FROM DATE *</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">TO DATE *</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark" />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">CLASS (OPTIONAL)</label>
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">All Classes</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-xs text-text-muted">Loading tests in range...</div>
        ) : tests.length === 0 ? (
          <div className="p-10 text-center text-xs text-text-muted">No class tests conducted in this date range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Test Title</th>
                  <th className="py-2.5 px-3">Class & Sec</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Teacher</th>
                  <th className="py-2.5 px-3 text-center">Marks</th>
                  <th className="py-2.5 px-3 text-center">Pass Rate</th>
                  <th className="py-2.5 px-3 text-right">View Sheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {tests.map((test) => {
                  const marks = test.marks || [];
                  const present = marks.filter((m) => !m.is_absent);
                  const pass = present.filter((m) => m.pass_status === 'PASS').length;
                  const passRate = present.length > 0 ? Math.round((pass / present.length) * 100) : 0;

                  return (
                    <tr key={test._id} className="hover:bg-hover dark:hover:bg-hover-dark/40 transition-colors">
                      <td className="py-2.5 px-3 text-text-muted">{new Date(test.test_date).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 font-bold text-text-primary dark:text-text-primary-dark">{test.title}</td>
                      <td className="py-2.5 px-3 font-semibold">{test.grade_id?.name || 'Class'} ({test.section})</td>
                      <td className="py-2.5 px-3 font-medium text-text-primary dark:text-text-primary-dark">{test.subject_id?.name || 'Subject'}</td>
                      <td className="py-2.5 px-3 text-text-muted">{test.teacher_id?.name || '-'}</td>
                      <td className="py-2.5 px-3 text-center font-bold">{test.total_marks}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${passRate >= 70 ? 'bg-emerald-500/10 text-emerald-600' : passRate >= 40 ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                          {passRate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button type="button" onClick={() => onDrilldownTest(test)} className="flex items-center gap-1 text-primary hover:underline ml-auto font-bold">
                          <span>Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
