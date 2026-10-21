import { useMemo } from 'react';
import { Building2, UserCheck } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const GradeFormFields = ({
  name,
  setName,
  campusId,
  setCampusId,
  classTeacher,
  setClassTeacher,
  status,
  setStatus,
  campuses = [],
  teachers = []
}) => {
  const campusOptions = useMemo(() => [
    { value: '', label: 'All Campuses / Default' },
    ...campuses.map((c) => ({
      value: c._id,
      label: c.name,
      subtext: c.code ? `Code: ${c.code}` : ''
    }))
  ], [campuses]);

  const teacherOptions = useMemo(() => [
    { value: '', label: 'Unassigned (Select Teacher)' },
    ...teachers.map((t) => ({
      value: t._id,
      label: t.name,
      subtext: t.designation || 'Teacher',
      badge: t.department || ''
    }))
  ], [teachers]);

  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-xs font-semibold text-ink dark:text-white mb-1">
          Grade / Class Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Playgroup, Nursery, Class 1, Matric, O-Level"
          required
          className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 text-xs font-bold text-ink dark:text-white focus:border-primary outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1 flex items-center gap-1">
            <Building2 size={13} className="text-primary" />
            <span>Assigned Campus Branch</span>
          </label>
          <SearchableSelect
            options={campusOptions}
            value={campusId}
            onChange={setCampusId}
            placeholder="Select campus branch..."
            icon={Building2}
            allowClear
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-white mb-1 flex items-center gap-1">
            <UserCheck size={13} className="text-good dark:text-good-dark" />
            <span>Assigned Class Teacher</span>
          </label>
          <SearchableSelect
            options={teacherOptions}
            value={classTeacher}
            onChange={setClassTeacher}
            placeholder="Search & assign teacher..."
            searchPlaceholder="Type name or designation..."
            icon={UserCheck}
            allowClear
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs font-semibold text-ink dark:text-white">Active Status</span>
        <button
          type="button"
          onClick={() => setStatus(status === 'Active' ? 'Inactive' : 'Active')}
          className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
            status === 'Active' ? 'bg-primary' : 'bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform ${
              status === 'Active' ? 'translate-x-5' : 'translate-x-0 bg-ink-muted'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default GradeFormFields;
