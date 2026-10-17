import React from 'react';
import { Layers, CheckSquare, Square, AlertCircle } from 'lucide-react';

const SECTIONS = ['A', 'B', 'C', 'D'];

export default function WizardStep2Classes({ formData, setFormData, grades = [] }) {
  const targetClasses = formData.target_classes || [];

  const isGradeSelected = (gradeId) => targetClasses.some((t) => String(t.grade_id) === String(gradeId));

  const toggleGrade = (grade) => {
    if (isGradeSelected(grade._id)) {
      setFormData((prev) => ({
        ...prev,
        target_classes: (prev.target_classes || []).filter((t) => String(t.grade_id) !== String(grade._id))
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        target_classes: [
          ...(prev.target_classes || []),
          { grade_id: grade._id, grade_name: grade.name, sections: ['A'] }
        ]
      }));
    }
  };

  const toggleSection = (gradeId, sec) => {
    setFormData((prev) => ({
      ...prev,
      target_classes: (prev.target_classes || []).map((t) => {
        if (String(t.grade_id) !== String(gradeId)) return t;
        const currentSections = t.sections || [];
        const hasSec = currentSections.includes(sec);
        const next = hasSec ? currentSections.filter((s) => s !== sec) : [...currentSections, sec];
        return { ...t, sections: next.length > 0 ? next : ['A'] };
      })
    }));
  };

  const selectAll = () => {
    setFormData((prev) => ({
      ...prev,
      target_classes: grades.map((g) => ({ grade_id: g._id, grade_name: g.name, sections: ['A'] }))
    }));
  };

  const clearAll = () => {
    setFormData((prev) => ({ ...prev, target_classes: [] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line dark:border-line-dark">
        <div>
          <h3 className="text-base font-bold text-text-primary dark:text-text-primary-dark">Target Classes & Sections</h3>
          <p className="text-xs text-text-muted dark:text-text-muted-dark">Select participating grades for this exam</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={selectAll} className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-hover dark:hover:bg-hover-dark text-text-primary dark:text-text-primary-dark">
            Select All
          </button>
          <button type="button" onClick={clearAll} className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark hover:bg-hover dark:hover:bg-hover-dark text-text-muted dark:text-text-muted-dark">
            Clear
          </button>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="p-6 text-center rounded-xl border border-dashed border-line dark:border-line-dark bg-surface dark:bg-surface-dark">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">No Classes/Grades Found</p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark mt-1">Please create classes in Academic Setup first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {grades.map((grade) => {
            const selected = isGradeSelected(grade._id);
            const classObj = targetClasses.find((t) => String(t.grade_id) === String(grade._id));
            const activeSections = classObj?.sections || [];

            return (
              <div key={grade._id} className={`p-3 rounded-xl border transition-all ${selected ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-line dark:border-line-dark bg-surface dark:bg-surface-dark'}`}>
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => toggleGrade(grade)} className="flex items-center gap-2.5 text-left flex-1">
                    {selected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-text-muted" />}
                    <span className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">{grade.name}</span>
                  </button>
                  <span className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark bg-muted/40 px-2 py-0.5 rounded">
                    {grade.code || 'GRADE'}
                  </span>
                </div>

                {selected && (
                  <div className="mt-3 pt-2.5 border-t border-line/60 dark:border-line-dark/60 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-text-muted dark:text-text-muted-dark mr-1">Sections:</span>
                    {SECTIONS.map((sec) => {
                      const hasSec = activeSections.includes(sec);
                      return (
                        <button key={sec} type="button" onClick={() => toggleSection(grade._id, sec)} className={`text-xs font-bold px-2 py-0.5 rounded transition-colors ${hasSec ? 'bg-primary text-white' : 'bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-text-muted hover:text-text-primary'}`}>
                          {sec}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
