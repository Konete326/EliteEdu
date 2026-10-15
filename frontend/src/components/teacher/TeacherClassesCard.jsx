import { GraduationCap, Award, BookOpen } from 'lucide-react';

const TeacherClassesCard = ({ teacher, classTeacherGrades = [] }) => {
  const assignments = teacher?.class_assignments || [];
  const grades = teacher?.grades || [];
  const subjects = teacher?.subjects || [];

  const classTeacherGradeIds = new Set(classTeacherGrades.map((g) => String(g._id)));

  return (
    <div className="rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm text-ink dark:text-ink-dark">My Assigned Classes</h3>
        </div>
        <span className="text-[11px] font-bold text-ink-muted">
          {assignments.length > 0 ? `${assignments.length} Section Assignments` : `${grades.length} Grades`}
        </span>
      </div>

      {assignments.length === 0 && grades.length === 0 && classTeacherGrades.length === 0 ? (
        <div className="py-8 text-center text-xs text-ink-muted border border-dashed border-line dark:border-line-dark rounded-2xl">
          No class assignments assigned yet. Contact your school administrator.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {classTeacherGrades.map((ctg) => (
            <div
              key={ctg._id}
              className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-ink dark:text-ink-dark">{ctg.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white flex items-center gap-1">
                  <Award className="w-3 h-3" /> Class Incharge
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                Sections: {Array.isArray(ctg.sections) ? ctg.sections.join(', ') : 'All'}
              </p>
            </div>
          ))}

          {assignments.map((asg, idx) => {
            const isCT = classTeacherGradeIds.has(String(asg.grade_id?._id || asg.grade_id));
            return (
              <div
                key={asg._id || idx}
                className="p-3.5 rounded-2xl bg-surface-secondary/40 dark:bg-[#16161d] border border-line dark:border-line-dark space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink dark:text-ink-dark">
                    {asg.grade_id?.name || 'Class'} {asg.section ? `- Sec ${asg.section}` : ''}
                  </span>
                  {isCT && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/20 text-primary">
                      Incharge
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-primary dark:text-primary-dark font-medium">
                  <BookOpen className="w-3 h-3" />
                  <span>{asg.subject_id?.name || 'Subject Course'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subjects.length > 0 && (
        <div className="pt-2 border-t border-line dark:border-line-dark">
          <p className="text-[11px] font-semibold text-ink-muted mb-2">Assigned Subject Specializations:</p>
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <span
                key={s._id}
                className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
              >
                {s.name} ({s.code || 'SUB'})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassesCard;
