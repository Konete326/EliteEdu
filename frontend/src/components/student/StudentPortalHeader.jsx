import { User, Bus, CheckCircle2, AlertCircle } from 'lucide-react';

const StudentPortalHeader = ({ student, attendance = {}, invoices = [] }) => {
  if (!student) return null;
  const unpaidCount = invoices.filter((inv) => inv.status !== 'Paid').length;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
          {student.name?.charAt(0) || 'S'}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{student.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30">
              {student.current_grade?.name || 'Class'} ({student.current_section || 'A'})
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            s/o {student.father_name} • GR #: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{student.gr_number}</span>
            {student.campus_id?.name ? ` • ${student.campus_id.name}` : ''}
          </p>
          {student.transport_route && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded mt-1.5">
              <Bus className="w-3 h-3" /> Transport: {student.transport_route}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/40 text-center min-w-[90px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Attendance</span>
          <h4 className="text-lg font-black text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> {attendance.attendancePct || 100}%
          </h4>
        </div>
        <div className="p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl border border-gray-200 dark:border-gray-600 text-center min-w-[90px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Fee Dues</span>
          <h4 className={`text-lg font-black flex items-center justify-center gap-1 ${unpaidCount > 0 ? 'text-rose-600' : 'text-gray-700 dark:text-gray-200'}`}>
            {unpaidCount > 0 && <AlertCircle className="w-4 h-4" />} {unpaidCount} Due
          </h4>
        </div>
      </div>
    </div>
  );
};

export default StudentPortalHeader;
