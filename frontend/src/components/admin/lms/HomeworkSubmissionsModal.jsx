import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../../utils/axiosConfig';
import { useToast } from '../../../context/ToastContext';
import HomeworkSubmissionRow from './HomeworkSubmissionRow';
import HomeworkSubmissionsFooter from './HomeworkSubmissionsFooter';

const HomeworkSubmissionsModal = ({ item, isOpen, onClose, onSaved }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [syncToClassTest, setSyncToClassTest] = useState(true);

  useEffect(() => {
    if (!isOpen || !item?._id) return;
    setLoading(true);
    api.get(`/lms/${item._id}/submissions`).then((res) => {
      if (res.data?.success) {
        setStudents(res.data.roster || res.data.students || []);
        setSubmissions(res.data.item?.submissions || res.data.submissions || []);
      }
    }).catch((err) => {
      showToast(err.response?.data?.message || 'Failed to load submissions', 'error');
    }).finally(() => setLoading(false));
  }, [isOpen, item]);

  const handleStatusChange = (studentId, field, value) => {
    setSubmissions((prev) => {
      const idx = prev.findIndex((s) => String(s.student_id) === String(studentId));
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], [field]: value };
        return next;
      }
      return [...prev, { student_id: studentId, status: 'Submitted', obtained_marks: 0, remarks: '', [field]: value }];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.post(`/lms/${item._id}/submissions`, { submissions, sync_to_class_test: syncToClassTest });
      if (res.data?.success) {
        showToast(res.data.message || 'Student submissions updated successfully', 'success');
        if (onSaved) onSaved();
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save submissions', 'error');
    } finally { setSaving(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-xs text-gray-500">Max Marks: {item.max_marks || 10} • Class: {item.grade_id?.name || 'Class'} ({item.section})</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
          ) : students.length === 0 ? (
            <p className="text-center py-8 text-gray-400 text-sm">No active students enrolled in this class/section.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs">
                <tr>
                  <th className="p-3">Roll #</th><th className="p-3">Student Name</th><th className="p-3">Status</th><th className="p-3">Marks</th><th className="p-3">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {students.map((st) => (
                  <HomeworkSubmissionRow
                    key={st._id || st.student_id}
                    student={st}
                    submission={submissions.find((s) => String(s.student_id) === String(st._id || st.student_id))}
                    maxMarks={item.max_marks || 100}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
        <HomeworkSubmissionsFooter saving={saving} syncToClassTest={syncToClassTest} onToggleSync={setSyncToClassTest} onSave={handleSave} onClose={onClose} />
      </div>
    </div>
  );
};

export default HomeworkSubmissionsModal;
