import { useState, useEffect } from 'react';
import { Check, Award } from 'lucide-react';
import api from '../../../services/api';
import BehaviorDomainRatings from './BehaviorDomainRatings';

const BADGES = [
  { id: 'Merit_Star', label: 'Merit Star', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  { id: 'Good_Conduct', label: 'Good Conduct', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  { id: 'Needs_Counseling', label: 'Needs Guidance', color: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30' },
  { id: 'Disciplinary_Warning', label: 'Disciplinary Warning', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30' }
];

const BehaviorEvaluationForm = ({ grades = [], activeTerm, onSaved }) => {
  const [gradeId, setGradeId] = useState('');
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [badgeType, setBadgeType] = useState('Good_Conduct');
  const [observation, setObservation] = useState('');
  const [affective, setAffective] = useState({ punctuality: 5, discipline: 5, neatness: 5, honesty: 5, cooperation: 5 });
  const [psychomotor, setPsychomotor] = useState({ handwriting: 5, communication: 5, sports_games: 5, creativity_arts: 5, lab_practical: 5 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (gradeId) {
      api.get(`/students?grade_id=${gradeId}`).then((res) => {
        const list = res.data?.data?.students || res.data?.data || [];
        setStudents(list);
        if (list.length > 0) setStudentId(list[0]._id);
      }).catch(() => {});
    } else {
      setStudents([]);
      setStudentId('');
    }
  }, [gradeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId || !gradeId) return;
    setSaving(true);
    try {
      await api.post('/operations/behavior', {
        student_id: studentId, grade_id: gradeId, term_name: activeTerm,
        affective_ratings: affective, psychomotor_ratings: psychomotor,
        badge_type: badgeType, teacher_observation: observation
      });
      onSaved();
      setObservation('');
    } finally { setSaving(false); }
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-black text-ink dark:text-ink-dark">Student Character Assessment</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-1">Class / Grade</label>
            <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} required className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-bold outline-none">
              <option value="">Select Grade</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-ink-muted mb-1">Student</label>
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-bold outline-none">
              <option value="">Select Student</option>
              {students.map((s) => <option key={s._id} value={s._id}>{s.name} ({s.roll_number || 'N/A'})</option>)}
            </select>
          </div>
        </div>

        <BehaviorDomainRatings title="Affective Domain (Values & Conduct: 1-5)" traits={['punctuality', 'discipline', 'neatness', 'honesty', 'cooperation']} ratings={affective} onChange={(t, v) => setAffective({ ...affective, [t]: v })} />
        <BehaviorDomainRatings title="Psychomotor Domain (Skills & Activity: 1-5)" traits={['handwriting', 'communication', 'sports_games', 'creativity_arts', 'lab_practical']} ratings={psychomotor} onChange={(t, v) => setPsychomotor({ ...psychomotor, [t]: v })} />

        <div>
          <span className="block text-[10px] font-bold text-ink-muted mb-1.5">Award Character Badge</span>
          <div className="grid grid-cols-2 gap-1.5">
            {BADGES.map((b) => (
              <button key={b.id} type="button" onClick={() => setBadgeType(b.id)} className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${badgeType === b.id ? `${b.color} shadow-sm ring-1 ring-primary/40` : 'border-line text-ink-muted bg-surface-secondary/30'}`}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-ink-muted mb-1">Teacher Observation / Remarks</label>
          <input type="text" value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="e.g. Demonstrates exceptional teamwork and leadership" className="w-full px-2.5 py-1.5 rounded-lg border border-line bg-surface-secondary/40 font-medium outline-none" />
        </div>

        <button type="submit" disabled={saving || !studentId} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover shadow-md shadow-primary/20 disabled:opacity-50">
          <Check className="w-4 h-4" />
          <span>{saving ? 'Recording Assessment...' : 'Submit Evaluation'}</span>
        </button>
      </form>
    </div>
  );
};

export default BehaviorEvaluationForm;
