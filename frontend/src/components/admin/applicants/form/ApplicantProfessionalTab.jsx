import { useState, useEffect } from 'react';
import { getApiBase } from '../../../../utils/apiBase';

const AVAILABILITIES = ['Full Time', 'Part Time', 'Contract', 'Visiting'];
const BPS_GRADES = Array.from({ length: 21 }, (_, i) => `BPS-${i + 1}`);
const DEPT_CHIPS = ['Academics', 'Administration', 'Science', 'Mathematics', 'English', 'Sales', 'Sports'];
const DESIG_CHIPS = ['Primary Teacher', 'Assistant', 'Campus Head', 'JEST', 'PST', 'Subject Specialist'];

const ApplicantProfessionalTab = ({ formData, onChange, campuses = [] }) => {
  const [customRoles, setCustomRoles] = useState([]);

  useEffect(() => {
    fetch(`${getApiBase()}/user-management/roles`)
      .then((r) => r.json())
      .then((d) => {
        if (d.roles) setCustomRoles(d.roles.map((r) => r.name));
      })
      .catch(() => {});
  }, []);

  const allDesigChips = Array.from(new Set([...DESIG_CHIPS, ...customRoles]));

  return (
    <div className="p-6 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-sm space-y-6">
      <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-white/10">
        Professional & Institutional Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Campus (Optional)</label>
          <select
            value={formData.campus_id || ''}
            onChange={(e) => onChange('campus_id', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
          >
            <option value="">Main / Unassigned Campus</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Department (Optional)</label>
          <input
            type="text"
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
            placeholder="e.g. Science, Academics"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {DEPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChange('department', chip)}
                className="px-2 py-0.5 text-[10px] rounded-md bg-surface-secondary dark:bg-white/5 hover:bg-primary/10 text-ink-muted hover:text-primary transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Designation (Optional)</label>
          <input
            type="text"
            value={formData.designation || ''}
            onChange={(e) => onChange('designation', e.target.value)}
            placeholder="e.g. Primary Teacher, Assistant"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {allDesigChips.slice(0, 10).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChange('designation', chip)}
                className="px-2 py-0.5 text-[10px] rounded-md bg-surface-secondary dark:bg-white/5 hover:bg-primary/10 text-ink-muted hover:text-primary transition-colors cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Qualification (Optional)</label>
          <input
            type="text"
            value={formData.qualification || ''}
            onChange={(e) => onChange('qualification', e.target.value)}
            placeholder="e.g. M.Sc Physics, B.Ed"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Experience (Years) (Optional)</label>
          <input
            type="number"
            min="0"
            value={formData.experience_years ?? 0}
            onChange={(e) => onChange('experience_years', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Availability (Optional)</label>
          <select
            value={formData.availability || 'Full Time'}
            onChange={(e) => onChange('availability', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
          >
            {AVAILABILITIES.map((av) => (
              <option key={av} value={av}>{av}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">BPS Grade (Optional)</label>
          <select
            value={formData.bps_grade || ''}
            onChange={(e) => onChange('bps_grade', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
          >
            <option value="">Non-Govt / Standard</option>
            {BPS_GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Expected Salary (PKR) (Optional)</label>
          <input
            type="number"
            min="0"
            value={formData.expected_salary ?? 0}
            onChange={(e) => onChange('expected_salary', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Approved Salary (PKR) (Optional)</label>
          <input
            type="number"
            min="0"
            value={formData.approved_salary ?? 0}
            onChange={(e) => onChange('approved_salary', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Previous Employer (Optional)</label>
          <input
            type="text"
            value={formData.previous_employer || ''}
            onChange={(e) => onChange('previous_employer', e.target.value)}
            placeholder="e.g. Army Public School"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Skills & Specializations (Optional)</label>
        <textarea
          rows={2}
          value={formData.skills || ''}
          onChange={(e) => onChange('skills', e.target.value)}
          placeholder="e.g. Science Laboratory Handling, Robotics, Lesson Planning, Sports Coaching"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
        />
      </div>
    </div>
  );
};

export default ApplicantProfessionalTab;
