import React from 'react';

const StudentAttendancePrintSheet = ({
  records = [],
  summary = {},
  classLabel = 'Class',
  section = '',
  date,
  schoolName = 'Elite Educational Institution',
  campusName = 'Main Campus'
}) => {
  const total = summary.total || records.length || 0;
  const present = summary.present || records.filter((r) => r.status === 'P').length;
  const absent = summary.absent || records.filter((r) => r.status === 'A').length;
  const leave = summary.leave || records.filter((r) => r.status === 'L').length;
  const late = summary.late || records.filter((r) => r.status === 'LT').length;
  const halfDay = summary.halfDay || records.filter((r) => r.status === 'HD').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : date;

  const sectionLabel = !section || section === 'ALL' ? 'All Sections' : `Section ${section}`;

  return (
    <div className="hidden print:block w-full bg-white text-black p-6 font-sans print:[print-color-adjust:exact]">
      <div className="text-center pb-3 border-b-2 border-black space-y-1">
        <h1 className="text-xl font-black uppercase tracking-wide text-black">{schoolName}</h1>
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{campusName}</p>
        <h2 className="text-sm font-bold uppercase tracking-wider text-black pt-1">
          Daily Student Attendance Register &amp; Roll Sheet
        </h2>
      </div>

      <div className="my-3 border border-black p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50/50">
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Class:</span>
          <span className="font-black text-sm text-black">{classLabel}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Section:</span>
          <span className="font-black text-sm text-black">{sectionLabel}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Date:</span>
          <span className="font-bold text-black">{formattedDate}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Attendance Rate:</span>
          <span className="font-black text-sm text-black">{rate}%</span>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between border-b border-black/40 pb-2 text-[11px] font-semibold">
        <span>Total Enrolled: <strong className="font-black">{total}</strong></span>
        <span>Present: <strong className="font-black">{present}</strong></span>
        <span>Absent: <strong className="font-black">{absent}</strong></span>
        <span>Leave: <strong className="font-black">{leave}</strong></span>
        <span>Late / Half Day: <strong className="font-black">{late + halfDay}</strong></span>
      </div>

      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-black text-[11px] font-bold text-black uppercase">
            <th className="border border-black py-2 px-2 text-center w-12">S.#</th>
            <th className="border border-black py-2 px-3 text-center w-28">Roll / GR #</th>
            <th className="border border-black py-2 px-3 text-left">Student Name</th>
            <th className="border border-black py-2 px-3 text-left">Father Name</th>
            <th className="border border-black py-2 px-3 text-center w-28">Status</th>
            <th className="border border-black py-2 px-3 text-left w-36">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/30">
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} className="border border-black py-8 text-center text-xs text-gray-600">
                No attendance records available for this class and date.
              </td>
            </tr>
          ) : (
            records.map((r, idx) => {
              const student = r.student || {};
              const fullName = (student.name || `${student.first_name || ''} ${student.last_name || ''}`).trim() || 'Student';
              const rollDisplay = student.roll_number || student.gr_number || `S-${idx + 1}`;
              const fatherName = student.father_name || '—';
              const statusDisplay =
                r.status === 'P'
                  ? 'PRESENT'
                  : r.status === 'A'
                  ? 'ABSENT'
                  : r.status === 'L'
                  ? 'LEAVE'
                  : r.status === 'LT'
                  ? 'LATE'
                  : r.status === 'HD'
                  ? 'HALF DAY'
                  : r.status || 'PRESENT';

              return (
                <tr key={student._id || r._id || idx} className="border-b border-black/20">
                  <td className="border border-black py-1.5 px-2 text-center font-mono font-bold">
                    {idx + 1}
                  </td>
                  <td className="border border-black py-1.5 px-3 text-center font-mono font-bold">
                    {rollDisplay}
                  </td>
                  <td className="border border-black py-1.5 px-3 font-semibold">
                    {fullName}
                  </td>
                  <td className="border border-black py-1.5 px-3 text-gray-800">
                    {fatherName}
                  </td>
                  <td className="border border-black py-1.5 px-3 text-center font-black">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                        r.status === 'A'
                          ? 'border border-black bg-gray-200 text-black'
                          : r.status === 'L'
                          ? 'text-black'
                          : 'text-black'
                      }`}
                    >
                      {statusDisplay}
                    </span>
                  </td>
                  <td className="border border-black py-1.5 px-3 text-gray-700 text-[11px]">
                    {r.remarks || '—'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className="mt-12 pt-6 grid grid-cols-3 gap-6 text-center text-xs border-t border-black/30">
        <div>
          <div className="border-b border-black w-44 mx-auto pb-8 mb-1" />
          <span className="font-bold text-black uppercase text-[10px]">Class Incharge Signature</span>
        </div>
        <div>
          <div className="border-b border-black w-44 mx-auto pb-8 mb-1" />
          <span className="font-bold text-black uppercase text-[10px]">Section Head / Incharge</span>
        </div>
        <div>
          <div className="border-b border-black w-44 mx-auto pb-8 mb-1" />
          <span className="font-bold text-black uppercase text-[10px]">Principal Official Stamp</span>
        </div>
      </div>

      <div className="mt-8 text-right text-[10px] text-gray-500 font-mono">
        Generated via EliteEdu System on {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default StudentAttendancePrintSheet;
