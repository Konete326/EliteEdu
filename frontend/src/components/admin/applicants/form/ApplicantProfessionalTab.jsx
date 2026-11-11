import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getApiBase } from '../../../../utils/apiBase';

const AVAILABILITIES = ['Full Time', 'Part Time', 'Contract', 'Visiting'];
const BPS_GRADES = Array.from({ length: 21 }, (_, i) => `BPS-${i + 1}`);
const DEPT_CHIPS = ['Academics', 'Administration', 'Science', 'Mathematics', 'English', 'Sales', 'Sports'];
const DESIG_CHIPS = ['Primary Teacher', 'Assistant', 'Campus Head', 'JEST', 'PST', 'Subject Specialist'];

const ApplicantProfessionalTab = ({ formData, onChange, campuses = [] }) => {
  const { user } = useAuth();
  const isGovt = user?.school_type === 'Government' || user?.school_id?.school_type === 'Government';
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
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Campus Branch</label>
          <select
            value={formData.campus_id || ''}
            onChange={(e) => onChange('campus_id', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
          >
            <option value="">All Campuses / Main</option>
            {campuses.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Applying For Position</label>
          <input
            type="text"
            value={formData.applying_for_position || ''}
            onChange={(e) => onChange('applying_for_position', e.target.value)}
            placeholder="e.g. Senior Math Teacher"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Department</label>
          <input
            type="text"
            value={formData.department || ''}
            onChange={(e) => onChange('department', e.target.value)}
            placeholder="e.g. Academics"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {DEPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChange('department', chip)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                  formData.department === chip
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-secondary dark:bg-white/5 text-ink-muted hover:text-ink'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Designation (Standard)</label>
          <input
            type="text"
            value={formData.designation || ''}
            onChange={(e) => onChange('designation', e.target.value)}
            placeholder="e.g. Subject Specialist"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {allDesigChips.slice(0, 6).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onChange('designation', chip)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                  formData.designation === chip
                    ? 'bg-primary text-white font-bold'
                    : 'bg-surface-secondary dark:bg-white/5 text-ink-muted hover:text-ink'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Availability</label>
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

        {isGovt && (
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">BPS Grade (Optional)</label>
            <select
              value={formData.bps_grade || ''}
              onChange={(e) => onChange('bps_grade', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
            >
              <option value="">Select BPS Grade</option>
              {BPS_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default ApplicantProfessionalTab;
