import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const ReportCardStyle4SkyBlueCrest = ({
  student = {}, header = {}, examResults = [],
  academicSummary = {}, remarks = {}, orientation = 'portrait'
}) => {
  return (
    <div className={`w-full bg-[#7dd3fc]/30 text-slate-900 rounded-2xl overflow-hidden border border-[#38bdf8]/40 shadow-md select-none ${orientation === 'landscape' ? 'p-3 sm:p-4' : 'p-4 sm:p-6'}`}>
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 100 60" className="w-12 h-8 text-amber-400 drop-shadow-xs">
            <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#f43f5e" strokeWidth="8" />
            <path d="M 16,50 A 34,34 0 0,1 84,50" fill="none" stroke="#f59e0b" strokeWidth="8" />
            <path d="M 22,50 A 28,28 0 0,1 78,50" fill="none" stroke="#10b981" strokeWidth="8" />
            <path d="M 28,50 A 22,22 0 0,1 72,50" fill="none" stroke="#0ea5e9" strokeWidth="8" />
          </svg>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-800 drop-shadow-xs">Student Report Card</h1>
            <p className="text-[10px] font-bold text-slate-600">Academic Session: 2026-2027</p>
          </div>
        </div>
        <div className="w-12 h-12 bg-white rounded-full p-1 border-2 border-blue-500 shadow-xs flex items-center justify-center">
          <img src={header.logo_url || '/logo.png'} alt="Crest" className="w-full h-full object-contain" />
        </div>
      </div>

      <div className="bg-[#1d4ed8] text-white text-[10px] font-bold px-4 py-1.5 rounded-full text-center shadow-xs mb-3 truncate">
        {header.school_name || 'ELITE PUBLIC GRAMMAR SCHOOL'} • {header.address || 'Central Academic Boulevard'}
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-blue-100 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-100 pb-3">
          <div className="border-b border-slate-300 pb-0.5"><span className="text-[10px] text-slate-400 block font-semibold">Student Name:</span><strong className="text-slate-800">{student.name}</strong></div>
          <div className="border-b border-slate-300 pb-0.5"><span className="text-[10px] text-slate-400 block font-semibold">Roll No:</span><strong className="text-slate-800">{student.roll_number || student.gr_number || '—'}</strong></div>
          <div className="border-b border-slate-300 pb-0.5"><span className="text-[10px] text-slate-400 block font-semibold">Grade/Class:</span><strong className="text-slate-800">{student.current_grade?.name || 'Class 5'}</strong></div>
          <div className="border-b border-slate-300 pb-0.5"><span className="text-[10px] text-slate-400 block font-semibold">Section:</span><strong className="text-slate-800">{student.current_section || 'A'}</strong></div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-sky-800 mb-1.5 uppercase tracking-wide">Academic Performance</h4>
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#e0f2fe] text-sky-950 font-bold">
              <tr>
                <th className="p-2">Subject</th>
                <th className="p-2 text-center">Marks Obtained</th>
                <th className="p-2 text-center">Total Marks</th>
                <th className="p-2 text-center">Percentage</th>
                <th className="p-2 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {examResults.map((r) => (
                <tr key={r.id} className="hover:bg-sky-50/50">
                  <td className="p-2 font-medium text-slate-800">{r.subject_name}</td>
                  <td className="p-2 text-center font-bold text-sky-900">{r.obtained_marks}</td>
                  <td className="p-2 text-center text-slate-500">{r.max_marks}</td>
                  <td className="p-2 text-center text-slate-700">{r.percentage}%</td>
                  <td className="p-2 text-center font-black text-sky-700">{r.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs bg-sky-50/70 border border-sky-200 text-center font-bold">
            <thead>
              <tr className="bg-sky-100 text-sky-900 text-[10px] uppercase">
                <th className="p-1.5">Total Marks</th><th className="p-1.5">Marks Obtained</th><th className="p-1.5">Overall %</th><th className="p-1.5">Final Grade</th><th className="p-1.5">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-slate-800">
                <td className="p-1.5">{academicSummary.totalMax}</td>
                <td className="p-1.5 text-sky-700">{academicSummary.totalObtained}</td>
                <td className="p-1.5 text-sky-700">{academicSummary.overallPercentage}%</td>
                <td className="p-1.5 text-sky-800">{academicSummary.overallGrade}</td>
                <td className="p-1.5 text-emerald-600">{academicSummary.resultStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-2.5 bg-slate-50 rounded-lg text-[10px] space-y-1">
            <span className="font-bold text-sky-900 block uppercase">Grading Scale:</span>
            <div className="grid grid-cols-2 gap-1 text-slate-600">
              <div>90-100% : A+</div><div>80-89% : A</div><div>70-79% : B</div><div>Below 50% : F</div>
            </div>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1">
            <span className="font-bold text-sky-900 text-[10px] uppercase block">Teacher's Remarks:</span>
            <p className="text-[11px] text-slate-600 italic">{remarks.teacher || 'Showing active progress and good conduct.'}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="border-b border-slate-400 pb-0.5 text-center w-24 text-[10px] text-slate-600">Parent Sign</div>
          <OfficialSignatureStampBlock />
          <span className="text-[9px] font-bold text-sky-600">Powered by EliteEdu</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCardStyle4SkyBlueCrest;
