import React from 'react';

const STATUS_PRINT_LABELS = {
  P: 'PRESENT',
  A: 'ABSENT',
  L: 'LEAVE',
  SL: 'SHORT LEAVE',
  Late: 'LATE',
  LT: 'LATE',
  H: 'HALF DAY',
  HD: 'HALF DAY',
  Hol: 'HOLIDAY',
  Off: 'DAY OFF',
  U: 'UNMARKED'
};

const StaffAttendancePrintSheet = ({
  records = [],
  summary = {},
  date,
  department = 'ALL',
  schoolName = 'Elite Educational Institution',
  campusName = 'Main Campus'
}) => {
  const total = summary.total || records.length || 0;
  const present = summary.present || records.filter((r) => r.status === 'P').length;
  const absent = summary.absent || records.filter((r) => r.status === 'A').length;
  const leave = (summary.leave || 0) + (summary.shortLeave || 0);
  const late = summary.late || 0;
  const holiday = (summary.holiday || 0) + (summary.halfDay || 0);
  const unmarked = summary.unmarked || 0;
  const rate = total > 0 ? Math.round((present / total) * 100) : 0;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : date;

  const deptLabel = !department || department === 'ALL' ? 'All Departments' : department;

  return (
    <div className="hidden print:block w-full bg-white text-black p-6 font-sans print:[print-color-adjust:exact]">
      <div className="text-center pb-3 border-b-2 border-black space-y-1">
        <h1 className="text-xl font-black uppercase tracking-wide text-black">{schoolName}</h1>
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{campusName}</p>
        <h2 className="text-sm font-bold uppercase tracking-wider text-black pt-1">
          Daily Staff Attendance Register &amp; Official Sheet
        </h2>
      </div>

      <div className="my-3 border border-black p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50/50">
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Department:</span>
          <span className="font-black text-sm text-black">{deptLabel}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Date:</span>
          <span className="font-bold text-black">{formattedDate}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Attendance Rate:</span>
          <span className="font-black text-sm text-black">{rate}%</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Total Active Staff:</span>
          <span className="font-black text-sm text-black">{total}</span>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between border-b border-black/40 pb-2 text-[11px] font-semibold">
        <span>Present: <strong className="font-black">{present}</strong></span>
        <span>Absent: <strong className="font-black">{absent}</strong></span>
        <span>Leave / Short Leave: <strong className="font-black">{leave}</strong></span>
        <span>Late: <strong className="font-black">{late}</strong></span>
        <span>Holiday / Off: <strong className="font-black">{holiday}</strong></span>
        <span>Unmarked: <strong className="font-black">{unmarked}</strong></span>
      </div>

      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-black text-[11px] font-bold text-black uppercase">
            <th className="border border-black py-2 px-2 text-center w-10">S.#</th>
            <th className="border border-black py-2 px-2 text-center w-24">Code</th>
            <th className="border border-black py-2 px-3 text-left">Staff Name</th>
            <th className="border border-black py-2 px-2 text-left">Designation</th>
            <th className="border border-black py-2 px-2 text-left">Department</th>
            <th className="border border-black py-2 px-2 text-center w-20">Time In</th>
            <th className="border border-black py-2 px-2 text-center w-20">Time Out</th>
            <th className="border border-black py-2 px-2 text-center w-24">Status</th>
            <th className="border border-black py-2 px-3 text-left w-28">Remarks</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/30">
          {records.length === 0 ? (
            <tr>
              <td colSpan={9} className="border border-black py-8 text-center text-xs text-gray-600">
                No staff attendance records available for this date.
              </td>
            </tr>
          ) : (
            records.map((r, idx) => {
              const staff = r.staff || {};
              const staffName = staff.name || 'Staff Member';
              const empCode = staff.employee_code || staff.personal_id || `EMP-${idx + 1}`;
              const designation = staff.designation || 'Staff';
              const dept = staff.department || 'Academic';
              const statusLabel = STATUS_PRINT_LABELS[r.status] || r.status || 'UNMARKED';

              return (
                <tr key={staff._id || r._id || idx} className="border-b border-black/20">
                  <td className="border border-black py-1 px-2 text-center font-mono font-bold">
                    {idx + 1}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-mono font-bold">
                    {empCode}
                  </td>
                  <td className="border border-black py-1 px-3 font-semibold">
                    {staffName}
                  </td>
                  <td className="border border-black py-1 px-2 text-gray-800">
                    {designation}
                  </td>
                  <td className="border border-black py-1 px-2 text-gray-800">
                    {dept}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-mono text-[11px]">
                    {r.check_in_time || '—'}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-mono text-[11px]">
                    {r.check_out_time || '—'}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-black">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                        r.status === 'A'
                          ? 'border border-black bg-gray-200 text-black'
                          : 'text-black'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="border border-black py-1 px-3 text-gray-700 text-[11px]">
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
          <span className="font-bold text-black uppercase text-[10px]">HR / Attendance Officer</span>
        </div>
        <div>
          <div className="border-b border-black w-44 mx-auto pb-8 mb-1" />
          <span className="font-bold text-black uppercase text-[10px]">Department Supervisor</span>
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

export default StaffAttendancePrintSheet;
