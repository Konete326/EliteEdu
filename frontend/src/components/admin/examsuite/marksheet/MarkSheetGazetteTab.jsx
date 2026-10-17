import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import api from '../../../../services/api';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const MarkSheetGazetteTab = ({ grades }) => {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gazette, setGazette] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (grades?.length > 0 && !selectedGrade) setSelectedGrade(grades[0]._id);
  }, [grades]);

  useEffect(() => {
    if (!selectedGrade) return;
    setLoading(true);
    api.get(`/exam-suite/mark-sheets/class-results?grade_id=${selectedGrade}`).then(res => {
      setGazette(res.data.gazette || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [selectedGrade]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Select Class:</label>
          <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            {grades.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
          </select>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover">
          <Printer size={14} /> Print Result Gazette
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Compiling class gazette...</div>
      ) : gazette.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          No finalized results found for this class. Enter and submit marks to view gazette.
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Obtained / Max</th>
                  <th className="p-3">%</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Teacher Remark</th>
                  <th className="p-3">Principal Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {gazette.map((st, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-3 font-bold text-slate-800 dark:text-white">#{st.rank}</td>
                    <td className="p-3 font-mono text-slate-500">{st.roll_number}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">{st.name}</td>
                    <td className="p-3 font-semibold">{st.total_obtained} / {st.total_max}</td>
                    <td className="p-3 font-bold text-primary">{st.percentage}%</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary text-white">{st.overall_grade}</span>
                    </td>
                    <td className="p-3 text-[11px] text-slate-500 italic max-w-xs truncate">{st.teacher_remark}</td>
                    <td className="p-3 text-[11px] text-slate-500 italic max-w-xs truncate">{st.principal_remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pt-4">
            <OfficialSignatureStampBlock
              signatureTitle="Controller of Examinations"
              stampTitle="Institutional Gazette Seal"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MarkSheetGazetteTab;
