import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import ReportCardBehaviorBlock from '../ReportCardBehaviorBlock';

const ReportCardStyle5EmeraldElementary = ({
  student = {}, header = {}, examResults = [],
  academicSummary = {}, remarks = {}, behaviorRecord = null, orientation = 'portrait'
}) => {
  return (
    <div className={`w-full bg-white text-slate-900 rounded-xl overflow-hidden border-2 border-[#065f46] shadow-sm select-none ${orientation === 'landscape' ? 'p-3 sm:p-4' : 'p-4 sm:p-6'}`}>
      <div className="bg-[#065f46] text-white p-4 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-full p-1 border border-white/30 flex items-center justify-center">
            <img src={header.logo_url || '/logo.png'} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-serif font-black tracking-wider uppercase">{header.school_name || 'FALCON ELEMENTARY SCHOOL'}</h2>
            <p className="text-[10px] text-emerald-100">{header.address || 'Main Campus Boulevard'}</p>
          </div>
        </div>
        <div className="text-right text-[10px] text-emerald-100 font-mono hidden sm:block">
          <div>Tel: {header.contact_number || '+92 300 1234567'}</div>
        </div>
      </div>

      <div className="text-center space-y-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#065f46] tracking-wide">REPORT CARD</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-y border-emerald-100 py-2">
          <div className="text-left"><span className="text-[10px] text-slate-400 block font-semibold">Student Name:</span><strong>{student.name}</strong></div>
          <div className="text-left"><span className="text-[10px] text-slate-400 block font-semibold">Grade & Section:</span><strong>{student.current_grade?.name || 'Class 4'} ({student.current_section || 'A'})</strong></div>
          <div className="text-left"><span className="text-[10px] text-slate-400 block font-semibold">Teacher:</span><strong>Faculty Review</strong></div>
          <div className="text-left"><span className="text-[10px] text-slate-400 block font-semibold">Date:</span><strong>{new Date().toLocaleDateString()}</strong></div>
        </div>
      </div>

      <div className="border-2 border-[#064e3b] rounded-lg overflow-hidden my-3">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-[#064e3b] text-white font-bold uppercase text-[11px]">
            <tr>
              <th className="p-2 border-r border-emerald-800">SUBJECTS</th>
              <th className="p-2 text-center border-r border-emerald-800">Q1 (Max)</th>
              <th className="p-2 text-center border-r border-emerald-800">Q2 (Marks)</th>
              <th className="p-2 text-center border-r border-emerald-800">Q3 (%)</th>
              <th className="p-2 text-center">Q4 (Grade)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-200">
            {examResults.map((r) => (
              <tr key={r.id} className="hover:bg-emerald-50/40">
                <td className="p-2 font-medium border-r border-emerald-100">{r.subject_name}</td>
                <td className="p-2 text-center border-r border-emerald-100 text-slate-500">{r.max_marks}</td>
                <td className="p-2 text-center border-r border-emerald-100 font-bold text-slate-900">{r.obtained_marks}</td>
                <td className="p-2 text-center border-r border-emerald-100 font-semibold text-emerald-800">{r.percentage}%</td>
                <td className="p-2 text-center font-black text-[#065f46]">{r.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-[#064e3b] p-2.5 rounded-lg bg-emerald-50/50 flex items-center justify-between font-bold text-xs my-3">
        <span className="uppercase text-[#065f46] tracking-wide">FINAL GRADE & PERCENTAGE:</span>
        <span className="text-sm font-black text-[#065f46]">{academicSummary.overallGrade} ({academicSummary.overallPercentage}%) — {academicSummary.resultStatus}</span>
      </div>

      <div className="border-t border-slate-200 pt-2 mb-3">
        <h4 className="text-center font-bold text-[#065f46] text-[10px] uppercase tracking-wider mb-1">GPA GRADE SCALE</h4>
        <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-600 font-mono">
          <span>A+ = 96-100</span><span>A = 91-95</span><span>B+ = 86-90</span><span>B = 81-85</span><span>C = 76-80</span><span>D = 75-70</span><span>F = Below 70</span>
        </div>
      </div>

      {behaviorRecord && <div className="my-2"><ReportCardBehaviorBlock behaviorRecord={behaviorRecord} /></div>}

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="text-[10px] text-slate-500 italic max-w-xs">{remarks.principal || remarks.teacher}</div>
        <OfficialSignatureStampBlock />
        <span className="text-[9px] font-bold text-emerald-700">Powered by EliteEdu</span>
      </div>
    </div>
  );
};

export default ReportCardStyle5EmeraldElementary;
