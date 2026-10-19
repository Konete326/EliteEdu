import React from 'react';
import { GraduationCap } from 'lucide-react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const ReportCardStyle6CreamBehaviorGrid = ({
  student = {}, header = {}, examResults = [], testResults = [],
  academicSummary = {}, remarks = {}, attendance = {}, behaviorRecord = null, orientation = 'portrait'
}) => {
  const aff = behaviorRecord?.affective_ratings || {};
  const psy = behaviorRecord?.psychomotor_ratings || {};

  return (
    <div className={`w-full bg-[#fbf7f0] text-slate-900 rounded-xl overflow-hidden border border-slate-300 shadow-sm select-none ${orientation === 'landscape' ? 'p-3 sm:p-4' : 'p-4 sm:p-6'}`}>
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-900 text-amber-300 rounded-lg"><GraduationCap size={24} /></div>
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">{header.school_name || 'NATIONAL HIGH SCHOOL'}</h2>
            <p className="text-[10px] text-slate-600 font-bold">{student.current_grade?.name || 'Secondary Class'} • Session 2026-2027</p>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-slate-950 font-sans">REPORT CARD</h1>
      </div>

      <div className="border border-slate-400 p-2 rounded bg-white text-[10px] text-slate-700 font-mono mb-3 text-center">
        Legend: O (Outstanding) = 90-100% | VS (Very Satisfactory) = 80-89% | S (Satisfactory) = 60-79% | FS = 33-59% | DNM = Below 33%
      </div>

      <div className="overflow-x-auto mb-3">
        <table className="w-full text-xs border border-slate-400 border-collapse bg-white">
          <thead className="bg-[#111827] text-white font-bold uppercase text-[10px]">
            <tr>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-center">Q1</th>
              <th className="p-2 text-center">Q2</th>
              <th className="p-2 text-center">Q3</th>
              <th className="p-2 text-center">Q4</th>
              <th className="p-2 text-center">Final Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {examResults.map((r) => {
              const ct = testResults.find((t) => t.subject_name === r.subject_name);
              return (
                <tr key={r.id}>
                  <td className="p-2 font-medium border-r border-slate-200">{r.subject_name}</td>
                  <td className="p-2 text-center border-r border-slate-200 text-slate-500">{r.max_marks}</td>
                  <td className="p-2 text-center border-r border-slate-200 font-bold">{r.obtained_marks}</td>
                  <td className="p-2 text-center border-r border-slate-200 text-slate-600">{ct ? ct.obtained_marks : '—'}</td>
                  <td className="p-2 text-center border-r border-slate-200 font-semibold">{r.percentage}%</td>
                  <td className="p-2 text-center font-black text-slate-950">{r.grade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border border-slate-400 rounded bg-white p-3 mb-3">
        <h4 className="text-[11px] font-black uppercase text-slate-900 border-b border-slate-200 pb-1 mb-2">
          Behavior & Skills Evaluation (Affective & Psychomotor Domains)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded"><span className="text-[9px] text-slate-500 block">Punctuality</span><strong>{aff.punctuality ?? 5}/5</strong></div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded"><span className="text-[9px] text-slate-500 block">Discipline</span><strong>{aff.discipline ?? 5}/5</strong></div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded"><span className="text-[9px] text-slate-500 block">Neatness</span><strong>{aff.neatness ?? 5}/5</strong></div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded"><span className="text-[9px] text-slate-500 block">Handwriting</span><strong>{psy.handwriting ?? 5}/5</strong></div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded"><span className="text-[9px] text-slate-500 block">Communication</span><strong>{psy.communication ?? 5}/5</strong></div>
          <div className="p-1.5 bg-slate-50 border border-slate-200 rounded"><span className="text-[9px] text-slate-500 block">Sports & Arts</span><strong>{psy.sports_games ?? 5}/5</strong></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
        <div className="border border-slate-400 rounded bg-white p-2.5 space-y-1">
          <div className="bg-[#111827] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded text-center mb-1.5">Attendance Record</div>
          <div className="flex justify-between border-b border-slate-100 pb-1"><span>Days Present:</span><strong>{attendance.presentDays || 0}</strong></div>
          <div className="flex justify-between border-b border-slate-100 pb-1"><span>Approved Leaves:</span><strong>{attendance.leaveDays || 0}</strong></div>
          <div className="flex justify-between border-b border-slate-100 pb-1"><span>Unexcused Absences:</span><strong>{attendance.absentDays || 0}</strong></div>
          <div className="flex justify-between font-bold text-slate-900 pt-0.5"><span>Total Working Days:</span><span>{attendance.totalDays || 0} ({attendance.attendancePercentage || 100}%)</span></div>
        </div>

        <div className="border border-slate-400 rounded bg-white p-2.5 flex flex-col justify-between">
          <div className="bg-[#111827] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded text-center mb-1.5">Signatures & Approvals</div>
          <p className="text-[11px] text-slate-600 italic">"{remarks.principal || remarks.teacher}"</p>
          <div className="flex justify-end pt-2 border-t border-slate-200"><OfficialSignatureStampBlock /></div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[9px] text-slate-500 font-mono">
        <span>Student ID: {student.gr_number || student._id}</span>
        <span className="font-sans font-bold">Powered by EliteEdu</span>
      </div>
    </div>
  );
};

export default ReportCardStyle6CreamBehaviorGrid;
