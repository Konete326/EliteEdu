import { useState } from 'react';
import { Plus, Clock, AlertTriangle, Coffee } from 'lucide-react';
import { usePersistentFormDraft } from '../../../hooks/usePersistentFormDraft';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';

const INITIAL = {
  day_of_week: 'Monday', period_no: 1, start_time: '08:00 AM', end_time: '08:45 AM',
  grade_id: '', section: 'A', subject_id: '', teacher_id: '', room_no: 'Room 101', is_break: false
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TimetableSlotForm = ({ grades = [], subjects = [], teachers = [], onSaved, user }) => {
  const { showToast } = useToast();
  const [draft, setDraft, clearDraft] = usePersistentFormDraft(`tt_draft_${user?.school_id || 'v1'}`, INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!draft.is_break && (!draft.grade_id || !draft.subject_id || !draft.teacher_id)) {
      return showToast('Class, Subject, and Teacher are required for regular periods', 'warning');
    }
    setSubmitting(true);
    try {
      await api.post('/timetable', draft);
      showToast('Timetable slot scheduled successfully without conflicts', 'success');
      onSaved();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save timetable slot';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3 h-fit">
      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Clock className="w-4 h-4 text-blue-500" /> Schedule Period Slot
      </h4>
      <div className="grid grid-cols-2 gap-2">
        <select value={draft.day_of_week} onChange={(e) => setDraft({ ...draft, day_of_week: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={draft.period_no} onChange={(e) => setDraft({ ...draft, period_no: Number(e.target.value) })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => <option key={p} value={p}>Period {p}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input type="text" placeholder="Start (e.g. 08:00 AM)" value={draft.start_time} onChange={(e) => setDraft({ ...draft, start_time: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
        <input type="text" placeholder="End (e.g. 08:45 AM)" value={draft.end_time} onChange={(e) => setDraft({ ...draft, end_time: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required />
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer">
        <input type="checkbox" checked={draft.is_break} onChange={(e) => setDraft({ ...draft, is_break: e.target.checked })} />
        <Coffee className="w-3.5 h-3.5 text-amber-500" /> Recess / Break Slot
      </label>
      {!draft.is_break && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <select value={draft.grade_id} onChange={(e) => setDraft({ ...draft, grade_id: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
              <option value="">Select Class *</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
            <input type="text" placeholder="Section (A)" value={draft.section} onChange={(e) => setDraft({ ...draft, section: e.target.value })} className="px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
          </div>
          <select value={draft.subject_id} onChange={(e) => setDraft({ ...draft, subject_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
            <option value="">Select Subject *</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.code || 'Sub'})</option>)}
          </select>
          <select value={draft.teacher_id} onChange={(e) => setDraft({ ...draft, teacher_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" required>
            <option value="">Assign Teacher *</option>
            {teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
          </select>
          <input type="text" placeholder="Room Number (e.g. Room 101)" value={draft.room_no} onChange={(e) => setDraft({ ...draft, room_no: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
        </>
      )}
      <button type="submit" disabled={submitting} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Save Slot (Conflict-Check)
      </button>
    </form>
  );
};

export default TimetableSlotForm;
