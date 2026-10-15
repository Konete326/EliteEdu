import { School } from 'lucide-react';

const StudentPlacementCard = ({ formData, campuses, grades, onChange, errors = {} }) => {
  const campusGrades = grades.filter((g) => {
    if (!formData.campus_id) return true;
    const gCampId = g.campus_id?._id || g.campus_id;
    return !gCampId || gCampId === formData.campus_id;
  });

  const admittedGrade = grades.find((g) => g._id === formData.grade_admitted);
  const currentGrade = grades.find((g) => g._id === formData.current_grade);
  const admittedSections = admittedGrade?.sections || ['A', 'B', 'C', 'D'];
  const currentSections = currentGrade?.sections || ['A', 'B', 'C', 'D'];

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <School className="w-4 h-4 text-primary" />
        <span>Academic Placement</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Campus (Optional)
          </label>
          <select
            value={formData.campus_id || ''}
            onChange={(e) => onChange('campus_id', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none cursor-pointer"
          >
            <option value="">Main / First Active Campus</option>
            {campuses.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Class Admitted (Optional)
          </label>
          <select
            value={formData.grade_admitted || ''}
            onChange={(e) => {
              onChange('grade_admitted', e.target.value);
              if (!formData.current_grade) onChange('current_grade', e.target.value);
            }}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          >
            <option value="">Select Admitted Class</option>
            {campusGrades.map((g) => (<option key={g._id} value={g._id}>{g.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Section Admitted (Optional)
          </label>
          <select
            value={formData.section_admitted || 'A'}
            onChange={(e) => onChange('section_admitted', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
          >
            {admittedSections.map((sec) => (<option key={sec} value={sec}>Section {sec}</option>))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Current Class (Optional)
          </label>
          <select
            value={formData.current_grade || ''}
            onChange={(e) => onChange('current_grade', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          >
            <option value="">Select Current Class</option>
            {campusGrades.map((g) => (<option key={g._id} value={g._id}>{g.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Current Section (Optional)
          </label>
          <select
            value={formData.current_section || 'A'}
            onChange={(e) => onChange('current_section', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark outline-none"
          >
            {currentSections.map((sec) => (<option key={sec} value={sec}>Section {sec}</option>))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentPlacementCard;
