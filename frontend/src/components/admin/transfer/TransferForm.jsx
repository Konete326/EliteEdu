import { useState } from 'react';
import { ArrowLeftRight, Send } from 'lucide-react';
import api from '../../../services/api';
import TransferStudentSearch from './TransferStudentSearch';
import TransferDestinationFields from './TransferDestinationFields';
import TransferReasonInput from './TransferReasonInput';

const TransferForm = ({ campuses = [], grades = [], onTransferred }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toCampusId, setToCampusId] = useState('');
  const [toGradeId, setToGradeId] = useState('');
  const [toSection, setToSection] = useState('A');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [transferring, setTransferring] = useState(false);

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
    setTransferring(true);
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
      if (onTransferred) onTransferred();
      handleClearStudent();
      setToCampusId('');
      setReason('');
    } finally {
      setTransferring(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <ArrowLeftRight className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-black text-ink dark:text-ink-dark">Execute Campus Transfer</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <TransferStudentSearch
          students={students}
          selectedStudent={selectedStudent}
          onSelectStudent={handleSelectStudent}
          onClearStudent={handleClearStudent}
        />

        <TransferDestinationFields
          campuses={campuses}
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

        <button
          type="submit"
          disabled={transferring || !selectedStudent?._id || !toCampusId}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{transferring ? 'Executing Transfer...' : 'Approve & Issue Transfer Order'}</span>
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
