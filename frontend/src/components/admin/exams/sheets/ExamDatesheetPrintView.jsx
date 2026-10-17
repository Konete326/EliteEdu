import React from 'react';

export default function ExamDatesheetPrintView({ exam, signature, stamp }) {
  const papers = exam?.papers || [];
  const sorted = [...papers].sort((a, b) => new Date(a.exam_date || 0) - new Date(b.exam_date || 0));

  return (
    <div className="bg-white text-black p-6 rounded-xl border border-line text-xs font-sans print:p-0 print:border-0 print:m-0">
      <div className="text-center pb-4 border-b-2 border-black space-y-1">
        <h2 className="text-lg font-black uppercase tracking-wide">{exam.campus_id?.name || 'INSTITUTIONAL EXAMINATION BOARD'}</h2>
        <h3 className="text-sm font-bold text-gray-800">{exam.title} - DATESHEET</h3>
        <p className="text-[11px] text-gray-600">Session: {exam.academic_year} • Term: {exam.term_type}</p>
      </div>

      <div className="mt-4">
        <table className="w-full text-left border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100 border-b border-black font-bold">
              <th className="border border-black p-2">Date & Day</th>
              <th className="border border-black p-2">Timing</th>
              <th className="border border-black p-2">Class / Sec</th>
              <th className="border border-black p-2">Subject Paper</th>
              <th className="border border-black p-2">Room / Hall</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, idx) => (
              <tr key={idx} className="border-b border-black">
                <td className="border border-black p-2 font-semibold">
                  {p.exam_date ? new Date(p.exam_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                </td>
                <td className="border border-black p-2">{p.start_time || '09:00'} - {p.end_time || '12:00'}</td>
                <td className="border border-black p-2 font-bold">{p.grade_name || 'Class'} ({p.section || 'A'})</td>
                <td className="border border-black p-2 font-bold">{p.subject_name}</td>
                <td className="border border-black p-2">{p.room_no || 'Hall-1'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-4 flex items-end justify-between px-4">
        <div className="text-center">
          {stamp?.file_url ? <img src={stamp.file_url} alt="Stamp" className="h-16 w-16 mx-auto object-contain opacity-90" /> : <div className="h-16 w-16 mx-auto border border-dashed border-gray-400 rounded-full flex items-center justify-center text-[10px] text-gray-500 font-bold">OFFICIAL STAMP</div>}
          <span className="text-[10px] font-bold block mt-1 text-gray-700">Official Seal</span>
        </div>
        <div className="text-center">
          {signature?.file_url ? <img src={signature.file_url} alt="Signature" className="h-12 max-w-[120px] mx-auto object-contain" /> : <div className="h-12 border-b border-black w-32 mx-auto"></div>}
          <span className="text-[10px] font-bold block mt-1 text-gray-800">Controller of Examinations</span>
        </div>
      </div>
    </div>
  );
}
