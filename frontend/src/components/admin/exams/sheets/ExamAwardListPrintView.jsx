import React from 'react';

export default function ExamAwardListPrintView({ exam, paper, marks = [], signature, stamp }) {
  const paperMarks = marks.filter((m) => String(m.grade_id) === String(paper?.grade_id) && String(m.subject_id) === String(paper?.subject_id) && String(m.section) === String(paper?.section));

  return (
    <div className="bg-white text-black p-6 rounded-xl border border-line text-xs font-sans print:p-0 print:border-0">
      <div className="text-center pb-3 border-b-2 border-black space-y-1">
        <h2 className="text-lg font-black uppercase">{exam.campus_id?.name || 'BOARD OF INTERMEDIATE & SECONDARY EDUCATION'}</h2>
        <h3 className="text-sm font-bold text-gray-800">OFFICIAL MARKS AWARD LIST</h3>
        <p className="text-[11px] text-gray-600">
          Exam: {exam.title} ({exam.term_type}) • Class: {paper?.grade_name || 'Class'} ({paper?.section || 'A'}) • Subject: {paper?.subject_name || 'General'}
        </p>
        <p className="text-[11px] font-semibold text-gray-700">
          Max Theory: {paper?.theory_marks ?? 75} | Max Practical: {paper?.practical_marks ?? 25} | Total Max: {paper?.total_marks ?? 100}
        </p>
      </div>

      <div className="mt-4">
        <table className="w-full text-left border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100 border-b border-black font-bold">
              <th className="border border-black p-1.5 text-center">Roll</th>
              <th className="border border-black p-1.5">Student Name</th>
              <th className="border border-black p-1.5">Father Name</th>
              <th className="border border-black p-1.5 text-center">Theory</th>
              <th className="border border-black p-1.5 text-center">Practical</th>
              <th className="border border-black p-1.5 text-center">Total</th>
              <th className="border border-black p-1.5 text-center">%</th>
              <th className="border border-black p-1.5 text-center">Grade</th>
              <th className="border border-black p-1.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {paperMarks.length === 0 ? (
              <tr><td colSpan="9" className="text-center p-4 border border-black text-gray-500">No marks entered yet for this paper.</td></tr>
            ) : (
              paperMarks.map((m) => (
                <tr key={m._id} className="border-b border-black">
                  <td className="border border-black p-1.5 text-center font-bold">{m.student_id?.roll_number || m.roll_number || '-'}</td>
                  <td className="border border-black p-1.5 font-bold">{m.student_id?.name || m.name || 'Student'}</td>
                  <td className="border border-black p-1.5">{m.student_id?.father_name || m.father_name || '-'}</td>
                  <td className="border border-black p-1.5 text-center">{m.status === 'ABSENT' ? 'ABS' : m.theory_obtained}</td>
                  <td className="border border-black p-1.5 text-center">{m.status === 'ABSENT' ? 'ABS' : m.practical_obtained}</td>
                  <td className="border border-black p-1.5 text-center font-bold">{m.status === 'ABSENT' ? '0' : m.total_obtained}</td>
                  <td className="border border-black p-1.5 text-center font-bold">{m.status === 'ABSENT' ? '0%' : `${m.percentage}%`}</td>
                  <td className="border border-black p-1.5 text-center font-black">{m.grade_letter}</td>
                  <td className="border border-black p-1.5 text-center font-bold">{m.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-4 flex items-end justify-between px-4">
        <div className="text-center">
          <div className="h-10 border-b border-black w-28 mx-auto"></div>
          <span className="text-[10px] font-bold block mt-1 text-gray-800">Subject Examiner</span>
        </div>
        <div className="text-center">
          {stamp?.file_url ? <img src={stamp.file_url} alt="Stamp" className="h-14 w-14 mx-auto object-contain" /> : <div className="h-14 w-14 border border-dashed border-gray-400 rounded-full flex items-center justify-center text-[9px] text-gray-500 font-bold mx-auto">STAMP</div>}
          <span className="text-[10px] font-bold block mt-1 text-gray-700">Official Stamp</span>
        </div>
        <div className="text-center">
          {signature?.file_url ? <img src={signature.file_url} alt="Signature" className="h-10 max-w-[100px] mx-auto object-contain" /> : <div className="h-10 border-b border-black w-28 mx-auto"></div>}
          <span className="text-[10px] font-bold block mt-1 text-gray-800">Head of Institution</span>
        </div>
      </div>
    </div>
  );
}
