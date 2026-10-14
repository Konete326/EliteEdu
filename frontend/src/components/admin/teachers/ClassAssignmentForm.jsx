import { Plus, BookOpen } from 'lucide-react';
import { useState } from 'react';

const ClassAssignmentForm = ({ subjects = [], grades = [], onAdd }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const currentGrade = grades.find((g) => g._id === selectedGradeId);
  const sectionsList = currentGrade?.sections || ['A'];

  const handleAdd = () => {
    if (!selectedSubjectId || !selectedGradeId) return;
    const sub = subjects.find((s) => s._id === selectedSubjectId);
    const gr = grades.find((g) => g._id === selectedGradeId);
    if (!sub || !gr) return;
    const sectionsToAdd = selectedSection ? [selectedSection] : sectionsList;
    onAdd(sub, gr, sectionsToAdd);
  };

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Assign Subjects & Classes</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Select Subject *</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          >
            <option value="">Choose Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>{s.name} ({s.code || 'SUB'})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Select Grade / Class *</label>
          <select
            value={selectedGradeId}
            onChange={(e) => { setSelectedGradeId(e.target.value); setSelectedSection(''); }}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          >
            <option value="">Choose Grade</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>{g.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Section (Optional)</label>
          <select
            value={selectedSection}
            disabled={!selectedGradeId}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none disabled:opacity-40"
          >
            <option value="">All Sections in Grade</option>
            {sectionsList.map((sec) => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedSubjectId || !selectedGradeId}
          className="w-full py-2 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40"
        >
          <Plus className="w-4 h-4" /> Add Assignment
        </button>
      </div>
    </div>
  );
};

export default ClassAssignmentForm;
