import React from 'react';
import { Award, CheckCircle2, AlertTriangle, BookOpen, Printer } from 'lucide-react';

export default function ClassWiseReportTab({ grades = [], selectedGrade, setSelectedGrade, selectedSection, setSelectedSection, data, isLoading, onPrintSlip }) {
  const results = data?.results || [];
  const selectedGradeObj = grades.find((g) => String(g._id) === String(selectedGrade));
  const sections = selectedGradeObj?.sections || ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">SELECT CLASS *</label>
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">Select Class</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>

        <div className="w-40">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Section</label>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="All">All Sections</option>
            {sections.map((sec) => <option key={sec} value={sec}>Section {sec}</option>)}
          </select>
        </div>
      </div>

      {selectedGrade && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-text-muted block">Total Tests</span>
              <span className="text-lg font-black text-text-primary dark:text-text-primary-dark mt-0.5 block">{data?.total_tests || 0}</span>
            </div>
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-text-muted block">Class Average</span>
              <span className="text-lg font-black text-primary mt-0.5 block">{data?.class_average || 0}%</span>
            </div>
            <Award className="w-5 h-5 text-blue-500" />
          </div>
          <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-text-muted block">Passed Students</span>
              <span className="text-lg font-black text-emerald-600 mt-0.5 block">{data?.passed_students || 0}</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-text-muted block">Below Criteria</span>
              <span className="text-lg font-black text-red-500 mt-0.5 block">{data?.failed_students || 0}</span>
            </div>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-xs text-text-muted">Loading class tests report...</div>
        ) : !selectedGrade ? (
          <div className="p-10 text-center text-xs text-text-muted">Please select a class to view test results.</div>
        ) : results.length === 0 ? (
          <div className="p-10 text-center text-xs text-text-muted">No student tests recorded for this class yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase">
                <tr>
                  <th className="py-2.5 px-3">Roll / GR</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3 text-center">Tests Appeared</th>
                  <th className="py-2.5 px-3 text-center">Marks</th>
                  <th className="py-2.5 px-3 text-center">%</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {results.map((r) => (
                  <tr key={r.student_id} className="hover:bg-hover dark:hover:bg-hover-dark/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-text-primary dark:text-text-primary-dark">
                      {r.roll_number || '-'} <span className="text-[10px] text-text-muted font-normal block">GR: {r.gr_number || '-'}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-text-primary dark:text-text-primary-dark">{r.name}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{r.tests_appeared} / {r.total_tests}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{r.total_obtained} / {r.total_max}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-primary">{r.percentage}%</td>
                    <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded font-black text-[10px] ${r.grade_letter === 'F' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{r.grade_letter}</span></td>
                    <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.pass_status === 'PASS' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>{r.pass_status}</span></td>
                    <td className="py-2.5 px-3 text-right">
                      <button type="button" onClick={() => onPrintSlip(r)} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted hover:text-text-primary" title="Print Result Slip">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
