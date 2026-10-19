import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

const TransportStudentAllocationRow = ({ student, isAssigned, onOther, activeRoute, onToggle, loading }) => (
  <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 text-xs">
    <td className="p-3 font-mono font-bold text-center text-gray-400">{student.roll_number || '—'}</td>
    <td className="p-3 font-bold text-gray-900 dark:text-gray-100">
      {student.name} <span className="font-mono text-[10px] text-gray-400 font-normal">({student.gr_number})</span>
    </td>
    <td className="p-3 text-gray-600 dark:text-gray-300">{student.father_name || '—'}</td>
    <td className="p-3">
      {isAssigned ? (
        <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg font-bold text-[10px] inline-flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Enrolled (PKR {student.transport_fee || activeRoute?.monthly_fee}/mo)
        </span>
      ) : onOther ? (
        <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg font-bold text-[10px]">
          Route: {student.transport_route}
        </span>
      ) : (
        <span className="text-gray-400 text-[11px]">Not Enrolled</span>
      )}
    </td>
    <td className="p-3 text-right">
      <button
        type="button"
        onClick={() => onToggle(student, isAssigned)}
        disabled={loading}
        className={`px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all ${
          isAssigned
            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
        }`}
      >
        {isAssigned ? <Trash2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
        {isAssigned ? 'Remove' : 'Enroll in Van'}
      </button>
    </td>
  </tr>
);

export default TransportStudentAllocationRow;
