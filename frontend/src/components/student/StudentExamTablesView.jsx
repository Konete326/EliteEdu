import React from 'react';
import { Award, FileSpreadsheet } from 'lucide-react';

const StudentExamTablesView = ({ studentId, markSheets = [], classTests = [], attendance = {} }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Days</span>
          <h4 className="text-base font-bold text-gray-800 dark:text-gray-100">{attendance.totalDays || 0}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <span className="text-[10px] text-emerald-600 uppercase font-semibold">Present</span>
          <h4 className="text-base font-bold text-emerald-600">{attendance.present || 0}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <span className="text-[10px] text-rose-600 uppercase font-semibold">Absent</span>
          <h4 className="text-base font-bold text-rose-600">{attendance.absent || 0}</h4>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 text-center">
          <span className="text-[10px] text-amber-600 uppercase font-semibold">Leave</span>
          <h4 className="text-base font-bold text-amber-600">{attendance.leave || 0}</h4>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-purple-600" /> Published Term Examination Results
        </h4>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 border-b">
              <tr>
                <th className="p-3">Examination</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Marks Obtained</th>
                <th className="p-3">Max Marks</th>
                <th className="p-3">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {markSheets.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-400">No term exam mark sheets published yet.</td></tr>
              ) : (
                markSheets.map((ms) => {
                  const rec = (ms.records || []).find((r) => String(r.student_id) === String(studentId)) || {};
                  const pct = ms.max_marks ? Math.round(((rec.obtained_marks || 0) / ms.max_marks) * 100) : 0;
                  return (
                    <tr key={ms._id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">{ms.exam_id?.name || 'Exam'}</td>
                      <td className="p-3 font-medium text-blue-600">{ms.subject_id?.name || 'Subject'}</td>
                      <td className="p-3 font-bold">{rec.obtained_marks || 0}</td>
                      <td className="p-3 text-gray-400">{ms.max_marks || 100}</td>
                      <td className="p-3 font-bold text-purple-600">{pct}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Class Tests Performance
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {classTests.length === 0 ? (
            <div className="col-span-2 p-6 text-center text-xs text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed">
              No class test scores published yet.
            </div>
          ) : (
            classTests.map((ct) => {
              const sc = (ct.scores || []).find((s) => String(s.student_id) === String(studentId)) || {};
              return (
                <div key={ct._id} className="bg-white dark:bg-gray-800 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600">{ct.subject_id?.name}</span>
                    <h5 className="font-bold text-xs text-gray-800 dark:text-gray-200">{ct.test_name || 'Class Test'}</h5>
                    <span className="text-[10px] text-gray-400">{new Date(ct.test_date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-gray-900 dark:text-gray-100">{sc.obtained_marks || 0} / {ct.total_marks || 20}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExamTablesView;
