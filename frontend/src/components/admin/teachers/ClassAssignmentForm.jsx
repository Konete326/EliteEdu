import { useState } from 'react';
import { Plus, BookOpen, Layers } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const ClassAssignmentForm = ({ subjects = [], grades = [], onAdd }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSection, setSelectedSection] = useState('');

  const currentGrade = grades.find((g) => g._id === selectedGradeId);
  const sectionsList = currentGrade?.sections || ['A'];

  const subjectOptions = subjects.map((s) => ({
    value: s._id,
    label: s.name,
    subtext: s.code ? `Code: ${s.code}` : ''
  }));

  const gradeOptions = grades.map((g) => ({
    value: g._id,
    label: g.name
  }));

  const sectionOptions = [
    { value: '', label: 'All Sections in Grade' },
    ...sectionsList.map((sec) => ({
      value: sec,
      label: `Section ${sec}`
    }))
  ];

  const handleAdd = () => {
    if (!selectedSubjectId || !selectedGradeId) return;
    const sub = subjects.find((s) => s._id === selectedSubjectId);
    const gr = grades.find((g) => g._id === selectedGradeId);
    if (!sub || !gr) return;
    const sectionsToAdd = selectedSection ? [selectedSection] : sectionsList;
    onAdd(sub, gr, sectionsToAdd);
    setSelectedSubjectId('');
    setSelectedSection('');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-line dark:border-white/10">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-white">Assign Subjects &amp; Classes</h3>
          <p className="text-[11px] text-ink-muted">Attach academic curriculum subjects and grade levels to this teacher</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-white mb-1">
            Subject *
          </label>
          <SearchableSelect
            options={subjectOptions}
            value={selectedSubjectId}
            onChange={setSelectedSubjectId}
            placeholder="Choose Subject..."
            size="sm"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-white mb-1">
            Grade / Class *
          </label>
          <SearchableSelect
            options={gradeOptions}
            value={selectedGradeId}
            onChange={(val) => {
              setSelectedGradeId(val);
              setSelectedSection('');
            }}
            placeholder="Choose Grade..."
            size="sm"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-white mb-1">
            Section
          </label>
          <SearchableSelect
            options={sectionOptions}
            value={selectedSection}
            onChange={setSelectedSection}
            disabled={!selectedGradeId}
            searchable={false}
            placeholder="Select Section..."
            size="sm"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedSubjectId || !selectedGradeId}
          className="w-full h-10 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Assignment</span>
        </button>
      </div>
    </div>
  );
};

export default ClassAssignmentForm;