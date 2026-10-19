import { useNavigate } from 'react-router-dom';
import { Users, ArrowUpRight } from 'lucide-react';

const ProfileAssignedClassesCard = ({ grades = [], classAssignments = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Assigned Classes & Sections</h3>
          <p className="text-[11px] text-ink-muted">Authorized instructional domains and assigned classroom batches.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/teacher/students')}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Manage My Classes</span>
        </button>
      </div>

      {grades.length === 0 && classAssignments.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-line dark:border-line-dark text-center text-xs text-ink-muted">
          No specific classroom assignments linked yet. Contact your campus administrator.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grades.map((g) => (
            <div
              key={g._id || g.name}
              className="p-3.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-[#141419] flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-xs text-ink dark:text-ink-dark">{g.name}</h4>
                <p className="text-[10px] text-ink-muted">
                  Sections: {Array.isArray(g.sections) && g.sections.length ? g.sections.join(', ') : 'All Sections'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/teacher/attendance')}
                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                title="Mark Attendance"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileAssignedClassesCard;
