import React from 'react';

export default function ClassSubjectReportTab({ grades = [], subjects = [], selectedGrade, setSelectedGrade, selectedSubject, setSelectedSubject, selectedSection, setSelectedSection, data, isLoading }) {
  const tests = data?.tests || [];
  const results = data?.results || [];
  const selectedGradeObj = grades.find((g) => String(g._id) === String(selectedGrade));
  const sections = selectedGradeObj?.sections || ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">SELECT CLASS *</label>
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">Select Class</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">SELECT SUBJECT *</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">Select Subject</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>

        <div className="w-36">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">Section</label>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="All">All Sections</option>
            {sections.map((sec) => <option key={sec} value={sec}>Section {sec}</option>)}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-xs text-text-muted">Loading subject test report...</div>
        ) : !selectedGrade || !selectedSubject ? (
          <div className="p-10 text-center text-xs text-text-muted">Select both Class and Subject to view performance.</div>
        ) : tests.length === 0 ? (
          <div className="p-10 text-center text-xs text-text-muted">No tests recorded for this subject in the selected class.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase">
                <tr>
                  <th className="py-2.5 px-3">Roll / GR</th>
                  <th className="py-2.5 px-3">Student</th>
                  {tests.map((t) => (
                    <th key={t._id} className="py-2.5 px-3 text-center">
                      <div className="font-bold">{t.title}</div>
                      <div className="text-[10px] text-text-muted font-normal">{new Date(t.test_date).toLocaleDateString([], { month: 'short', day: 'numeric' })} (Max {t.total_marks})</div>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center">Average %</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {results.map((r) => (
                  <tr key={r.student_id} className="hover:bg-hover dark:hover:bg-hover-dark/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-text-primary dark:text-text-primary-dark">{r.roll_number || '-'}</td>
                    <td className="py-2.5 px-3 font-semibold text-text-primary dark:text-text-primary-dark">{r.name}</td>
                    {tests.map((t) => {
                      const m = (t.marks || []).find((mk) => String(mk.student_id) === String(r.student_id));
                      const isAbs = m?.is_absent;
                      return (
                        <td key={t._id} className="py-2.5 px-3 text-center font-bold">
                          {m ? (isAbs ? <span className="text-red-500 font-bold">ABS</span> : <span>{m.obtained_marks}</span>) : '-'}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-center font-bold text-primary">{r.percentage}%</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] ${r.grade_letter === 'F' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                        {r.grade_letter}
                      </span>
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
