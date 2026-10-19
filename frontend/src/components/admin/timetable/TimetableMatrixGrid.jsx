import { Trash2, Plus, Coffee, MapPin, User as UserIcon } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableMatrixGrid = ({
  slots = [], viewMode = 'class', bellSchedule, onOpenAssign, onDeleteSlot, canManage = true
}) => {
  const periodSlots = (bellSchedule?.slots || [])
    .filter((s) => s.slot_type === 'Period')
    .sort((a, b) => Number(a.period_index) - Number(b.period_index));

  const periods = periodSlots.length > 0
    ? periodSlots
    : [1, 2, 3, 4, 5, 6, 7].map((p) => ({ period_index: p, start_time: '', end_time: '', label: `P${p}` }));

  const getSlot = (day, pNo) => slots.find((s) => s.day_of_week === day && Number(s.period_no) === Number(pNo));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-x-auto">
      <table className="w-full text-xs text-left border-collapse min-w-[760px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            <th className="p-3 font-bold uppercase tracking-wider w-24">Day</th>
            {periods.map((p) => (
              <th key={p.period_index} className="p-2.5 font-bold text-center border-l border-gray-200 dark:border-gray-700 min-w-[105px]">
                <div>Period {p.period_index}</div>
                {p.start_time && (
                  <div className="text-[10px] font-normal text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                    {p.start_time} - {p.end_time}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {DAYS.map((day) => (
            <tr key={day} className="hover:bg-gray-50/40 dark:hover:bg-gray-700/20">
              <td className="p-3 font-bold text-gray-900 dark:text-gray-100 bg-gray-50/50 dark:bg-gray-800/80">
                {day}
              </td>
              {periods.map((p) => {
                const slot = getSlot(day, p.period_index);
                if (!slot) {
                  return (
                    <td key={p.period_index} className="p-2 border-l border-gray-100 dark:border-gray-700/50 text-center">
                      {canManage ? (
                        <button
                          type="button"
                          onClick={() => onOpenAssign?.(day, p.period_index, p)}
                          className="w-full py-3.5 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" /> Assign
                        </button>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>
                  );
                }
                return (
                  <td key={p.period_index} className="p-2 border-l border-gray-100 dark:border-gray-700/50">
                    <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 space-y-1 relative group shadow-sm">
                      <div className="font-bold text-blue-900 dark:text-blue-200 truncate pr-5">
                        {slot.subject_id?.name || 'Subject'}
                      </div>
                      <div className="text-[11px] text-gray-600 dark:text-gray-300 flex items-center gap-1 truncate">
                        <UserIcon className="w-2.5 h-2.5 text-gray-400" />
                        {viewMode === 'teacher'
                          ? `${slot.grade_id?.name || 'Class'} (${slot.section || 'A'})`
                          : (slot.teacher_id?.name || 'Teacher')}
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center justify-between pt-0.5">
                        <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {slot.room_no}</span>
                        <span className="font-mono text-[9px] text-gray-500">{slot.start_time}</span>
                      </div>
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => onDeleteSlot(slot._id)}
                          className="absolute top-1.5 right-1.5 p-1 bg-white dark:bg-gray-800 shadow-sm rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableMatrixGrid;
