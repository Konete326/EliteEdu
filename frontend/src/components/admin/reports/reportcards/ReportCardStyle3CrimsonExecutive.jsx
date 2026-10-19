import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const ReportCardStyle3CrimsonExecutive = ({
  student = {}, header = {}, examResults = [], testResults = [],
  academicSummary = {}, remarks = {}, attendance = {}, orientation = 'portrait'
}) => {
  return (
    <div className={`w-full bg-white text-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-sm select-none ${orientation === 'landscape' ? 'p-4' : 'p-6'}`}>
      <div className="flex flex-col sm:flex-row -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 mb-5 overflow-hidden">
        <div className="bg-[#7f1d1d] text-white p-4 sm:p-5 sm:w-2/3 flex items-center">
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide">High School Report Card</h1>
        </div>
        <div className="bg-[#2c3e50] text-white p-4 sm:p-5 sm:w-1/3 flex items-center gap-2 justify-end">
          <div className="text-right">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider">{header.school_name || 'ALEXANDER HIGH SCHOOL'}</h2>
            <p className="text-[10px] text-slate-300 font-sans">{header.campus_name || 'Main Campus'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <h3 className="font-serif font-bold text-slate-800 text-xs sm:text-sm">Student Information:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2 border border-slate-300 rounded"><span className="text-[10px] text-slate-400 block font-semibold">Name:</span><strong>{student.name}</strong></div>
          <div className="p-2 border border-slate-300 rounded"><span className="text-[10px] text-slate-400 block font-semibold">Grade:</span><strong>{student.current_grade?.name || 'Grade 10'}</strong></div>
          <div className="p-2 border border-slate-300 rounded"><span className="text-[10px] text-slate-400 block font-semibold">School Year:</span><strong>2026-2027</strong></div>
        </div>
      </div>

      <div className="overflow-x-auto my-3">
        <table className="w-full text-xs border border-slate-300 border-collapse">
          <thead className="bg-[#7f1d1d] text-white font-semibold">
            <tr>
              <th className="p-2 text-left border-r border-red-900">Subject</th>
              <th className="p-2 text-center border-r border-red-900">Term Exam</th>
              <th className="p-2 text-center border-r border-red-900">Class Tests</th>
              <th className="p-2 text-center">Final Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {examResults.map((r) => {
              const ct = testResults.find((t) => t.subject_name === r.subject_name);
              return (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-2 font-medium border-r border-slate-200">{r.subject_name}</td>
                  <td className="p-2 text-center border-r border-slate-200">{r.obtained_marks}/{r.max_marks} ({r.percentage}%)</td>
                  <td className="p-2 text-center border-r border-slate-200">{ct ? `${ct.obtained_marks}/${ct.total_marks}` : '—'}</td>
                  <td className="p-2 text-center font-bold text-[#7f1d1d]">{r.grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3 text-xs">
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 font-serif">Grading Scale:</h4>
          <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc pl-4 font-mono">
            <li>A: 90-100% (Distinction)</li>
            <li>B: 80-89% (Above Average)</li>
            <li>C: 70-79% (Average)</li>
            <li>D: 60-69% (Pass) | F: Below 60%</li>
          </ul>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-800 font-serif">Attendance:</h4>
          <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc pl-4">
            <li>Days Present: <strong>{attendance.presentDays || 0}</strong></li>
            <li>Days Absent: <strong>{attendance.absentDays || 0}</strong></li>
            <li>Approved Leaves: <strong>{attendance.leaveDays || 0}</strong></li>
          </ul>
        </div>
      </div>

      <div className="my-3 p-3 border border-slate-300 rounded space-y-1 text-xs">
        <h4 className="font-serif font-bold text-slate-800">Comments:</h4>
        <p className="text-[11px] text-slate-600 italic leading-relaxed">
          {student.name} has demonstrated steady academic commitment with an overall score of {academicSummary.overallPercentage}% ({academicSummary.overallGrade}). {remarks.principal || remarks.teacher}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-200">
        <div><div className="border-b border-slate-400 pb-1 font-serif italic text-slate-700">Guardian Verified</div><span className="text-[10px] text-slate-500 uppercase font-semibold">Parent's Signature</span></div>
        <div><div className="border-b border-slate-400 pb-1 font-serif italic text-slate-700">Faculty Review</div><span className="text-[10px] text-slate-500 uppercase font-semibold">Teacher Signature</span></div>
        <div className="flex flex-col items-center"><OfficialSignatureStampBlock /><span className="text-[10px] text-slate-500 uppercase font-semibold">Principal Signature</span></div>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[9px] text-slate-400 gap-2">
        <span className="flex items-center gap-1"><MapPin size={10} /> {header.address || '108 N Platinum Ave'}</span>
        <span className="flex items-center gap-1"><Phone size={10} /> {header.contact_number || '+92 300 0000000'}</span>
        <span className="flex items-center gap-1"><Mail size={10} /> {header.email || 'info@eliteedu.com'}</span>
      </div>
    </div>
  );
};

export default ReportCardStyle3CrimsonExecutive;
