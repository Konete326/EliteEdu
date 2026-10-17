import React from 'react';
import { User, Award, Printer } from 'lucide-react';

export default function StudentSubjectReportTab({ grades = [], subjects = [], students = [], selectedGrade, setSelectedGrade, selectedStudent, setSelectedStudent, selectedSubject, setSelectedSubject, data, isLoading, onPrintStudentReport }) {
  const student = data?.student;
  const tests = data?.tests || [];
  const appeared = tests.filter((t) => t.pass_status !== 'ABSENT');
  const totalMax = appeared.reduce((acc, t) => acc + (t.total_marks || 25), 0);
  const totalObtained = appeared.reduce((acc, t) => acc + (t.obtained_marks || 0), 0);
  const avgPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
  const overallGrade = avgPct >= 80 ? 'A+' : avgPct >= 70 ? 'A' : avgPct >= 60 ? 'B+' : avgPct >= 50 ? 'B' : avgPct >= 40 ? 'C' : avgPct >= 33 ? 'D' : 'F';

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">SELECT CLASS *</label>
          <select value={selectedGrade} onChange={(e) => { setSelectedGrade(e.target.value); setSelectedStudent(''); }} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">Select Class</option>
            {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">SELECT STUDENT *</label>
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={!selectedGrade} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark disabled:opacity-40">
            <option value="">Select Student</option>
            {students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.roll_number ? `Roll: ${s.roll_number}` : `GR: ${s.gr_number}`})</option>)}
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-[11px] font-bold text-text-muted uppercase mb-1">SUBJECT (OPTIONAL)</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
            <option value="">All Subjects</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="p-10 text-center text-xs text-text-muted">Loading student test report card...</div>
      ) : !selectedStudent ? (
        <div className="p-10 text-center text-xs text-text-muted">Select a class and student to generate report card.</div>
      ) : !student ? (
        <div className="p-10 text-center text-xs text-text-muted">No student data found.</div>
      ) : (
        <div className="p-6 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-line dark:border-line-dark">
            <div className="flex items-center gap-3">
              {student.photo_url ? <img src={student.photo_url} alt="" className="w-12 h-12 rounded-xl object-cover" /> : <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold"><User className="w-6 h-6" /></div>}
              <div>
                <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">{student.name}</h3>
                <p className="text-xs text-text-muted">Father: {student.father_name || '-'} • GR: {student.gr_number} • Roll: {student.roll_number || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-text-muted block">Overall Average</span>
                <span className="text-lg font-black text-primary">{avgPct}% ({overallGrade})</span>
              </div>
              <button type="button" onClick={() => onPrintStudentReport({ student, tests, avgPct, overallGrade })} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-primary text-white shadow-2xs">
                <Printer className="w-3.5 h-3.5" /> Print Report Card
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 border-b border-line dark:border-line-dark text-[11px] font-bold text-text-muted uppercase">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Test Title</th>
                  <th className="py-2.5 px-3 text-center">Marks</th>
                  <th className="py-2.5 px-3 text-center">%</th>
                  <th className="py-2.5 px-3 text-center">Grade</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line dark:divide-line-dark">
                {tests.map((t, idx) => (
                  <tr key={idx} className="hover:bg-hover dark:hover:bg-hover-dark/40 transition-colors">
                    <td className="py-2.5 px-3 text-text-muted">{new Date(t.test_date).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 font-bold text-text-primary dark:text-text-primary-dark">{t.subject_name}</td>
                    <td className="py-2.5 px-3 font-semibold">{t.title}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{t.pass_status === 'ABSENT' ? 'ABS' : `${t.obtained_marks} / ${t.total_marks}`}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-primary">{t.pass_status === 'ABSENT' ? '0%' : `${t.percentage}%`}</td>
                    <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded font-black text-[10px] ${t.grade_letter === 'F' ? 'bg-red-500/10 text-red-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{t.grade_letter}</span></td>
                    <td className="py-2.5 px-3 text-center"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.pass_status === 'PASS' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>{t.pass_status}</span></td>
                    <td className="py-2.5 px-3 text-text-muted">{t.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
