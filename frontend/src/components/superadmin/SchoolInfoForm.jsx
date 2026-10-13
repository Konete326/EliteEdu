import { Building2 } from 'lucide-react';

const SchoolInfoForm = ({ school, setSchool, errors = {} }) => {
  const getFieldClass = (hasError) =>
    `w-full px-3 py-2 rounded-lg border bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 ${
      hasError
        ? 'border-bad focus:ring-bad/20 focus:border-bad'
        : 'border-line dark:border-line-dark focus:ring-primary/20 focus:border-primary'
    }`;

  return (
    <div className="p-6 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark space-y-4 shadow-sm">
      <div className="flex items-center gap-2 font-semibold text-ink dark:text-ink-dark border-b border-line dark:border-line-dark pb-3">
        <Building2 className="w-5 h-5 text-primary" />
        <h2>School Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">School Name *</label>
          <input required value={school.name} onChange={(e) => setSchool({ ...school, name: e.target.value })} className={getFieldClass(false)} placeholder="e.g. City Grammar School" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">School Code *</label>
          <input required value={school.code} onChange={(e) => setSchool({ ...school, code: e.target.value })} className={getFieldClass(errors.code)} placeholder="e.g. CGS-01" />
          {errors.code && <p className="text-bad text-xs mt-1">{errors.code}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">School Type *</label>
          <select value={school.school_type} onChange={(e) => setSchool({ ...school, school_type: e.target.value })} className={getFieldClass(false)}>
            <option value="Private">Private</option>
            <option value="Government">Government</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Affiliated Board</label>
          <input value={school.board} onChange={(e) => setSchool({ ...school, board: e.target.value })} className={getFieldClass(false)} placeholder="e.g. Federal / Karachi" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Phone Number</label>
          <input value={school.contact_number} onChange={(e) => setSchool({ ...school, contact_number: e.target.value })} className={getFieldClass(errors.contact)} placeholder="0300-1234567" />
          {errors.contact && <p className="text-bad text-xs mt-1">{errors.contact}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Official Email</label>
          <input type="email" value={school.email} onChange={(e) => setSchool({ ...school, email: e.target.value })} className={getFieldClass(errors.email)} placeholder="info@school.edu" />
          {errors.email && <p className="text-bad text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-medium text-ink-sub dark:text-ink-sub-dark mb-1">Campus Address</label>
          <input value={school.address} onChange={(e) => setSchool({ ...school, address: e.target.value })} className={getFieldClass(false)} placeholder="Campus location, street address" />
        </div>
      </div>
    </div>
  );
};

export default SchoolInfoForm;
