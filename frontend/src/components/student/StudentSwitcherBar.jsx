import { Eye, UserCheck } from 'lucide-react';

const StudentSwitcherBar = ({ isStaff, students = [], selectedStudentId, onSelectStudent }) => {
  if (!isStaff) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 flex-shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">Admin / Teacher Simulation Mode:</span>
        <span className="text-xs opacity-90 hidden sm:inline">Previewing student experience in real time</span>
      </div>
      <div className="flex items-center gap-2">
        <UserCheck className="w-4 h-4" />
        <select
          value={selectedStudentId}
          onChange={(e) => onSelectStudent(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-gray-800 shadow-sm border-0 focus:ring-2 focus:ring-orange-300 outline-none"
        >
          {students.map((st) => (
            <option key={st._id} value={st._id}>
              {st.name} ({st.gr_number}) - {st.current_grade?.name || 'Class'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StudentSwitcherBar;
