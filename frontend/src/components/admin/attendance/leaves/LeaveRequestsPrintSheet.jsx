import React from 'react';

const STATUS_PRINT_STYLES = {
  Approved: 'text-black font-black',
  Pending: 'text-black font-bold italic',
  Rejected: 'text-black line-through font-bold'
};

const LeaveRequestsPrintSheet = ({
  leaves = [],
  kpis = {},
  statusFilter = 'all',
  applicantFilter = 'all',
  schoolName = 'Elite Educational Institution',
  campusName = 'Main Campus'
}) => {
  const total = kpis.total || leaves.length || 0;
  const approved = kpis.approved || leaves.filter((l) => l.status === 'Approved').length;
  const pending = kpis.pending || leaves.filter((l) => l.status === 'Pending').length;
  const rejected = kpis.rejected || leaves.filter((l) => l.status === 'Rejected').length;

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const filterStatusLabel = statusFilter === 'all' ? 'All Statuses' : statusFilter;
  const filterApplicantLabel = applicantFilter === 'all' ? 'All Applicants' : applicantFilter;

  return (
    <div className="hidden print:block w-full bg-white text-black p-6 font-sans print:[print-color-adjust:exact]">
      <div className="text-center pb-3 border-b-2 border-black space-y-1">
        <h1 className="text-xl font-black uppercase tracking-wide text-black">{schoolName}</h1>
        <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{campusName}</p>
        <h2 className="text-sm font-bold uppercase tracking-wider text-black pt-1">
          Official Leave Register &amp; Absence Record Sheet
        </h2>
      </div>

      <div className="my-3 border border-black p-3 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50/50">
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Generated Date:</span>
          <span className="font-bold text-black">{formattedDate}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Filter Status:</span>
          <span className="font-black text-sm text-black">{filterStatusLabel}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Target Category:</span>
          <span className="font-black text-sm text-black">{filterApplicantLabel}</span>
        </div>
        <div>
          <span className="font-bold text-gray-600 block text-[10px] uppercase">Total Listed:</span>
          <span className="font-black text-sm text-black">{leaves.length} Applications</span>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between border-b border-black/40 pb-2 text-[11px] font-semibold">
        <span>Total Registered: <strong className="font-black">{total}</strong></span>
        <span>Approved: <strong className="font-black">{approved}</strong></span>
        <span>Pending Review: <strong className="font-black">{pending}</strong></span>
        <span>Rejected: <strong className="font-black">{rejected}</strong></span>
      </div>

      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-black text-[11px] font-bold text-black uppercase">
            <th className="border border-black py-2 px-2 text-center w-10">S.#</th>
            <th className="border border-black py-2 px-3 text-left">Applicant Name</th>
            <th className="border border-black py-2 px-2 text-center w-20">Type</th>
            <th className="border border-black py-2 px-3 text-left">Class / Department</th>
            <th className="border border-black py-2 px-2 text-center w-24">GR / Code</th>
            <th className="border border-black py-2 px-2 text-left">Leave Type</th>
            <th className="border border-black py-2 px-2 text-center w-24">Period</th>
            <th className="border border-black py-2 px-2 text-center w-12">Days</th>
            <th className="border border-black py-2 px-3 text-left">Reason</th>
            <th className="border border-black py-2 px-2 text-center w-24">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/30">
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={10} className="border border-black py-8 text-center text-xs text-gray-600">
                No leave records match the selected filter criteria.
              </td>
            </tr>
          ) : (
            leaves.map((l, idx) => {
              const isStudent = l.applicant_type === 'Student';
              const name = isStudent ? l.student_id?.name : l.staff_id?.name;
              const sub = isStudent
                ? `${l.grade_id?.name || 'Class'} (${l.section || 'A'})`
                : `${l.staff_id?.designation || 'Staff'} • ${l.staff_id?.department || 'Academic'}`;
              const code = isStudent ? l.student_id?.gr_number || '—' : l.staff_id?.employee_code || '—';

              return (
                <tr key={l._id || idx} className="border-b border-black/20">
                  <td className="border border-black py-1 px-2 text-center font-mono font-bold">
                    {idx + 1}
                  </td>
                  <td className="border border-black py-1 px-3 font-semibold">
                    {name || 'Unnamed'}
                  </td>
                  <td className="border border-black py-1 px-2 text-center uppercase font-bold text-[10px]">
                    {l.applicant_type}
                  </td>
                  <td className="border border-black py-1 px-3 text-gray-800 text-[11px]">
                    {sub}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-mono text-[11px]">
                    {code}
                  </td>
                  <td className="border border-black py-1 px-2 font-medium">
                    {l.leave_type}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-mono text-[10px] whitespace-nowrap">
                    {l.from_date} to {l.to_date}
                  </td>
                  <td className="border border-black py-1 px-2 text-center font-bold font-mono">
                    {l.total_days}
                  </td>
                  <td className="border border-black py-1 px-3 text-gray-700 text-[11px] max-w-[200px] truncate">
                    {l.reason || '—'}
                  </td>
                  <td className="border border-black py-1 px-2 text-center">
                    <span className={`uppercase text-[10px] ${STATUS_PRINT_STYLES[l.status] || 'font-bold'}`}>
                      {l.status}
                    </span>
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
          <span className="font-bold text-black uppercase text-[10px]">Leave Desk Incharge</span>
        </div>
        <div>
          <div className="border-b border-black w-44 mx-auto pb-8 mb-1" />
          <span className="font-bold text-black uppercase text-[10px]">Academic / Admin Supervisor</span>
        </div>
        <div>
          <div className="border-b border-black w-44 mx-auto pb-8 mb-1" />
          <span className="font-bold text-black uppercase text-[10px]">Principal Official Stamp</span>
        </div>
      </div>

      <div className="mt-8 text-right text-[10px] text-gray-500 font-mono">
        Official Document • Generated via EliteEdu ERP on {new Date().toLocaleString()}
      </div>
    </div>
  );
};

export default LeaveRequestsPrintSheet;
