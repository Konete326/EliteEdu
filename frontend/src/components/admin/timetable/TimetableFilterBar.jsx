import { Plus, Filter, Users, GraduationCap } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const TimetableFilterBar = ({
  viewMode = 'class', grades = [], teachers = [], selectedGrade, setSelectedGrade,
  selectedSection, setSelectedSection, selectedTeacher, setSelectedTeacher, onOpenAssign
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter:
      </div>

      {viewMode === 'class' && (
        <>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-1.5 border rounded-xl text-xs font-semibold bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400 font-bold">Sec:</span>
            {['A', 'B', 'C', 'D'].map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedSection === sec
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </>
      )}

      {viewMode === 'teacher' && (
        <div className="flex items-center gap-2 min-w-[220px]">
          <Users className="w-4 h-4 text-emerald-600 shrink-0" />
          <SearchableSelect
            options={teachers.map((t) => ({
              value: t._id,
              label: t.name,
              subtext: t.designation || t.email || '',
              badge: t.campus_id?.name || ''
            }))}
            value={selectedTeacher}
            onChange={(val) => setSelectedTeacher(val)}
            placeholder="Filter by Teacher"
            searchPlaceholder="Search teacher..."
            size="sm"
          />
        </div>
      )}
    </div>

    <button
      type="button"
      onClick={() => onOpenAssign?.()}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
    >
      <Plus className="w-3.5 h-3.5" /> Assign Period Slot
    </button>
  </div>
);

export default TimetableFilterBar;
