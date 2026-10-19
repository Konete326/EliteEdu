import { CheckSquare } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableSlotFormFields = ({ form, setForm, grades = [], subjects = [], teachers = [], bellSchedule, onPeriodChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Class / Grade *</label>
        <select value={form.grade_id} onChange={(e) => setForm({ ...form, grade_id: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
          <option value="">Select Class</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Section</label>
        <input type="text" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="A" required />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Day of Week</label>
        <select disabled={form.apply_all_weekdays} value={form.day_of_week} onChange={(e) => setForm({ ...form, day_of_week: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50">
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Period No</label>
        <select value={form.period_no} onChange={(e) => onPeriodChange(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          {(bellSchedule?.slots || []).filter((s) => s.slot_type === 'Period').map((s) => (
            <option key={s.slot_no} value={s.period_index}>Period {s.period_index} ({s.start_time} - {s.end_time})</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
      <select value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
        <option value="">Select Subject</option>
        {subjects.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.code || 'Sub'})</option>)}
      </select>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Teacher *</label>
        <select value={form.teacher_id} onChange={(e) => setForm({ ...form, teacher_id: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required>
          <option value="">Select Teacher</option>
          {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Room No</label>
        <input type="text" value={form.room_no} onChange={(e) => setForm({ ...form, room_no: e.target.value })} className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="Room 101" />
      </div>
    </div>

    <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 text-xs font-bold text-blue-900 dark:text-blue-300 cursor-pointer">
      <input type="checkbox" checked={form.apply_all_weekdays} onChange={(e) => setForm({ ...form, apply_all_weekdays: e.target.checked })} className="rounded text-blue-600 w-4 h-4" />
      <div className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5" /> Apply to All Weekdays (Mon-Sat)</div>
    </label>
  </div>
);

export default TimetableSlotFormFields;
