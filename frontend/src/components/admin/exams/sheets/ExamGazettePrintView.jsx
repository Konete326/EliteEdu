import React from 'react';

export default function ExamGazettePrintView({ exam, marks = [], signature, stamp }) {
  const studentMap = new Map();
  marks.forEach((m) => {
    const sId = String(m.student_id?._id || m.student_id);
    if (!studentMap.has(sId)) {
      studentMap.set(sId, {
        student: m.student_id || {},
        totalObtained: 0,
        totalMax: 0,
        hasFail: false,
        paperCount: 0
      });
    }
    const item = studentMap.get(sId);
    item.totalObtained += m.total_obtained || 0;
    item.totalMax += m.max_marks || 100;
    item.paperCount += 1;
    if (m.status === 'FAIL' || m.status === 'ABSENT') item.hasFail = true;
  });

  const studentRows = Array.from(studentMap.values()).map((row) => {
    const pct = row.totalMax > 0 ? Math.round((row.totalObtained / row.totalMax) * 100) : 0;
    const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'B+' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F';
    const status = !row.hasFail && pct >= 33 ? 'PASS' : 'FAIL';
    return { ...row, percentage: pct, grade, status };
  }).sort((a, b) => b.percentage - a.percentage);

  const totalAppeared = studentRows.length;
  const passedCount = studentRows.filter((r) => r.status === 'PASS').length;
  const passPct = totalAppeared > 0 ? Math.round((passedCount / totalAppeared) * 100) : 0;

  return (
    <div className="bg-white text-black p-6 rounded-xl border border-line text-xs font-sans print:p-0 print:border-0">
      <div className="text-center pb-3 border-b-2 border-black space-y-1">
        <h2 className="text-lg font-black uppercase">{exam.campus_id?.name || 'BOARD OF EXAMINATIONS'}</h2>
        <h3 className="text-sm font-bold text-gray-800">OFFICIAL CLASS RESULT GAZETTE</h3>
        <p className="text-[11px] text-gray-600">Exam: {exam.title} ({exam.term_type}) • Session: {exam.academic_year}</p>
        <div className="inline-flex gap-4 text-[11px] font-bold bg-gray-100 px-3 py-1 rounded border border-gray-300 mt-1">
          <span>Appeared: {totalAppeared}</span>
          <span>Passed: {passedCount}</span>
          <span>Failed: {totalAppeared - passedCount}</span>
          <span>Pass Rate: {passPct}%</span>
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full text-left border-collapse border border-black text-xs">
          <thead>
            <tr className="bg-gray-100 border-b border-black font-bold">
              <th className="border border-black p-1.5 text-center">Pos</th>
              <th className="border border-black p-1.5 text-center">Roll</th>
              <th className="border border-black p-1.5">Student Name</th>
              <th className="border border-black p-1.5 text-center">Papers</th>
              <th className="border border-black p-1.5 text-center">Marks</th>
              <th className="border border-black p-1.5 text-center">%</th>
              <th className="border border-black p-1.5 text-center">Grade</th>
              <th className="border border-black p-1.5 text-center">Result</th>
            </tr>
          </thead>
          <tbody>
            {studentRows.length === 0 ? (
              <tr><td colSpan="8" className="text-center p-4 border border-black text-gray-500">No marks compiled yet.</td></tr>
            ) : (
              studentRows.map((r, idx) => (
                <tr key={idx} className="border-b border-black">
                  <td className="border border-black p-1.5 text-center font-bold">{idx + 1}</td>
                  <td className="border border-black p-1.5 text-center">{r.student?.roll_number || '-'}</td>
                  <td className="border border-black p-1.5 font-bold">{r.student?.name || 'Student'}</td>
                  <td className="border border-black p-1.5 text-center">{r.paperCount}</td>
                  <td className="border border-black p-1.5 text-center font-bold">{r.totalObtained} / {r.totalMax}</td>
                  <td className="border border-black p-1.5 text-center font-bold">{r.percentage}%</td>
                  <td className="border border-black p-1.5 text-center font-black">{r.grade}</td>
                  <td className="border border-black p-1.5 text-center font-bold">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 pt-4 flex items-end justify-between px-4">
        <div className="text-center">
          <div className="h-10 border-b border-black w-28 mx-auto"></div>
          <span className="text-[10px] font-bold block mt-1 text-gray-800">Exam Superintendent</span>
        </div>
        <div className="text-center">
          {stamp?.file_url ? <img src={stamp.file_url} alt="Stamp" className="h-14 w-14 mx-auto object-contain" /> : <div className="h-14 w-14 border border-dashed border-gray-400 rounded-full flex items-center justify-center text-[9px] text-gray-500 font-bold mx-auto">STAMP</div>}
          <span className="text-[10px] font-bold block mt-1 text-gray-700">Official Stamp</span>
        </div>
        <div className="text-center">
          {signature?.file_url ? <img src={signature.file_url} alt="Signature" className="h-10 max-w-[100px] mx-auto object-contain" /> : <div className="h-10 border-b border-black w-28 mx-auto"></div>}
          <span className="text-[10px] font-bold block mt-1 text-gray-800">Principal / Controller</span>
        </div>
      </div>
    </div>
  );
}
