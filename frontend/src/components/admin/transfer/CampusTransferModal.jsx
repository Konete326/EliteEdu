import { useState, useEffect } from 'react';
import { ArrowLeftRight, X, Send } from 'lucide-react';
import api from '../../../services/api';
import TransferStudentSearch from './TransferStudentSearch';
import TransferDestinationFields from './TransferDestinationFields';
import TransferReasonInput from './TransferReasonInput';

const CampusTransferModal = ({ isOpen, onClose, campuses = [], grades = [], onTransferred }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toCampusId, setToCampusId] = useState('');
  const [toGradeId, setToGradeId] = useState('');
  const [toSection, setToSection] = useState('A');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    api.get('/students?limit=500')
      .then((res) => {
        if (!mounted) return;
        const list = res.data?.students || res.data?.data?.students || res.data?.data || [];
        setStudents(list);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setToGradeId(student.current_grade?._id || student.current_grade || student.grade_id?._id || student.grade_id || '');
    setToSection(student.current_section || student.section || 'A');
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setToGradeId('');
    setToSection('A');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent?._id || !toCampusId) return;
    setSubmitting(true);
    try {
      await api.post('/operations/campus-transfer', {
        student_id: selectedStudent._id,
        from_campus_id: selectedStudent.campus_id?._id || selectedStudent.campus_id || null,
        to_campus_id: toCampusId,
        from_grade_id: selectedStudent.current_grade?._id || selectedStudent.current_grade || selectedStudent.grade_id || null,
        to_grade_id: toGradeId,
        from_section: selectedStudent.current_section || selectedStudent.section || 'A',
        to_section: toSection,
        effective_date: effectiveDate,
        reason: reason.trim()
      });
      onTransferred();
      handleClearStudent();
      setToCampusId('');
      setReason('');
      onClose();
    } catch {} finally {
      setSubmitting(false);
    }
  };

  const availableCampuses = campuses.filter(
    (c) => c._id !== (selectedStudent?.campus_id?._id || selectedStudent?.campus_id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">Execute Campus Transfer</h3>
              <p className="text-xs text-ink-muted">Relocate student to another branch with instant routing ledger update</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <TransferStudentSearch
            students={students}
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            onClearStudent={handleClearStudent}
          />

          <TransferDestinationFields
            campuses={availableCampuses}
            grades={grades}
            toCampusId={toCampusId}
            setToCampusId={setToCampusId}
            toGradeId={toGradeId}
            setToGradeId={setToGradeId}
            toSection={toSection}
            setToSection={setToSection}
            effectiveDate={effectiveDate}
            setEffectiveDate={setEffectiveDate}
          />

          <TransferReasonInput value={reason} onChange={setReason} />

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl border border-line text-xs font-bold text-ink-muted hover:text-ink transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedStudent?._id || !toCampusId}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Executing Transfer...' : 'Approve & Issue Transfer Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampusTransferModal;
