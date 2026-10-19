import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import { renderSvgQrCode } from '../../../../utils/idCardCodeGenerator';

const ReportCardStyle2NavyModernBlocks = ({
  student = {}, header = {}, examResults = [],
  academicSummary = {}, remarks = {}, attendance = {}, orientation = 'portrait'
}) => {
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/student/${student._id || ''}`;

  return (
    <div className={`w-full bg-white text-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-sm select-none ${orientation === 'landscape' ? 'p-4' : 'p-6'}`}>
      <div className="h-2.5 bg-[#1e293b] w-full rounded-t -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 mb-4" />

      <div className="text-center space-y-1 mb-5">
        <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-[#1e293b] uppercase font-sans">REPORT CARD</h1>
        <p className="text-xs sm:text-sm font-bold tracking-widest text-slate-500 uppercase">{header.school_name || 'BEECHTOWN HIGH SCHOOL'}</p>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-5 border-b border-slate-200 pb-3">
        <div className="flex border-b border-slate-300 pb-1"><span className="w-20 text-slate-500 font-semibold">Name:</span><strong className="text-slate-900">{student.name}</strong></div>
        <div className="flex border-b border-slate-300 pb-1"><span className="w-20 text-slate-500 font-semibold">Year:</span><strong className="text-slate-900">2026-2027</strong></div>
        <div className="flex border-b border-slate-300 pb-1"><span className="w-20 text-slate-500 font-semibold">Class:</span><strong className="text-slate-900">{student.current_grade?.name || 'Standard'} ({student.current_section || 'A'})</strong></div>
        <div className="flex border-b border-slate-300 pb-1"><span className="w-20 text-slate-500 font-semibold">Term:</span><strong className="text-slate-900">Annual Evaluation</strong></div>
      </div>

      <div className="space-y-1.5 my-4">
        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-white text-center">
          <div className="col-span-5 bg-[#1e293b] py-2 px-3 rounded-lg text-left uppercase">SUBJECT</div>
          <div className="col-span-3 bg-[#1e293b] py-2 px-3 rounded-lg uppercase">GRADE</div>
          <div className="col-span-4 bg-[#1e293b] py-2 px-3 rounded-lg text-left uppercase">FEEDBACK</div>
        </div>

        {examResults.map((r, i) => (
          <div key={r.id} className="grid grid-cols-12 gap-2 text-xs">
            <div className={`col-span-5 p-2 rounded-lg font-semibold text-slate-800 ${i % 2 === 0 ? 'bg-[#f1f5f9]' : 'bg-slate-50'}`}>
              {r.subject_name}
            </div>
            <div className={`col-span-3 p-2 rounded-lg text-center font-bold ${i % 2 === 0 ? 'bg-[#f1f5f9]' : 'bg-slate-50'}`}>
              <span className="text-slate-900">{r.obtained_marks}/{r.max_marks}</span>
              <span className="ml-2 font-black text-[#1e293b] bg-white px-1.5 py-0.5 rounded border border-slate-200">{r.grade}</span>
            </div>
            <div className={`col-span-4 p-2 rounded-lg text-[11px] text-slate-600 truncate ${i % 2 === 0 ? 'bg-[#f1f5f9]' : 'bg-slate-50'}`}>
              {r.teacher_remarks || 'Consistent performance.'}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
        <div className="space-y-1">
          <h4 className="font-bold text-[#1e293b] uppercase tracking-wider text-[11px]">GRADING SCALE:</h4>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
            <div>A+ = 96-100</div><div>C = 76-80</div>
            <div>A = 91-95</div><div>D = 70-75</div>
            <div>B+ = 86-90</div><div>FAIL = Below 70</div>
            <div>B = 81-85</div><div>GPA: {academicSummary.overallGrade}</div>
          </div>
        </div>

        <div className="space-y-1 sm:text-right">
          <h4 className="font-bold text-[#1e293b] uppercase tracking-wider text-[11px]">TOTAL DAYS OF SCHOOL:</h4>
          <div className="text-[11px] text-slate-700 space-y-0.5">
            <div>Days Attended: <strong className="text-emerald-700">{attendance.presentDays || 0}</strong> / {attendance.totalDays || 0}</div>
            <div>Days Absent: <strong className="text-rose-700">{attendance.absentDays || 0}</strong></div>
            <div>Attendance Rate: <strong className="text-[#1e293b]">{attendance.attendancePercentage || 100}%</strong></div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white p-0.5 border border-slate-300 rounded">{renderSvgQrCode(verifyUrl, 28)}</div>
          <span className="text-[9px] font-mono text-slate-400">Verifiable Student Record</span>
        </div>
        <OfficialSignatureStampBlock />
        <span className="text-[9px] font-bold text-slate-400">Powered by EliteEdu</span>
      </div>

      <div className="h-2.5 bg-[#1e293b] w-full rounded-b -mb-4 sm:-mb-6 -mx-4 sm:-mx-6 mt-4" />
    </div>
  );
};

export default ReportCardStyle2NavyModernBlocks;
