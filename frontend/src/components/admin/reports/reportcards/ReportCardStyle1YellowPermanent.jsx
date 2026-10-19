import React from 'react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';
import ReportCardBehaviorBlock from '../ReportCardBehaviorBlock';
import { renderSvgQrCode } from '../../../../utils/idCardCodeGenerator';

const ReportCardStyle1YellowPermanent = ({
  student = {}, header = {}, examResults = [], testResults = [],
  academicSummary = {}, remarks = {}, attendance = {}, behaviorRecord = null, orientation = 'portrait'
}) => {
  const isMale = (student.gender || '').toLowerCase() === 'female' ? false : true;
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/student/${student._id || ''}`;

  return (
    <div className={`w-full bg-white text-slate-900 rounded-xl overflow-hidden border border-slate-200 shadow-sm print:border-none print:shadow-none select-none ${orientation === 'landscape' ? 'p-4' : 'p-6'}`}>
      <div className="bg-[#facc15] text-slate-950 p-4 sm:p-5 rounded-lg text-center shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-sans">Permanent Record</h1>
        <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mt-0.5 opacity-90">
          INTERMEDIATE GRADE • {header.school_name || 'ACADEMIC GRADE TRANSCRIPT'}
        </p>
      </div>

      <div className="flex items-center gap-4 my-4 p-3 bg-slate-50 rounded-lg border border-slate-200/60">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-200 shrink-0 border-2 border-amber-400">
          <img src={student.photo_url || student.avatar_url || '/logo.png'} alt="Student" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white p-2 rounded border border-slate-200"><span className="text-[10px] text-slate-400 block font-bold">Student Name</span><strong className="text-slate-800 truncate block">{student.name}</strong></div>
          <div className="bg-white p-2 rounded border border-slate-200"><span className="text-[10px] text-slate-400 block font-bold">GR / Roll No</span><strong className="text-slate-800">{student.gr_number || student.roll_number || '—'}</strong></div>
          <div className="bg-white p-2 rounded border border-slate-200"><span className="text-[10px] text-slate-400 block font-bold">Date of birth</span><strong className="text-slate-800">{student.dob ? new Date(student.dob).toLocaleDateString() : '—'}</strong></div>
          <div className="bg-white p-2 rounded border border-slate-200 flex items-center justify-around font-bold text-[11px]"><span className={isMale ? 'text-amber-600' : 'text-slate-400'}>Male: {isMale ? 'X' : ''}</span><span className={!isMale ? 'text-amber-600' : 'text-slate-400'}>Female: {!isMale ? 'X' : ''}</span></div>
        </div>
      </div>

      <div className="overflow-x-auto my-3">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#f3f4f6] text-slate-700 font-bold border-b border-amber-200">
            <tr>
              <th className="p-2 sm:p-2.5">Academic Record</th>
              <th className="p-2 sm:p-2.5 text-center">Max Marks</th>
              <th className="p-2 sm:p-2.5 text-center">Obtained</th>
              <th className="p-2 sm:p-2.5 text-center">Class Tests</th>
              <th className="p-2 sm:p-2.5 text-center">Percentage</th>
              <th className="p-2 sm:p-2.5 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fef08a]/60">
            {examResults.map((r) => {
              const test = testResults.find((t) => t.subject_name === r.subject_name);
              return (
                <tr key={r.id} className="hover:bg-amber-50/20">
                  <td className="p-2 font-semibold text-slate-800">{r.subject_name}</td>
                  <td className="p-2 text-center text-slate-500">{r.max_marks}</td>
                  <td className="p-2 text-center font-bold text-slate-900">{r.is_absent ? 'ABS' : r.obtained_marks}</td>
                  <td className="p-2 text-center text-slate-600">{test ? `${test.obtained_marks}/${test.total_marks}` : '—'}</td>
                  <td className="p-2 text-center font-bold text-amber-700">{r.percentage}%</td>
                  <td className="p-2 text-center font-black"><span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">{r.grade}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-600 text-center font-semibold mb-3">
        Intermediate Achievement: A=Excelent | B=Above Average | C=Average | D=Below Average | U=Unsatisfactory
      </div>

      {behaviorRecord && <div className="my-2"><ReportCardBehaviorBlock behaviorRecord={behaviorRecord} /></div>}

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white p-0.5 border border-slate-200 rounded">{renderSvgQrCode(verifyUrl, 28)}</div>
          <div className="text-[9px] font-mono text-slate-400"><span>Verify Ledger</span><span className="block font-bold text-slate-600">{academicSummary.overallGrade} ({academicSummary.overallPercentage}%)</span></div>
        </div>
        <OfficialSignatureStampBlock />
        <span className="text-[9px] font-bold text-slate-400 font-sans">Powered by EliteEdu</span>
      </div>
    </div>
  );
};

export default ReportCardStyle1YellowPermanent;
