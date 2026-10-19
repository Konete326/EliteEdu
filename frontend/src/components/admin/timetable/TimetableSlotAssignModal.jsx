import { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, Save } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import TimetableSlotFormFields from './TimetableSlotFormFields';

const TimetableSlotAssignModal = ({
  isOpen, onClose, initialData = {}, grades = [], subjects = [], teachers = [], bellSchedule, onSaved
}) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [clashError, setClashError] = useState('');
  const [form, setForm] = useState({
    grade_id: '', section: 'A', day_of_week: 'Monday', period_no: 1,
    start_time: '08:00 AM', end_time: '08:40 AM', subject_id: '',
    teacher_id: '', room_no: 'Room 101', apply_all_weekdays: false
  });

  useEffect(() => {
    if (isOpen) {
      setClashError('');
      const pSlots = (bellSchedule?.slots || []).filter((s) => s.slot_type === 'Period');
      const targetP = initialData.period_no || 1;
      const matched = pSlots.find((s) => Number(s.period_index) === Number(targetP));
      setForm({
        grade_id: initialData.grade_id || (grades[0]?._id || ''),
        section: initialData.section || 'A',
        day_of_week: initialData.day_of_week || 'Monday',
        period_no: targetP,
        start_time: initialData.start_time || matched?.start_time || '08:00 AM',
        end_time: initialData.end_time || matched?.end_time || '08:40 AM',
        subject_id: initialData.subject_id?._id || initialData.subject_id || '',
        teacher_id: initialData.teacher_id?._id || initialData.teacher_id || '',
        room_no: initialData.room_no || 'Room 101',
        apply_all_weekdays: false
      });
    }
  }, [isOpen, initialData, bellSchedule, grades]);

  if (!isOpen) return null;

  const handlePeriodChange = (pNo) => {
    const p = Number(pNo);
    const pSlots = (bellSchedule?.slots || []).filter((s) => s.slot_type === 'Period');
    const matched = pSlots.find((s) => Number(s.period_index) === p);
    setForm((prev) => ({
      ...prev,
      period_no: p,
      start_time: matched ? matched.start_time : prev.start_time,
      end_time: matched ? matched.end_time : prev.end_time
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.grade_id || !form.subject_id || !form.teacher_id) {
      return showToast('Class, Subject, and Teacher are required', 'warning');
    }
    setSubmitting(true);
    setClashError('');
    try {
      const res = await api.post('/timetable/assign', form);
      showToast(res.data?.message || 'Period slot assigned successfully', 'success');
      onSaved?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to schedule period slot';
      setClashError(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" /> Assign Period Slot (Conflict Guard)
            </h3>
            <p className="text-xs text-gray-500">Period {form.period_no} • {form.start_time} - {form.end_time}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {clashError && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="font-semibold">{clashError}</div>
            </div>
          )}

          <TimetableSlotFormFields
            form={form}
            setForm={setForm}
            grades={grades}
            subjects={subjects}
            teachers={teachers}
            bellSchedule={bellSchedule}
            onPeriodChange={handlePeriodChange}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Save className="w-3.5 h-3.5" /> {submitting ? 'Verifying Clashes...' : 'Save & Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableSlotAssignModal;
