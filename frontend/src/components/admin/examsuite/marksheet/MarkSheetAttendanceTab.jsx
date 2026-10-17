import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const MarkSheetAttendanceTab = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/exam-suite/mark-sheets/attendance').then(res => {
      setSummary(res.data.summary || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-20 text-center text-xs text-slate-400">Loading attendance data...</div>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-5 py-3.5">Class</th>
              <th className="px-5 py-3.5">Subject</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Enrolled</th>
              <th className="px-5 py-3.5">Present</th>
              <th className="px-5 py-3.5">Absent</th>
              <th className="px-5 py-3.5 text-right">Attendance Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {summary.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">{row.class_name}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">{row.subject_name}</td>
                <td className="px-5 py-3.5 text-slate-500">{row.category}</td>
                <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-white">{row.total_enrolled}</td>
                <td className="px-5 py-3.5 text-emerald-600 font-bold">{row.present_count}</td>
                <td className="px-5 py-3.5 text-red-500 font-bold">{row.absent_count}</td>
                <td className="px-5 py-3.5 text-right font-bold text-slate-800 dark:text-white">{row.attendance_rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkSheetAttendanceTab;
