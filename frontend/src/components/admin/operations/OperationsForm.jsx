import { useState, useEffect } from 'react';
import { Plus, Send } from 'lucide-react';
import api from '../../../services/api';
import OperationsStudentSelector from './OperationsStudentSelector';

const PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

const OperationsForm = ({ recordType = 'Complaint', onSaved, grades = [] }) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [studentId, setStudentId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [locationOrFee, setLocationOrFee] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);

  const needsStudent = ['Complaint', 'Counseling', 'Consent_Letter'].includes(recordType);

  useEffect(() => {
    if (needsStudent) {
      api.get('/students').then((res) => setStudents(res.data?.students || res.data || [])).catch(() => {});
    }
  }, [needsStudent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !details) return;
    setSaving(true);
    try {
      await api.post('/operations', {
        category: recordType, title: title.trim(), details: details.trim(),
        priority, student_id: needsStudent ? studentId || null : null,
        grade_id: gradeId || null, item_location_or_fee: locationOrFee.trim(),
        event_date: eventDate ? new Date(eventDate) : new Date(), status: 'Open'
      });
      onSaved();
      setTitle('');
      setDetails('');
      setLocationOrFee('');
      setEventDate('');
      setStudentId('');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-3.5">
      <div className="flex items-center gap-2 border-b border-line pb-2.5">
        <Plus className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black uppercase text-ink">New {recordType.replace('_', ' ')} Record</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Subject / Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Bus Route 4 Delay / Lost Geometry Box" className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none focus:border-primary" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Incident / Event Date</label>
            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none" />
          </div>
        </div>

        {recordType === 'Lost_Found' && (
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Location Found / Kept</label>
            <input type="text" value={locationOrFee} onChange={(e) => setLocationOrFee(e.target.value)} placeholder="e.g. Science Lab 2 / Admin Reception" className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none" />
          </div>
        )}

        {recordType === 'Consent_Letter' && grades?.length > 0 && (
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Target Class / Grade</label>
            <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
              <option value="">All Classes</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
        )}

        {needsStudent && <OperationsStudentSelector studentId={studentId} onChange={setStudentId} students={students} />}

        <div>
          <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Details &amp; Action Notes *</label>
          <textarea rows={3} value={details} onChange={(e) => setDetails(e.target.value)} required placeholder="Provide comprehensive details or circular notice..." className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-medium outline-none resize-none" />
        </div>

        <button type="submit" disabled={saving || !title || !details} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50">
          <Send className="w-3.5 h-3.5" />
          <span>{saving ? 'Logging...' : 'Post & Broadcast Record'}</span>
        </button>
      </form>
    </div>
  );
};

export default OperationsForm;
