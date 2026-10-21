import { useState, useEffect } from 'react';
import { X, Loader2, Users } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-3 sm:p-4">
      <div className="bg-surface dark:bg-surface-dark rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-line dark:border-line-dark">
        <div className="p-3.5 sm:p-4 border-b border-line dark:border-line-dark flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm sm:text-base text-ink dark:text-white truncate">{item.title}</h3>
            <p className="text-[11px] text-ink-muted">
              Max Marks: <strong className="text-ink dark:text-white font-mono">{item.max_marks || 10}</strong> • Class: {item.grade_id?.name || 'Class'} ({item.section || 'A'})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-muted space-y-2">
              <Users className="w-8 h-8 mx-auto text-ink-muted/50" />
              <p className="font-bold text-ink dark:text-white">No enrolled students found</p>
              <p className="text-[11px]">There are no active students matching this class and section.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
              <table className="w-full text-left text-xs min-w-[560px]">
                <thead className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-ink-muted text-[10px] font-bold uppercase tracking-wider border-b border-line dark:border-line-dark">
                  <tr>
                    <th className="p-3">GR / Roll #</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Marks</th>
                    <th className="p-3">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line dark:divide-line-dark">
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
            </div>
          )}
        </div>

        <HomeworkSubmissionsFooter
          saving={saving}
          syncToClassTest={syncToClassTest}
          onToggleSync={setSyncToClassTest}
          onSave={handleSave}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default HomeworkSubmissionsModal;
